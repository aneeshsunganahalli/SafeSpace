import axios from 'axios';
import JournalEntry from '../models/JournalEntry.js';

// Get all journal entries for a user
const getJournalEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.id })
      .sort({ date: -1 });
    
    res.status(200).json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ message: 'Failed to fetch journal entries' });
  }
};

// Get a single journal entry
const getJournalEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    res.status(200).json(entry);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ message: 'Failed to fetch journal entry' });
  }
};

// Create a new journal entry
const createJournalEntry = async (req, res) => {
  try {
    const { content, mood, tags } = req.body;
    
    // Create journal entry
    const entry = await JournalEntry.create({
      userId: req.user.id,
      content,
      mood,
      tags
    });
    
    // Process with LLM asynchronously
    processEntryWithLLM(entry._id).catch(err => 
      console.error('Error processing entry with LLM:', err)
    );
    
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ message: 'Failed to create journal entry' });
  }
};

// Update a journal entry
const updateJournalEntry = async (req, res) => {
  try {
    const { content, mood, tags } = req.body;
    
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { content, mood, tags },
      { new: true }
    );
    
    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    // Process updated entry with LLM asynchronously
    processEntryWithLLM(entry._id).catch(err => 
      console.error('Error processing entry with LLM:', err)
    );
    
    res.status(200).json(entry);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ message: 'Failed to update journal entry' });
  }
};

// Delete a journal entry
const deleteJournalEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    res.status(200).json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ message: 'Failed to delete journal entry' });
  }
};

// Get journal insights
const getJournalInsights = async (req, res) => {
  try {
    // Get mood distribution
    const moodDistribution = await JournalEntry.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: "$mood.label", count: { $sum: 1 } } }
    ]);
    
    // Get recent mood trends
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const moodTrend = await JournalEntry.find({
      userId: req.user.id,
      date: { $gte: twoWeeksAgo }
    }).sort({ date: 1 }).select('date mood.score');
    
    // Get common patterns identified
    const commonPatterns = await JournalEntry.aggregate([
      { $match: { userId: req.user.id, 'analysis.processed': true } },
      { $unwind: "$analysis.identifiedPatterns" },
      { $group: { _id: "$analysis.identifiedPatterns", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    res.status(200).json({
      moodDistribution,
      moodTrend,
      commonPatterns
    });
  } catch (error) {
    console.error('Error generating journal insights:', error);
    res.status(500).json({ message: 'Failed to generate journal insights' });
  }
};

// Process journal entry with LLM
async function processEntryWithLLM(entryId) {
  try {
    // Get the entry
    const entry = await JournalEntry.findById(entryId);
    
    if (!entry) return;
    
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return;
    }
    
    // Prepare the prompt
    const prompt = `
      Below is a journal entry from someone reflecting on their day.
      
      ENTRY:
      "${entry.content}"
      
      Please provide:
      1. A supportive response that shows empathy and understanding (max 150 words)
      2. Identify any potential negative thought patterns (catastrophizing, black-and-white thinking, etc.) (max 3)
      3. Suggest 2-3 specific coping strategies or perspective shifts that might help
      
      Format your response as a JSON object with these keys: supportiveResponse, identifiedPatterns, suggestedStrategies
    `;
    
    // Call OpenAI API
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a supportive, empathetic mental health assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Parse the response
    const content = response.data.choices[0].message.content;
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (err) {
      console.error('Failed to parse LLM response:', content);
      analysis = {
        supportiveResponse: "Thank you for sharing your thoughts. I'm here to support you on your journey.",
        identifiedPatterns: [],
        suggestedStrategies: ["Take some time for self-care today."]
      };
    }
    
    // Update the entry with analysis
    await JournalEntry.findByIdAndUpdate(entryId, {
      analysis: {
        ...analysis,
        processed: true
      }
    });
    
  } catch (error) {
    console.error('Error in LLM processing:', error);
    throw error;
  }
}

export {
  getJournalEntries,
  getJournalEntry,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getJournalInsights
};