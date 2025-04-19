"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Insight {
  type: string;
  title: string;
  description: string;
  data: any;
}

export default function JournalInsights() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      console.log("Fetching insights with token:", token ? "Token exists" : "No token");
      const response = await axios.get(`${backendUrl}/api/journal/insights`, config);
      console.log("Insights data received:", response.data);
      
      // Ensure insights is always an array
      const insightsData = Array.isArray(response.data) ? response.data : [];
      setInsights(insightsData);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching journal insights:", err);
      setError("Failed to load insights. Please try again later.");
      setLoading(false);
    }
  };

  const handleRefreshAnalysis = async () => {
    try {
      setRefreshing(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      await axios.post(`${backendUrl}/api/journal/reprocess`, {}, config);
      
      // Fetch updated insights
      await fetchInsights();
      setRefreshing(false);
    } catch (err) {
      console.error("Error reprocessing journal entries:", err);
      setError("Failed to reprocess journal entries. Please try again later.");
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric" 
    });
  };

  const getMoodColor = (label: string) => {
    switch (label) {
      case "Very Negative": return "bg-red-500";
      case "Negative": return "bg-orange-400";
      case "Neutral": return "bg-gray-400";
      case "Positive": return "bg-green-400";
      case "Very Positive": return "bg-emerald-500";
      default: return "bg-gray-400";
    }
  };

  const getMoodEmoji = (label: string) => {
    switch (label) {
      case "Very Negative": return "😢";
      case "Negative": return "😕";
      case "Neutral": return "😐";
      case "Positive": return "🙂";
      case "Very Positive": return "😄";
      default: return "😐";
    }
  };

  // Calculate total entries for percentage - safely handle non-array case
  const totalMoodEntries = Array.isArray(insights) ? 
    insights.reduce(
      (sum, item) => sum + (item.type === "moodDistribution" ? item.data?.count || 0 : 0), 
      0
    ) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black">
          Your Mental Wellbeing Insights
        </h2>
        <button 
          onClick={handleRefreshAnalysis}
          disabled={refreshing || loading}
          className={`px-4 py-2 rounded-md text-sm flex items-center ${refreshing || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800 text-white'}`}
        >
          {refreshing ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Refreshing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh Analysis
            </>
          )}
        </button>
      </div>

      <div className="mb-6">
        <p className="text-gray-700">
          Insights are generated based on the analysis of your journal entries over time.
          They help you understand patterns, track your mood, and identify potential areas for growth.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : error ? (
        <div className="bg-white border-l-4 border-black p-4 rounded-md">
          <p className="text-sm text-black">{error}</p>
        </div>
      ) : insights.length === 0 ? (
        <div className="bg-white rounded-lg p-6 text-center border border-gray-100">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <h3 className="text-lg font-medium text-black mb-2">
            No insights available yet
          </h3>
          <p className="text-gray-700 mb-4">
            Continue journaling regularly to generate meaningful insights about your mental wellbeing.
            <br/>
            Click the "Refresh Analysis" button above to analyze your latest entries.
          </p>
        </div>
      ) : (
        <>
          {/* Mood Distribution Summary */}
          {totalMoodEntries > 0 && (
            <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm mb-6">
              <h3 className="text-lg font-medium text-black mb-3">
                Current Mood Overview
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {insights
                  .filter(insight => insight.type === "moodDistribution")
                  .flatMap(insight => 
                    Object.entries(insight.data || {}).filter(([key]) => key !== "count")
                      .map(([mood, count]) => ({mood, count: Number(count)}))
                  )
                  .map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`px-4 py-2 rounded-md flex items-center ${getMoodColor(item.mood)}`}
                    >
                      <span className="mr-2 text-lg">{getMoodEmoji(item.mood)}</span>
                      <div>
                        <div className="text-sm font-medium">{item.mood}</div>
                        <div className="text-xs">
                          {item.count} entries ({Math.round((item.count / totalMoodEntries) * 100)}%)
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm"
              >
                <h3 className="text-lg font-medium text-black mb-3">
                  {insight.title}
                </h3>
                <p className="text-gray-700 mb-4">{insight.description}</p>

                {insight.type === "moodTrend" && renderMoodTrend(insight.data)}
                {insight.type === "topTags" && renderTopTags(insight.data)}
                {insight.type === "frequencyPatterns" && renderFrequencyPatterns(insight.data)}
                {insight.type === "sentimentAnalysis" && renderSentimentAnalysis(insight.data)}
                {insight.type === "textInsight" && renderTextInsight(insight.data)}
                
                {/* If we have dates data, show it formatted properly */}
                {insight.data && insight.data.dates && (
                  <div className="mt-3 text-xs text-gray-500">
                    <p>Data from {formatDate(insight.data.dates.start)} to {formatDate(insight.data.dates.end)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer notice */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>
          These insights are based on patterns detected in your journal entries over time.
          <br />
          They are not meant to replace professional mental health advice.
        </p>
      </div>
    </div>
  );

  // Rendering functions for different insight types
  function renderMoodTrend(data: any) {
    if (!data || !data.weeks || !data.weeks.length) {
      return <p className="text-sm italic text-gray-500">Not enough data to show mood trends.</p>;
    }

    return (
      <div className="pt-1">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Low</span>
          <span>Mood Score</span>
          <span>High</span>
        </div>
        <div className="flex space-x-1">
          {data.weeks.map((week: any, idx: number) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-white rounded-sm border border-gray-100" 
                style={{ height: '80px' }}
              >
                <div 
                  className="bg-black rounded-sm w-full transition-all duration-300"
                  style={{ 
                    height: `${(week.averageScore / 10) * 100}%`,
                    marginTop: `${100 - (week.averageScore / 10) * 100}%`
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-1">W{idx + 1}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-700">
          <span className="font-medium">Average: </span>
          {data.overallAverage}/10
        </div>
      </div>
    );
  }

  function renderTopTags(data: any) {
    if (!data || !data.tags || !data.tags.length) {
      return <p className="text-sm italic text-gray-500">No tags found in your entries.</p>;
    }

    return (
      <div>
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag: any, idx: number) => (
            <div 
              key={idx}
              className="px-3 py-1.5 border border-gray-200 rounded-full text-sm flex items-center"
            >
              <span className="text-black">{tag.name}</span>
              <span className="ml-2 text-xs px-1.5 py-0.5 bg-white text-black border border-gray-200 rounded-full">
                {tag.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderFrequencyPatterns(data: any) {
    if (!data || !data.days) {
      return <p className="text-sm italic text-gray-500">Not enough data to show patterns.</p>;
    }
    
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const maxCount = Math.max(...Object.values(data.days) as number[]);

    return (
      <div className="flex items-end space-x-2 mt-4 h-24">
        {days.map(day => (
          <div key={day} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-black" 
              style={{ 
                height: `${((data.days[day] || 0) / maxCount) * 100}%`,
                opacity: ((data.days[day] || 0) / maxCount) * 0.9 + 0.1
              }}
            ></div>
            <span className="text-xs text-gray-500 mt-1">{day}</span>
          </div>
        ))}
      </div>
    );
  }

  function renderSentimentAnalysis(data: any) {
    if (!data) {
      return <p className="text-sm italic text-gray-500">Not enough data for sentiment analysis.</p>;
    }

    const categories = Object.keys(data);
    const total = categories.reduce((sum, key) => sum + data[key], 0);

    return (
      <div className="mt-2">
        {categories.map(category => {
          const percentage = total > 0 ? Math.round((data[category] / total) * 100) : 0;
          return (
            <div key={category} className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700 capitalize">{category}</span>
                <span className="text-black">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-black h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderTextInsight(data: any) {
    if (!data || !data.text) {
      return <p className="text-sm italic text-gray-500">No insight available.</p>;
    }

    return (
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-700">{data.text}</p>
        {data.suggestions && data.suggestions.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-medium text-black">Suggestions:</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {data.suggestions.map((suggestion: string, idx: number) => (
                <li key={idx}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}