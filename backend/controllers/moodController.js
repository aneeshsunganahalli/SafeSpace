import JournalEntry from '../models/journalEntryModel.js';
import { removeStopwords, eng } from 'stopword'; // Import stopword library


// Function to calculate word frequencies for word cloud
const getWordCloudData = async (req, res) => {
  console.log(`[WordCloud] Received request for timeframe: ${req.query.timeframe}`);
  try {
    const userId = req.user.id;
    const timeframe = req.query.timeframe || 'all';
    console.log(`[WordCloud] User ID: ${userId}, Timeframe: ${timeframe}`);

    // Calculate start date based on timeframe
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
        startDate = new Date(0);
        break;
    }
    console.log(`[WordCloud] Calculated start date: ${startDate}`);

    // Fetch entries with full data including mood and analysis
    console.log('[WordCloud] Fetching entries from database...');
    const entries = await JournalEntry.find({
      userId: userId,
      date: { $gte: startDate }
    }).select('content mood analysis.identifiedPatterns');
    console.log(`[WordCloud] Found ${entries.length} entries.`);

    if (entries.length === 0) {
      console.log('[WordCloud] No entries found, returning empty array.');
      return res.status(200).json([]);
    }

    // List of mood-related words to specifically look for
    const moodWords = [
      // Positive emotions
      'happy', 'excited', 'joy', 'ecstatic', 'peaceful', 'content', 'satisfied', 'grateful', 'optimistic', 
      'confident', 'enthusiastic', 'proud', 'calm', 'relaxed', 'hopeful', 'blessed', 'amazing', 'wonderful',
      
      // Negative emotions
      'sad', 'angry', 'anxious', 'frustrated', 'worried', 'depressed', 'stressed', 'overwhelmed', 'upset',
      'disappointed', 'hurt', 'lonely', 'guilty', 'insecure', 'tired', 'exhausted', 'annoyed', 'afraid',
      'nervous', 'scared', 'miserable', 'helpless', 'hopeless',
      
      // Neutral/Mixed emotions
      'confused', 'surprised', 'uncertain', 'indifferent', 'ambivalent', 'curious', 'thoughtful', 'reflective',
      'nostalgic', 'bittersweet', 'contemplative'
    ];

    // Combine all content and extract words
    console.log('[WordCloud] Processing text for emotion-related words...');
    const allContent = entries.map(entry => entry.content).join(' ');
    
    // Process text to get all words
    const words = allContent
      .toLowerCase()
      .replace(/[^\w\s]|_/g, "")
      .replace(/\s+/g, " ")
      .split(' ')
      .filter(word => word.length > 2);
    
    console.log(`[WordCloud] Initial word count: ${words.length}`);
    
    // Remove common stopwords but KEEP mood-related words
    console.log('[WordCloud] Filtering to mood-specific words...');
    const filteredWords = removeStopwords(words, eng)
      .filter(word => {
        // Keep word if it's in our mood words list OR if it's a potentially meaningful word (not in stopwords)
        return moodWords.includes(word) || 
               // You can add additional filters here to keep meaningful words
               word.length > 3; // Simple heuristic to keep slightly longer words
      });
    
    console.log(`[WordCloud] Word count after mood filtering: ${filteredWords.length}`);

    // Add mood labels from journal entries as additional "words" to emphasize them
    entries.forEach(entry => {
      if (entry.mood && entry.mood.label) {
        // Add the mood label to the filtered words list (multiple times to increase its weight)
        for (let i = 0; i < 3; i++) { // Add each mood 3 times to emphasize it
          filteredWords.push(entry.mood.label.toLowerCase());
        }
      }
      
      // Add identified patterns/themes if they exist (these are often emotion-related)
      if (entry.analysis && entry.analysis.identifiedPatterns && Array.isArray(entry.analysis.identifiedPatterns)) {
        entry.analysis.identifiedPatterns.forEach(pattern => {
          if (typeof pattern === 'string') {
            // Split the pattern into words and add them
            const patternWords = pattern.toLowerCase()
              .replace(/[^\w\s]|_/g, "")
              .replace(/\s+/g, " ")
              .split(' ')
              .filter(word => word.length > 3);
            
            // Add each pattern word to increase their weight
            filteredWords.push(...patternWords);
          }
        });
      }
    });

    // Calculate word frequencies
    console.log('[WordCloud] Calculating word frequencies...');
    const wordFrequencies = filteredWords.reduce((acc, word) => {
      if (word) {
        acc[word] = (acc[word] || 0) + 1;
      }
      return acc;
    }, {});
    console.log(`[WordCloud] Calculated ${Object.keys(wordFrequencies).length} unique mood-related word frequencies.`);

    // Format for the word cloud component
    console.log('[WordCloud] Formatting data for response...');
    const wordCloudData = Object.entries(wordFrequencies)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 100); // Limit to top 100 words
    console.log(`[WordCloud] Sending ${wordCloudData.length} mood-related words in response.`);

    res.status(200).json(wordCloudData);

  } catch (error) {
    console.error('Error generating word cloud data:', error);
    console.error(`[WordCloud] Detailed Error: ${error.message}`);
    console.error(`[WordCloud] Error Stack: ${error.stack}`);
    res.status(500).json({ message: 'Failed to generate word cloud data' });
  }
};

export { getWordCloudData };
