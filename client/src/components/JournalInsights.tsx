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

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/journal/insights`,
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
            'rgba(239, 68, 68, 0.7)', // Very Negative - Red
            'rgba(249, 115, 22, 0.7)', // Negative - Orange
            'rgba(234, 179, 8, 0.7)',  // Neutral - Yellow
            'rgba(132, 204, 22, 0.7)', // Positive - Light Green
            'rgba(34, 197, 94, 0.7)',  // Very Positive - Green
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

    return {
      labels: sortedMoodData.map(item => item._id),
      datasets: [{
        label: 'Mood Distribution',
        data: sortedMoodData.map(item => item.count),
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)', // Very Negative - Red
          'rgba(249, 115, 22, 0.7)', // Negative - Orange
          'rgba(234, 179, 8, 0.7)',  // Neutral - Yellow
          'rgba(132, 204, 22, 0.7)', // Positive - Light Green
          'rgba(34, 197, 94, 0.7)',  // Very Positive - Green
        ],
        borderWidth: 1
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

        {/* Timeframe toggle for mood trends */}
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button 
              onClick={() => setTimeframe('week')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                timeframe === 'week' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Weekly View
            </button>
            <button 
              onClick={() => setTimeframe('month')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                timeframe === 'month' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Monthly View
            </button>
          </div>

          {/* Mood Trend Chart */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              {timeframe === 'week' ? 'Weekly' : 'Monthly'} Mood Trend
            </h3>
            <div className="h-64">
              {insightsData?.moodTrend && insightsData.moodTrend.length > 0 ? (
                <Line 
                  data={timeframe === 'week' ? prepareWeeklyMoodTrendData() : prepareMonthlyMoodTrendData()} 
                  options={chartOptions} 
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">No mood data available for this timeframe</p>
                </div>
              )}
            </div>
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
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }} 
              />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No mood distribution data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Common Patterns Section */}
        {insightsData?.commonPatterns && insightsData.commonPatterns.length > 0 && (
          <div className="mt-6 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
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