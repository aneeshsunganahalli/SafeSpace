import JournalEntry from '../models/journalEntryModel.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

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


const getJournalInsights = async (req, res) => {
  try {
    // Get entries to work with
    const entries = await JournalEntry.find({ userId: req.user.id });
    
    // Check if we have any entries
    if (entries.length === 0) {
      return res.status(200).json({
        moodDistribution: [],
        moodTrend: [],
        commonPatterns: [],
        unprocessedCount: 0
      });
    }
    
    // Calculate mood distribution manually if necessary
    let moodDistribution = await JournalEntry.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: "$mood.label", count: { $sum: 1 } } },
      { $match: { _id: { $ne: null } } } // Filter out null labels
    ]);
    
    // If mood distribution is empty, calculate based on scores
    if (moodDistribution.length === 0) {
      // Initialize counters for each mood range
      const moodCounts = {
        'Very Negative': 0,
        'Negative': 0,
        'Neutral': 0,
        'Positive': 0,
        'Very Positive': 0
      };
      
      // Count entries in each mood range
      entries.forEach(entry => {
        if (!entry.mood || !entry.mood.score) return;
        
        const score = entry.mood.score;
        if (score <= 2) moodCounts['Very Negative']++;
        else if (score <= 4) moodCounts['Negative']++;
        else if (score <= 6) moodCounts['Neutral']++;
        else if (score <= 8) moodCounts['Positive']++;
        else moodCounts['Very Positive']++;
      });
      
      // Convert to expected format for frontend
      moodDistribution = Object.entries(moodCounts)
        .filter(([_, count]) => count > 0) // Only include moods that have entries
        .map(([label, count]) => ({ _id: label, count }));
    }
    
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
      { $unwind: { path: "$analysis.identifiedPatterns", preserveNullAndEmptyArrays: false } },
      { $group: { _id: "$analysis.identifiedPatterns", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Get count of unprocessed entries
    const unprocessedCount = await JournalEntry.countDocuments({
      userId: req.user.id,
      'analysis.processed': { $ne: true }
    });
    
    res.status(200).json({
      moodDistribution,
      moodTrend,
      commonPatterns,
      unprocessedCount
    });
  } catch (error) {
    console.error('Error generating journal insights:', error);
    res.status(500).json({ message: 'Failed to generate journal insights' });
  }
};

// Reprocess journal entries with AI that haven't been processed yet
const reprocessJournalEntries = async (req, res) => {
  try {
    // Find entries that need processing
    const entries = await JournalEntry.find({
      userId: req.user.id,
      'analysis.processed': { $ne: true }
    });
    
    if (entries.length === 0) {
      return res.status(200).json({ 
        message: 'No entries to process',
        processedCount: 0
      });
    }
    
    // Process entries - do this in sequence to avoid overloading the API
    let processedCount = 0;
    
    // Process up to 10 entries to avoid timeouts
    const entriesToProcess = entries.slice(0, 10);
    
    for (const entry of entriesToProcess) {
      try {
        await processEntryWithLLM(entry._id);
        processedCount++;
      } catch (error) {
        console.error(`Error processing entry ${entry._id}:`, error);
        // Continue with other entries even if one fails
      }
    }
    
    res.status(200).json({
      message: `Successfully processed ${processedCount} entries`,
      processedCount,
      remainingCount: entries.length - processedCount
    });
    
  } catch (error) {
    console.error('Error reprocessing journal entries:', error);
    res.status(500).json({ message: 'Failed to reprocess journal entries' });
  }
};

// Reprocess a specific journal entry with AI
const reprocessSingleEntry = async (req, res) => {
  try {
    // Check if the entry exists and belongs to the user
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    // Process the entry with LLM
    await processEntryWithLLM(entry._id);
    
    res.status(200).json({ 
      message: 'Journal entry analysis started',
      entryId: entry._id
    });
  } catch (error) {
    console.error('Error reprocessing journal entry:', error);
    res.status(500).json({ message: 'Failed to reprocess journal entry' });
  }
};

// Process journal entry with Gemini
async function processEntryWithLLM(entryId) {
  try {
    // Get the entry
    const entry = await JournalEntry.findById(entryId);
    
    if (!entry) return;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Gemini API key not configured');
      return;
    }
    
    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Prepare the prompt - add specific instructions about JSON format
    const prompt = `
      Below is a journal entry from someone reflecting on their day.
      
      ENTRY:
      "${entry.content}"
      
      Please provide:
      1. A supportive response that shows empathy and understanding (max 150 words)
      2. Identify any potential negative thought patterns (catastrophizing, black-and-white thinking, etc.) (max 3)
      3. Suggest 2-3 specific coping strategies or perspective shifts that might help
      
      Format your response as a valid, parseable JSON object with these keys: supportiveResponse, identifiedPatterns, suggestedStrategies.
      Keep all values as simple strings without any special formatting or line breaks inside the strings.
      Make sure the JSON is correctly formatted with double quotes around keys and string values.
    `;
    
    // Call Gemini API with safety settings
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    });
    
    const response = result.response;
    let content = response.text();
    
    // Improved JSON parsing with better error handling
    let analysis;
    try {
      // Extract the JSON part if it's wrapped in markdown code blocks (```json...```)
      const jsonMatch = content.match(/```json\s*({[\s\S]*?})\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        content = jsonMatch[1];
      }
      
      // Clean up the content to ensure it's valid JSON
      // Remove any potential control characters and normalize quotes
      content = content
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
        .replace(/[\u2018\u2019]/g, "'") // Normalize single quotes
        .replace(/[\u201C\u201D]/g, '"'); // Normalize double quotes
      
      analysis = JSON.parse(content);
      
      // Validate expected structure
      if (!analysis.supportiveResponse || !analysis.identifiedPatterns || !analysis.suggestedStrategies) {
        throw new Error('Response missing required fields');
      }
    } catch (err) {
      console.error('Failed to parse Gemini response:', content);
      console.error('Parse error:', err.message);
      
      // Create a fallback analysis if parsing fails
      analysis = {
        supportiveResponse: "Thank you for sharing your thoughts. I'm here to support you on your journey.",
        identifiedPatterns: ["Unable to analyze patterns at this time"],
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
    console.error('Error in Gemini processing:', error);
    throw error;
  }
}

export {
  getJournalEntries,
  getJournalEntry,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getJournalInsights,
  reprocessJournalEntries,
  reprocessSingleEntry
};