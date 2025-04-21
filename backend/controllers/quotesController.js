import axios from 'axios';

// Get a random quote from ZenQuotes API
export const getRandomQuote = async (req, res) => {
  try {
    const response = await axios.get('https://zenquotes.io/api/random');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching quote from ZenQuotes API:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quote',
      error: error.message
    });
  }
};

// Get a daily quote from ZenQuotes API
export const getDailyQuote = async (req, res) => {
  try {
    const response = await axios.get('https://zenquotes.io/api/today');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching daily quote from ZenQuotes API:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily quote',
      error: error.message
    });
  }
};