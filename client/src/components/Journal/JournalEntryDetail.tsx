"use client";

import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

// Import extracted components
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import JournalMoodCard from "./JournalMoodCard";
import JournalTagsCard from "./JournalTagsCard";
import JournalContentCard from "./JournalContentCard";
import JournalAnalysisSection from "./JournalAnalysisSection";

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
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export default function JournalEntryDetail({
  entry,
  onBack,
  onDelete,
  onRefresh,
}: JournalEntryProps) {
  const { token } = useAuth();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(entry._id);
    setShowDeleteModal(false);
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
            onClick={handleDeleteClick}
            className="py-2 px-4 text-sm bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors flex items-center font-medium"
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

          {/* Components for entry details */}
          <JournalMoodCard mood={entry.mood} />
          <JournalTagsCard tags={tags} />
          <JournalContentCard content={entry.content} />
        </div>

        {/* AI Analysis Section */}
        {entry.analysis && (
          <JournalAnalysisSection 
            entryId={entry._id} 
            analysis={entry.analysis} 
            token={token} 
            onRefresh={onRefresh} 
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}