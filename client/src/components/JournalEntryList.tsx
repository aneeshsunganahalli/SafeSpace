"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import JournalEntryDetail from "./JournalEntryDetail";

interface JournalEntry {
  _id: string;
  content: string;
  date: string;
  mood: {
    score: number;
    label: string;
  };
  tags: string[];
  analysis: {
    supportiveResponse?: string;
    identifiedPatterns?: string[];
    suggestedStrategies?: string[];
    processed: boolean;
  };
}

interface JournalEntryListProps {
  shouldRefresh?: boolean;
}

export default function JournalEntryList({ shouldRefresh = false }: JournalEntryListProps) {
  const { token } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Initial fetch on component mount
  useEffect(() => {
    fetchEntries();
  }, []);

  // Fetch entries when shouldRefresh changes to true
  useEffect(() => {
    if (shouldRefresh) {
      fetchEntries();
    }
  }, [shouldRefresh]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(`${backendUrl}/api/journal`, config);
      setEntries(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching journal entries:", err);
      setError("Failed to load your journal entries");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!window.confirm("Are you sure you want to delete this journal entry?")) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      await axios.delete(`${backendUrl}/api/journal/${entryId}`, config);
      
      // Update local state
      setEntries(entries.filter(entry => entry._id !== entryId));
      
      // Close detail view if the deleted entry was selected
      if (selectedEntry && selectedEntry._id === entryId) {
        setSelectedEntry(null);
      }
    } catch (err) {
      console.error("Error deleting journal entry:", err);
      alert("Failed to delete journal entry");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // Truncate content for preview
  const truncate = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

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

  if (entries.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 mb-4">You haven't created any journal entries yet.</p>
        <button
          onClick={() => window.location.href = "/journal?tab=new"}
          className="py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Create Your First Entry
        </button>
      </div>
    );
  }

  if (selectedEntry) {
    return (
      <JournalEntryDetail 
        entry={selectedEntry} 
        onBack={() => setSelectedEntry(null)} 
        onDelete={() => handleDeleteEntry(selectedEntry._id)}
        onRefresh={fetchEntries}
      />
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Journal Entries</h2>
      
      <div className="space-y-4">
        {entries.map((entry) => (
          <div 
            key={entry._id} 
            onClick={() => setSelectedEntry(entry)}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500">{formatDate(entry.date)}</div>
                <div className="mt-1 font-medium">
                  {entry.mood.label} {getMoodEmoji(entry.mood.label)}
                </div>
              </div>
              <div className="flex space-x-1">
                {entry.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-xs px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-2 text-gray-600">
              {truncate(entry.content)}
            </div>
            
            {entry.analysis.processed && (
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Analysis available
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}