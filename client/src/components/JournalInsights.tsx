'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import WordCloudDisplay from './WordCloudDisplay'; // Import the WordCloudDisplay component

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MoodTrendPoint {
  date: string;
  mood: {
    score: number;
  };
}

interface MoodDistribution {
  _id: string;
  count: number;
}

interface JournalInsightsData {
  moodTrend: MoodTrendPoint[];
  moodDistribution: MoodDistribution[];
  commonPatterns: { _id: string; count: number }[];
  unprocessedCount: number;
}

export default function JournalInsights() {
  const [insightsData, setInsightsData] = useState<JournalInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const { token } = useAuth();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await axios.get(
          `${backendUrl}/api/journal/insights`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setInsightsData(response.data);
      } catch (err) {
        console.error('Error fetching journal insights:', err);
        setError('Failed to load insights data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInsights();
    }
  }, [token]);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Prepare weekly mood trend data
  const prepareWeeklyMoodTrendData = () => {
    if (!insightsData?.moodTrend || insightsData.moodTrend.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Mood Score (Weekly)',
          data: [],
          borderColor: 'rgb(0, 0, 0)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          tension: 0.3
        }]
      };
    }

    // Get the last 7 days of data
    const lastWeekData = insightsData.moodTrend
      .slice(-7)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      labels: lastWeekData.map(item => formatDate(item.date)),
      datasets: [{
        label: 'Mood Score (Weekly)',
        data: lastWeekData.map(item => item.mood.score),
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        tension: 0.3
      }]
    };
  };

  // Prepare monthly mood trend data
  const prepareMonthlyMoodTrendData = () => {
    if (!insightsData?.moodTrend || insightsData.moodTrend.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Mood Score (Monthly)',
          data: [],
          borderColor: 'rgb(0, 0, 0)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          tension: 0.3
        }]
      };
    }

    const lastMonthData = insightsData.moodTrend
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      labels: lastMonthData.map(item => formatDate(item.date)),
      datasets: [{
        label: 'Mood Score (Monthly)',
        data: lastMonthData.map(item => item.mood.score),
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        tension: 0.3
      }]
    };
  };

  // Prepare mood distribution data
  const prepareMoodDistributionData = () => {
    if (!insightsData?.moodDistribution || insightsData.moodDistribution.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Mood Distribution',
          data: [],
          backgroundColor: [
            'rgba(60, 60, 60, 0.7)',    // Very Negative - Dark Grey
            'rgba(251, 228, 231, 0.8)', // Negative - Accent Pink (#FBE4E7 with alpha)
            'rgba(242, 244, 248, 0.8)', // Neutral - Primary BG (#F2F4F8 with alpha)
            'rgba(207, 227, 220, 0.8)', // Positive - Accent Mint (#CFE3DC with alpha)
            'rgba(193, 223, 240, 0.8)', // Very Positive - Accent Blue (#C1DFF0 with alpha)
          ],
          borderColor: [
            'rgb(60, 60, 60)',
            'rgb(251, 228, 231)',
            'rgb(242, 244, 248)',
            'rgb(207, 227, 220)',
            'rgb(193, 223, 240)',
          ],
          borderWidth: 1
        }]
      };
    }

    // Sort moods in logical order from very negative to very positive
    const moodOrder = ['Very Negative', 'Negative', 'Neutral', 'Positive', 'Very Positive'];
    const sortedMoodData = [...insightsData.moodDistribution].sort((a, b) => {
      return moodOrder.indexOf(a._id) - moodOrder.indexOf(b._id);
    });

    // Ensure we have data for all mood categories, even if count is 0
    const completeMoodData = moodOrder.map(mood => {
        const existingData = sortedMoodData.find(item => item._id === mood);
        return { _id: mood, count: existingData ? existingData.count : 0 };
    });


    return {
      labels: completeMoodData.map(item => item._id),
      datasets: [{
        label: 'Mood Distribution',
        data: completeMoodData.map(item => item.count),
        backgroundColor: [
          'rgba(60, 60, 60, 0.7)',    // Very Negative - Dark Grey
          'rgba(251, 228, 231, 0.8)', // Negative - Accent Pink (#FBE4E7 with alpha)
          'rgba(242, 244, 248, 0.8)', // Neutral - Primary BG (#F2F4F8 with alpha)
          'rgba(207, 227, 220, 0.8)', // Positive - Accent Mint (#CFE3DC with alpha)
          'rgba(193, 223, 240, 0.8)', // Very Positive - Accent Blue (#C1DFF0 with alpha)
        ],
        borderColor: [
          'rgb(60, 60, 60)',
          'rgb(251, 228, 231)',
          'rgb(242, 244, 248)',
          'rgb(207, 227, 220)',
          'rgb(193, 223, 240)',
        ],
        borderWidth: 1,
        borderRadius: 4, // Add rounded corners to bars
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 10,
        title: {
          display: true,
          text: 'Mood Score'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const moodScore = context.raw;
            let moodLabel = '';

            if (moodScore <= 2) moodLabel = 'Very Negative';
            else if (moodScore <= 4) moodLabel = 'Negative';
            else if (moodScore <= 6) moodLabel = 'Neutral';
            else if (moodScore <= 8) moodLabel = 'Positive';
            else moodLabel = 'Very Positive';

            return `Score: ${moodScore}/10 (${moodLabel})`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow-sm">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow-sm">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-black mb-6">Your Mood Insights</h2>

        {/* Grid layout for charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Mood Trend Chart */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {timeframe === 'week' ? 'Weekly' : 'Monthly'} Mood Trend
              </h3>
              {/* Timeframe toggle for mood trends */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => setTimeframe('week')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    timeframe === 'week' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setTimeframe('month')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    timeframe === 'month' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
            <div className="h-64">
              {insightsData?.moodTrend && insightsData.moodTrend.length > 0 ? (
                <Line 
                  data={timeframe === 'week' ? prepareWeeklyMoodTrendData() : prepareMonthlyMoodTrendData()} 
                  options={chartOptions} 
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">No mood data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Mood Distribution Chart */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Mood Distribution</h3>
            <div className="h-64">
              {insightsData?.moodDistribution && insightsData.moodDistribution.length > 0 ? (
                <Bar
                  data={prepareMoodDistributionData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { // Add scales configuration for axis titles
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Entries'
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Mood Category'
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false // Keep legend hidden
                      },
                      tooltip: { // Enhance tooltip
                        callbacks: {
                          title: function(context) {
                            // Use the label (Mood Category) as the title
                            return context[0].label;
                          },
                          label: function(context) {
                            // Show the count
                            let label = context.dataset.label || '';
                            if (label) {
                              label += ': ';
                            }
                            if (context.parsed.y !== null) {
                              label += `${context.parsed.y} entries`;
                            }
                            return label;
                          }
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">No mood distribution data</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Word Cloud Display - Add it here */}
        <div className="mb-6">
          <WordCloudDisplay />
        </div>

        {/* Common Patterns Section */}
        {insightsData?.commonPatterns && insightsData.commonPatterns.length > 0 && (
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Common Patterns</h3>
            <ul className="space-y-2">
              {insightsData.commonPatterns.map((pattern, index) => (
                <li key={index} className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                  <span className="text-gray-700">{pattern._id}</span>
                  <span className="ml-2 text-xs text-gray-500">({pattern.count} entries)</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}