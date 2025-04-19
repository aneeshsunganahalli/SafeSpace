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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C1DFF0] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 border-l-4 border-[#FBE4E7] fade-in">
        <p className="text-sm text-[#3C3C3C] flex items-center">
          <svg className="w-5 h-5 mr-2 text-[#FBE4E7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="card text-center py-12 px-8 fade-in max-w-lg mx-auto">
        <div className="bg-[#C1DFF0]/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-[#3C3C3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-[#3C3C3C] mb-4">Your Journal Journey Starts Here</h3>
        <p className="text-[#3C3C3C] mb-6 max-w-sm mx-auto">Capture your thoughts, track your emotions, and gain valuable insights about your mental wellbeing.</p>
        <button
          onClick={() => window.location.href = "/journal?tab=new"}
          className="py-3 px-8 bg-[#3C3C3C] text-white rounded-full hover:bg-[#3C3C3C]/90 transition-all transform hover:scale-105 shadow-md flex items-center mx-auto"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
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
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-[#3C3C3C] flex items-center">
          <svg className="w-6 h-6 mr-2 text-[#C1DFF0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Your Journal Entries
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map((entry) => (
          <div 
            key={entry._id} 
            onClick={() => setSelectedEntry(entry)}
            className="card p-5 cursor-pointer transition-all duration-300 hover:translate-y-[-4px] flex flex-col h-full border border-white hover:border-[#C1DFF0]"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col">
                <div className="text-sm text-gray-500 font-medium">{formatDate(entry.date)}</div>
                <div className="mt-1 font-bold text-[#3C3C3C] text-lg flex items-center">
                  <span className="text-2xl mr-2">{getMoodEmoji(entry.mood.label)}</span> 
                  <span>{entry.mood.label}</span>
                </div>
              </div>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-md ${
                entry.mood.label === "Very Positive" ? "bg-gradient-to-br from-[#C1DFF0] to-[#C1DFF0]/70" : 
                entry.mood.label === "Positive" ? "bg-gradient-to-br from-[#C1DFF0]/80 to-[#C1DFF0]/50" :
                entry.mood.label === "Neutral" ? "bg-gradient-to-br from-[#CFE3DC] to-[#CFE3DC]/70" :
                entry.mood.label === "Negative" ? "bg-gradient-to-br from-[#FBE4E7]/80 to-[#FBE4E7]/50" : 
                "bg-gradient-to-br from-[#FBE4E7] to-[#FBE4E7]/70"
              }`}>
                <span className="text-2xl">{getMoodEmoji(entry.mood.label)}</span>
              </div>
            </div>
            
            <div className="mt-2 flex-grow bg-[#F2F4F8]/50 p-4 rounded-lg border-l-4 border-[#C1DFF0] relative overflow-hidden">
              <p className="text-[#3C3C3C] leading-relaxed">
                {truncate(entry.content, 120)}
              </p>
              <div className="absolute bottom-0 right-0 left-0 h-8 bg-gradient-to-t from-[#F2F4F8]/90 to-transparent"></div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5 justify-start">
              {entry.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="bg-[#F2F4F8] border border-[#CFE3DC] text-xs px-2.5 py-1 rounded-full font-medium text-[#3C3C3C] transition-colors hover:bg-[#CFE3DC]/30">
                  {tag}
                </span>
              ))}
              {entry.tags.length > 3 && (
                <span className="bg-[#F2F4F8] border border-[#CFE3DC] text-xs px-2.5 py-1 rounded-full font-medium text-[#3C3C3C]">
                  +{entry.tags.length - 3} more
                </span>
              )}
            </div>
            
            {entry.analysis.processed && (
              <div className="mt-4 flex items-center justify-center text-xs bg-[#CFE3DC]/30 text-[#3C3C3C] py-2.5 px-3 rounded-md hover:bg-[#CFE3DC]/50 transition-colors">
                <svg className="w-4 h-4 mr-1.5 text-[#3C3C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-medium">View insights</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}