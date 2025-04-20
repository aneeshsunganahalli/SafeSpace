import JournalEntry from '../models/journalEntryModel.js';
import { removeStopwords, eng } from 'stopword'; // Import stopword library


// Function to calculate word frequencies for word cloud
const getWordCloudData = async (req, res) => {
  console.log(`[WordCloud] Received request for timeframe: ${req.query.timeframe}`); // Add logging
  try {
    const userId = req.user.id;
    const timeframe = req.query.timeframe || 'all'; // Default to 'all' if no timeframe specified
    console.log(`[WordCloud] User ID: ${userId}, Timeframe: ${timeframe}`); // Add logging

    let startDate;
    const now = new Date();

    switch (timeframe) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case 'all':
      default:
        startDate = new Date(0); // Start from the beginning of time
        break;
    }
    console.log(`[WordCloud] Calculated start date: ${startDate}`); // Add logging

    // Fetch entries within the timeframe
    console.log('[WordCloud] Fetching entries from database...'); // Add logging
    const entries = await JournalEntry.find({
      userId: userId,
      date: { $gte: startDate }
    }).select('content');
    console.log(`[WordCloud] Found ${entries.length} entries.`); // Add logging

    if (entries.length === 0) {
      console.log('[WordCloud] No entries found, returning empty array.'); // Add logging
      return res.status(200).json([]); // Return empty array if no entries
    }

    // Combine all content
    console.log('[WordCloud] Combining entry content...'); // Add logging
    const allContent = entries.map(entry => entry.content).join(' ');
    console.log(`[WordCloud] Combined content length: ${allContent.length}`); // Add logging

    // Process text: lowercase, remove punctuation, split into words, remove stopwords
    console.log('[WordCloud] Processing text...'); // Add logging
    const words = allContent
      .toLowerCase()
      .replace(/[^\w\s]|_/g, "") // Remove punctuation except spaces
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .split(' ')
      .filter(word => word.length > 2); // Filter out very short words/artifacts
    console.log(`[WordCloud] Initial word count: ${words.length}`); // Add logging

    console.log('[WordCloud] Removing stopwords...'); // Add logging
    const filteredWords = removeStopwords(words, eng); // Remove English stopwords
    console.log(`[WordCloud] Word count after stopwords: ${filteredWords.length}`); // Add logging

    // Calculate word frequencies
    console.log('[WordCloud] Calculating word frequencies...'); // Add logging
    const wordFrequencies = filteredWords.reduce((acc, word) => {
      if (word) { // Ensure word is not empty string
        acc[word] = (acc[word] || 0) + 1;
      }
      return acc;
    }, {});
    console.log(`[WordCloud] Calculated ${Object.keys(wordFrequencies).length} unique word frequencies.`); // Add logging

    // Format for the word cloud component (e.g., react-wordcloud)
    console.log('[WordCloud] Formatting data for response...'); // Add logging
    const wordCloudData = Object.entries(wordFrequencies)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value) // Sort by frequency descending
      .slice(0, 100); // Limit to top 100 words
    console.log(`[WordCloud] Sending ${wordCloudData.length} words in response.`); // Add logging

    res.status(200).json(wordCloudData);

  } catch (error) {
    // Log the specific error on the server side
    console.error('Error generating word cloud data:', error); // Keep existing log
    console.error(`[WordCloud] Detailed Error: ${error.message}`); // Add more detail
    console.error(`[WordCloud] Error Stack: ${error.stack}`); // Log stack trace
    res.status(500).json({ message: 'Failed to generate word cloud data' });
  }
};

export { getWordCloudData };
