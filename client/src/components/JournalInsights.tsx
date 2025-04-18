"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface MoodDistribution {
  _id: string;
  count: number;
}

interface MoodTrend {
  _id: string;
  date: string;
  "mood.score": number;
}

interface CommonPattern {
  _id: string;
  count: number;
}

export default function JournalInsights() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [insights, setInsights] = useState<{
    moodDistribution: MoodDistribution[];
    moodTrend: MoodTrend[];
    commonPatterns: CommonPattern[];
  }>({
    moodDistribution: [],
    moodTrend: [],
    commonPatterns: [],
  });
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(`${backendUrl}/api/journal/insights`, config);
      setInsights(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching journal insights:", err);
      setError("Failed to load insights. Please try again later.");
      setLoading(false);
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

  // Calculate total entries for percentage
  const totalMoodEntries = insights.moodDistribution.reduce(
    (sum, item) => sum + item.count, 
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (totalMoodEntries === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 mb-4">You need more journal entries to generate insights.</p>
        <button
          onClick={() => window.location.href = "/journal?tab=new"}
          className="py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Create a Journal Entry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Mental Health Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mood Distribution</h3>
          <div className="space-y-4">
            {insights.moodDistribution.map((item) => (
              <div key={item._id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item._id} {getMoodEmoji(item._id)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round((item.count / totalMoodEntries) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getMoodColor(item._id)}`}
                    style={{ width: `${(item.count / totalMoodEntries) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Mood Trends */}
        {insights.moodTrend.length > 1 && (
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Mood Trends</h3>
            <div className="h-64 flex items-end justify-between">
              {insights.moodTrend.map((entry, index) => {
                // Calculate height percentage (1-10 scale to 10%-100%)
                const heightPercentage = (entry["mood.score"] || 5) * 10;
                
                // Determine color based on mood score
                let barColor;
                if (entry["mood.score"] <= 2) barColor = "bg-red-500";
                else if (entry["mood.score"] <= 4) barColor = "bg-orange-400";
                else if (entry["mood.score"] <= 6) barColor = "bg-gray-400";
                else if (entry["mood.score"] <= 8) barColor = "bg-green-400";
                else barColor = "bg-emerald-500";
                
                return (
                  <div 
                    key={index} 
                    className="flex flex-col items-center"
                    title={`Score: ${entry["mood.score"]}`}
                  >
                    <div 
                      className={`w-4 ${barColor} rounded-t`}
                      style={{ height: `${heightPercentage}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left">
                      {formatDate(entry.date)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Common Patterns */}
        {insights.commonPatterns.length > 0 && (
          <div className="bg-white p-5 rounded-lg shadow-lg md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Common Thought Patterns</h3>
            <div className="space-y-2">
              {insights.commonPatterns.map((pattern) => (
                <div key={pattern._id} className="p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between">
                    <span className="text-gray-800">{pattern._id}</span>
                    <span className="text-gray-500 text-sm">
                      Identified {pattern.count} {pattern.count === 1 ? "time" : "times"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 bg-white p-5 rounded-lg shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Suggestions for Improvement</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Journal regularly to get more accurate insights</li>
          <li>Try to identify triggers for negative moods</li>
          <li>Practice coping strategies suggested in your journal entries</li>
          <li>Celebrate improvements in your mood over time</li>
          <li>Revisit past entries to reflect on your growth and progress</li>
        </ul>
        
        <div className="mt-4 p-4 bg-yellow-50 rounded-md border border-yellow-100">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> These insights are generated based on your journal entries and are meant for self-reflection. They are not a substitute for professional mental health advice.
          </p>
        </div>
      </div>
    </div>
  );
}