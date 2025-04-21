import GratitudeEntry from '../models/gratitudeEntryModel.js';

// Get today's gratitude entry for the user
const getTodaysGratitude = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const gratitudeEntry = await GratitudeEntry.findOne({
      userId: req.user.id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    res.status(200).json(gratitudeEntry || { entries: [] });
  } catch (error) {
    console.error('Error fetching gratitude entry:', error);
    res.status(500).json({ message: 'Failed to fetch gratitude entry' });
  }
};

// Get recent gratitude entries (last 7 days)
const getRecentGratitude = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    
    const gratitudeEntries = await GratitudeEntry.find({
      userId: req.user.id,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: -1 });
    
    res.status(200).json(gratitudeEntries);
  } catch (error) {
    console.error('Error fetching gratitude entries:', error);
    res.status(500).json({ message: 'Failed to fetch gratitude entries' });
  }
};

// Create or update today's gratitude entry
const createOrUpdateGratitude = async (req, res) => {
  try {
    const { entries } = req.body;
    
    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ message: 'At least one gratitude entry is required' });
    }
    
    // Format entries to match schema
    const formattedEntries = entries.map(entry => ({ content: entry }));
    
    // Set date to beginning of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Try to find and update existing entry for today
    const updatedEntry = await GratitudeEntry.findOneAndUpdate(
      { 
        userId: req.user.id,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        } 
      },
      { entries: formattedEntries },
      { new: true, upsert: true }
    );
    
    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error('Error saving gratitude entry:', error);
    res.status(500).json({ message: 'Failed to save gratitude entry' });
  }
};

export {
  getTodaysGratitude,
  getRecentGratitude,
  createOrUpdateGratitude
};