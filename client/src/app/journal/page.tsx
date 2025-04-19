"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import JournalEntryForm from "../../components/JournalEntryForm";
import JournalEntryList from "../../components/JournalEntryList";
import JournalInsights from "../../components/JournalInsights";

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

export default function JournalPage() {
  const [activeTab, setActiveTab] = useState("entries");
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  // Reference to store and control the JournalEntryList component
  const [shouldRefreshList, setShouldRefreshList] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Handler for when a new entry is saved
  const handleEntrySaved = (entry: JournalEntry) => {
    // Show success message or perform other actions with the new entry data
    console.log("New entry saved:", entry);

    // Set flag to refresh the entries list
    setShouldRefreshList(true);

    // Switch to the entries tab to show the updated list
    setActiveTab("entries");
  };

  // Reset the refresh flag after it's consumed
  useEffect(() => {
    if (shouldRefreshList) {
      setShouldRefreshList(false);
    }
  }, [shouldRefreshList]);

  // If loading auth state, show loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  // If not authenticated (and still on this page), don't render content
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full bg-white min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">My Journal</h1>
          <p className="text-gray-600 mt-2">
            Express yourself freely and track your mental wellbeing
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("entries")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "entries"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
              }`}
            >
              Journal Entries
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "new"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
              }`}
            >
              New Entry
            </button>
            <button
              onClick={() => setActiveTab("insights")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "insights"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
              }`}
            >
              Insights
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "entries" && (
            <JournalEntryList shouldRefresh={shouldRefreshList} />
          )}
          {activeTab === "new" && (
            <JournalEntryForm onSave={handleEntrySaved} />
          )}
          {activeTab === "insights" && <JournalInsights />}
        </div>
      </div>
    </div>
  );
}