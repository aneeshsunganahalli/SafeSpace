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
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      <div className="flex justify-between items-center p-5 bg-white border-b border-gray-100">
        <button
          onClick={onBack}
          className="text-black hover:text-gray-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="py-1 px-3 text-sm bg-white text-black border border-gray-200 rounded hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(entry._id)}
            className="py-1 px-3 text-sm bg-white text-black border border-gray-200 rounded hover:bg-gray-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-black">
              Journal Entry
            </h2>
            <span className="text-sm text-gray-500">{formattedDate}</span>
          </div>

          {/* Mood indicator */}
          {entry.mood && entry.mood.label && (
            <div className="mb-4 flex items-center">
              <span
                className={`inline-block rounded-full w-3 h-3 mr-2 ${
                  entry.mood.label === "Very Positive"
                    ? "bg-black"
                    : entry.mood.label === "Positive"
                    ? "bg-gray-700"
                    : entry.mood.label === "Neutral"
                    ? "bg-gray-400"
                    : entry.mood.label === "Negative"
                    ? "bg-gray-600"
                    : "bg-black"
                }`}
              ></span>
              <span className="text-black">
                {entry.mood.label === "Very Positive" 
                  ? "😄 Very Positive" 
                  : entry.mood.label === "Positive" 
                  ? "🙂 Positive" 
                  : entry.mood.label === "Neutral" 
                  ? "😐 Neutral" 
                  : entry.mood.label === "Negative" 
                  ? "🙁 Negative" 
                  : "😞 Very Negative"}
              </span>
              {entry.mood.score && (
                <span className="text-gray-400 text-sm ml-2">
                  ({entry.mood.score}/10)
                </span>
              )}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-white border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Journal content */}
          <div className="border border-gray-100 rounded-md p-4 bg-white">
            <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
          </div>
        </div>

        {/* AI Analysis */}
        {entry.analysis && (
          <div className="p-5 bg-white border-t border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-black">
                AI Insights
              </h3>

              {/* Reprocess button */}
              {!entry.analysis.processed || processingError ? (
                <button
                  onClick={handleReprocessAnalysis}
                  disabled={isProcessing}
                  className="flex items-center py-1 px-3 text-sm bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <span className="mr-2 inline-block w-3 h-3 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
              <div className="mb-4 p-3 bg-white border border-gray-200 rounded-md">
                <p className="text-sm text-gray-700">{processingError}</p>
              </div>
            )}

            {/* Show "processing" message if entry hasn't been processed */}
            {!entry.analysis.processed && !isProcessing && !processingError && (
              <div className="mb-4 p-4 bg-white border border-gray-200 rounded-md">
                <p className="text-sm text-gray-700">
                  This entry hasn't been fully analyzed yet. Click "Analyze Entry" to process it.
                </p>
              </div>
            )}

            {/* Supportive Response */}
            {entry.analysis.supportiveResponse && (
              <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-black mb-2">
                  Reflection
                </h4>
                <p className="text-gray-700">
                  {entry.analysis.supportiveResponse}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Identified Patterns */}
              {entry.analysis.identifiedPatterns &&
                entry.analysis.identifiedPatterns.length > 0 && (
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <h4 className="text-sm font-medium text-black mb-2">
                      Identified Patterns
                    </h4>
                    <ul className="list-disc pl-5 text-gray-700 text-sm">
                      {entry.analysis.identifiedPatterns.map(
                        (pattern, idx) => (
                          <li key={idx} className="mb-1">
                            {pattern}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {/* Suggested Strategies */}
              {entry.analysis.suggestedStrategies &&
                entry.analysis.suggestedStrategies.length > 0 && (
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <h4 className="text-sm font-medium text-black mb-2">
                      Suggested Strategies
                    </h4>
                    <ul className="list-disc pl-5 text-gray-700 text-sm">
                      {entry.analysis.suggestedStrategies.map(
                        (strategy, idx) => (
                          <li key={idx} className="mb-1">
                            {strategy}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p>
                These insights are generated by AI to help with reflection. They
                are not professional mental health advice.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}