import axios from 'axios';
import JournalEntry from '../models/journalEntryModel.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
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
  getJournalInsights
};