"use client";

import { useState } from "react";
import JournalEntryForm from "./JournalEntryForm";

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
  onDelete: () => void;
  onRefresh: () => void;
}

export default function JournalEntryDetail({
  entry,
  onBack,
  onDelete,
  onRefresh,
}: JournalEntryProps) {
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMoodEmoji = (label: string) => {
    switch (label) {
      case "Very Negative":
        return "😢";
      case "Negative":
        return "😕";
      case "Neutral":
        return "😐";
      case "Positive":
        return "🙂";
      case "Very Positive":
        return "😄";
      default:
        return "😐";
    }
  };

  const getMoodColor = (label: string) => {
    switch (label) {
      case "Very Negative":
        return "bg-red-100 text-red-800";
      case "Negative":
        return "bg-orange-100 text-orange-800";
      case "Neutral":
        return "bg-gray-100 text-gray-800";
      case "Positive":
        return "bg-green-100 text-green-800";
      case "Very Positive":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle edit completion
  const handleEditComplete = () => {
    setIsEditing(false);
    onRefresh();
  };

  if (isEditing) {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center text-gray-600 hover:text-black"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Cancel Editing
          </button>
        </div>

        <JournalEntryForm
          existingEntry={entry}
          onSave={handleEditComplete}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-black"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Entries
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Journal Entry
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(entry.date)}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Edit entry"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-gray-500 hover:text-red-600"
                aria-label="Delete entry"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mood and Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMoodColor(
                entry.mood.label
              )}`}
            >
              {entry.mood.label} {getMoodEmoji(entry.mood.label)}
            </span>
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 bg-white">
          <div className="prose max-w-none">
            {entry.content.split("\n").map((paragraph, idx) => (
              <p key={idx} className="mb-4 text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        {entry.analysis.processed && (
          <div className="p-5 bg-gray-50 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              AI Insights
            </h3>

            {/* Supportive Response */}
            {entry.analysis.supportiveResponse && (
              <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
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
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Thought Patterns
                    </h4>
                    <ul className="list-disc list-inside text-gray-700">
                      {entry.analysis.identifiedPatterns.map((pattern, idx) => (
                        <li key={idx} className="mb-1">
                          {pattern}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Suggested Strategies */}
              {entry.analysis.suggestedStrategies &&
                entry.analysis.suggestedStrategies.length > 0 && (
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Suggested Strategies
                    </h4>
                    <ul className="list-disc list-inside text-gray-700">
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