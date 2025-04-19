"use client";

import { useState, useMemo } from "react";
import JournalEntryForm from "./JournalEntryForm";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";

interface JournalEntryProps {
  entry: {
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
  };
  onBack: () => void;
  onDelete: (id: string) => void;  // Updated to accept an ID parameter
  onRefresh: () => void;
}

export default function JournalEntryDetail({
  entry,
  onBack,
  onDelete,
  onRefresh,
}: JournalEntryProps) {
  const { token } = useAuth();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState("");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('reflection'); // Added state for tab navigation

  // Format date for display
  const formattedDate = useMemo(() => {
    return new Date(entry.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [entry.date]);

  // Extract tags from entry
  const tags = useMemo(() => entry.tags || [], [entry.tags]);

  const handleEdit = () => {
    // Navigate to edit page with entry data
    router.push(`/journal/edit/${entry._id}`);
  };

  const handleReprocessAnalysis = async () => {
    try {
      setIsProcessing(true);
      setProcessingError("");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      await axios.post(`${backendUrl}/api/journal/${entry._id}/reprocess`, {}, config);

      // Refresh the entry data
      if (onRefresh) {
        onRefresh();
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('Error reprocessing entry:', error);
      setProcessingError("Failed to analyze entry. Please try again later.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#C1DFF0] fade-in">
      {/* Header with navigation and actions */}
      <div className="gradient-bg p-5 flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-[#3C3C3C] hover:text-black flex items-center font-medium bg-white/80 py-2 px-4 rounded-full transition-colors hover:bg-white"
        >
          <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="py-2 px-4 text-sm bg-white/80 text-[#3C3C3C] rounded-md hover:bg-white transition-colors flex items-center font-medium"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(entry._id)}
            className="py-2 px-4 text-sm bg-white/80 text-[#3C3C3C] rounded-md hover:bg-white transition-colors flex items-center font-medium"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Delete
          </button>
        </div>
      </div>

      <div className="bg-[#F2F4F8]">
        {/* Entry Information */}
        <div className="p-6 md:p-8 border-b border-[#C1DFF0]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-[#3C3C3C] flex items-center">
              <svg className="w-6 h-6 mr-2 text-[#C1DFF0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Journal Entry
            </h2>
            <span className="text-sm font-medium bg-[#3C3C3C] text-white px-4 py-1.5 rounded-full shadow-md">{formattedDate}</span>
          </div>

          {/* Mood Card */}
          {entry.mood && entry.mood.label && (
            <div className="card mb-6 overflow-hidden">
              <div className={`py-2 px-4 font-medium text-center flex items-center justify-center ${
                entry.mood.label === "Very Positive"
                  ? "bg-gradient-to-r from-[#C1DFF0] to-[#C1DFF0]/80"
                  : entry.mood.label === "Positive"
                  ? "bg-gradient-to-r from-[#C1DFF0]/80 to-[#C1DFF0]/60"
                  : entry.mood.label === "Neutral"
                  ? "bg-gradient-to-r from-[#CFE3DC] to-[#CFE3DC]/80"
                  : entry.mood.label === "Negative"
                  ? "bg-gradient-to-r from-[#FBE4E7]/80 to-[#FBE4E7]/60"
                  : "bg-gradient-to-r from-[#FBE4E7] to-[#FBE4E7]/80"
              }`}>
                <svg className="w-5 h-5 mr-1.5 text-[#3C3C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-[#3C3C3C] font-medium">Your Mood</span>
              </div>
              <div className="p-5 bg-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-md ${
                      entry.mood.label === "Very Positive" ? "bg-gradient-to-br from-[#C1DFF0] to-[#C1DFF0]/70" : 
                      entry.mood.label === "Positive" ? "bg-gradient-to-br from-[#C1DFF0]/80 to-[#C1DFF0]/50" :
                      entry.mood.label === "Neutral" ? "bg-gradient-to-br from-[#CFE3DC] to-[#CFE3DC]/70" :
                      entry.mood.label === "Negative" ? "bg-gradient-to-br from-[#FBE4E7]/80 to-[#FBE4E7]/50" : 
                      "bg-gradient-to-br from-[#FBE4E7] to-[#FBE4E7]/70"
                    }`}>
                      <span className="text-3xl">
                        {entry.mood.label === "Very Positive" 
                          ? "😄" 
                          : entry.mood.label === "Positive" 
                          ? "🙂" 
                          : entry.mood.label === "Neutral" 
                          ? "😐" 
                          : entry.mood.label === "Negative" 
                          ? "🙁" 
                          : "😞"}
                      </span>
                    </div>
                    <span className="text-2xl font-medium text-[#3C3C3C]">
                      {entry.mood.label}
                    </span>
                  </div>
                  {entry.mood.score && (
                    <div className="text-sm text-white font-medium bg-[#3C3C3C] px-3 py-1.5 rounded-full shadow">
                      Score: {entry.mood.score}/10
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tags Card */}
          {tags.length > 0 && (
            <div className="card mb-6 overflow-hidden">
              <div className="py-2 px-4 bg-[#3C3C3C] text-white font-medium flex items-center justify-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                Tags
              </div>
              <div className="p-5 bg-white">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-[#F2F4F8] border border-[#CFE3DC] rounded-full px-3 py-1.5 text-sm font-medium text-[#3C3C3C] hover:bg-[#CFE3DC]/40 transition-colors cursor-default"
                    >
                      <svg className="w-3.5 h-3.5 mr-1.5 text-[#3C3C3C]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                      </svg>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Journal Content Card */}
          <div className="card overflow-hidden mb-6">
            <div className="py-2 px-4 bg-[#3C3C3C] text-white font-medium flex items-center justify-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Journal Content
            </div>
            <div className="p-5 bg-white">
              <p className="text-[#3C3C3C] whitespace-pre-wrap leading-relaxed">{entry.content}</p>
            </div>
          </div>
        </div>

        {/* AI Analysis Section */}
        {entry.analysis && (
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-[#3C3C3C] flex items-center">
                <svg className="w-6 h-6 mr-2 text-[#C1DFF0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                AI Insights
              </h3>

              {/* Reprocess button */}
              {!entry.analysis.processed || processingError ? (
                <button
                  onClick={handleReprocessAnalysis}
                  disabled={isProcessing}
                  className="flex items-center py-2 px-4 text-sm bg-[#3C3C3C] text-white rounded-md hover:bg-[#3C3C3C]/80 disabled:opacity-50 shadow"
                >
                  {isProcessing ? (
                    <>
                      <span className="mr-2 inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      Analyze Entry
                    </>
                  )}
                </button>
              ) : null}
            </div>

            {/* Processing error message */}
            {processingError && (
              <div className="card mb-6 overflow-hidden">
                <div className="py-2 px-4 bg-[#FBE4E7] text-[#3C3C3C] font-medium flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Error
                </div>
                <div className="p-5 bg-white">
                  <div className="flex items-center mb-1">
                    <svg className="w-5 h-5 mr-2 text-[#FBE4E7]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="font-medium text-[#3C3C3C]">Processing Error</p>
                  </div>
                  <p className="text-sm text-[#3C3C3C] ml-7">{processingError}</p>
                </div>
              </div>
            )}

            {/* Show "processing" message if entry hasn't been processed */}
            {!entry.analysis.processed && !isProcessing && !processingError && (
              <div className="card mb-6 overflow-hidden">
                <div className="py-2 px-4 bg-[#CFE3DC] text-[#3C3C3C] font-medium flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Notice
                </div>
                <div className="p-5 bg-white">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#3C3C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-sm text-[#3C3C3C]">
                      This entry hasn't been fully analyzed yet. Click "Analyze Entry" to process it.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Show all insights together when processed */}
            {entry.analysis.processed && (
              <div className="space-y-6">
                {/* Reflection */}
                {entry.analysis.supportiveResponse && (
                  <div className="card overflow-hidden">
                    <div className="py-2 px-4 bg-gradient-to-r from-[#3C3C3C] to-[#3C3C3C]/90 text-white font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                      </svg>
                      AI Reflection
                    </div>
                    <div className="p-6 bg-white">
                      <div className="flex items-start">
                        <div className="bg-[#3C3C3C] rounded-full p-2.5 mr-4 mt-1 shadow-md">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                          </svg>
                        </div>
                        <blockquote className="italic text-[#3C3C3C] border-l-4 border-[#CFE3DC] pl-4 leading-relaxed">
                          {entry.analysis.supportiveResponse}
                        </blockquote>
                      </div>
                    </div>
                  </div>
                )}

                {/* Identified Patterns */}
                {entry.analysis.identifiedPatterns && entry.analysis.identifiedPatterns.length > 0 && (
                  <div className="card overflow-hidden">
                    <div className="py-2 px-4 bg-gradient-to-r from-[#C1DFF0] to-[#C1DFF0]/90 text-[#3C3C3C] font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      Identified Patterns
                    </div>
                    <div className="p-6 bg-white">
                      <ul className="space-y-3">
                        {entry.analysis.identifiedPatterns.map((pattern, idx) => (
                          <li key={idx} className="bg-[#F2F4F8] p-4 rounded-lg border-l-4 border-[#C1DFF0] flex items-start shadow-sm transition-all hover:shadow">
                            <div className="bg-[#C1DFF0] rounded-full p-1.5 mr-3 shrink-0 mt-0.5 shadow-sm">
                              <svg className="w-4 h-4 text-[#3C3C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            </div>
                            <span className="text-[#3C3C3C] leading-relaxed">{pattern}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Suggested Strategies */}
                {entry.analysis.suggestedStrategies && entry.analysis.suggestedStrategies.length > 0 && (
                  <div className="card overflow-hidden">
                    <div className="py-2 px-4 bg-gradient-to-r from-[#CFE3DC] to-[#CFE3DC]/90 text-[#3C3C3C] font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                      Suggested Strategies
                    </div>
                    <div className="p-6 bg-white">
                      <ul className="space-y-3">
                        {entry.analysis.suggestedStrategies.map((strategy, idx) => (
                          <li key={idx} className="bg-[#F2F4F8] p-4 rounded-lg border-l-4 border-[#CFE3DC] flex items-start shadow-sm transition-all hover:shadow">
                            <div className="bg-[#CFE3DC] rounded-full p-1.5 mr-3 shrink-0 mt-0.5 shadow-sm">
                              <svg className="w-4 h-4 text-[#3C3C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <span className="text-[#3C3C3C] leading-relaxed">{strategy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 text-xs text-[#3C3C3C] bg-[#F2F4F8] p-4 rounded-lg border border-[#C1DFF0] shadow-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#3C3C3C]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p>
                  These insights are generated by AI to help with reflection. They
                  are not professional mental health advice.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}