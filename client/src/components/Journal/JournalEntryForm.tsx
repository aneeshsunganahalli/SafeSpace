"use client";

import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import StreakMilestone from "../StreakMilestone";

const moodOptions = [
  { value: "Very Negative", score: 1, label: "Very Negative 😢" },
  { value: "Negative", score: 3, label: "Negative 😕" },
  { value: "Neutral", score: 5, label: "Neutral 😐" },
  { value: "Positive", score: 7, label: "Positive 🙂" },
  { value: "Very Positive", score: 10, label: "Very Positive 😄" },
];

export default function JournalEntryForm({ 
  existingEntry = null, 
  onSave 
}: { 
  existingEntry?: any, 
  onSave?: (entry: any) => void 
}) {
  const { token, updateUserStreak } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  
  // Milestone streak celebration
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneStreak, setMilestoneStreak] = useState(0);

  // Form state
  const [content, setContent] = useState(existingEntry?.content || "");
  const [selectedMood, setSelectedMood] = useState(existingEntry?.mood?.label || "Neutral");
  const [tags, setTags] = useState<string[]>(existingEntry?.tags || []);
  const [tagInput, setTagInput] = useState("");
  
  const handleTagAdd = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput) {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!content.trim()) {
      setError("Journal entry cannot be empty");
      return;
    }
    
    // Get mood score based on selected mood
    const moodOption = moodOptions.find(option => option.value === selectedMood);
    const moodData = {
      label: selectedMood,
      score: moodOption ? moodOption.score : 5
    };
    
    setIsSubmitting(true);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      let response;
      
      if (existingEntry) {
        // Update existing entry
        response = await axios.put(
          `${backendUrl}/api/journal/${existingEntry._id}`,
          { content, mood: moodData, tags },
          config
        );
      } else {
        // Create new entry
        response = await axios.post(
          `${backendUrl}/api/journal`,
          { content, mood: moodData, tags },
          config
        );
        
        // Update streak information from response
        if (response.data && response.data.streak) {
          updateUserStreak({
            current: response.data.streak.current,
            longest: response.data.streak.longest
          });

          // Check for milestone streak
          const milestoneStreaks = [3, 7, 14, 21, 30, 60, 90, 100];
          if (milestoneStreaks.includes(response.data.streak.current)) {
            setMilestoneStreak(response.data.streak.current);
            setShowMilestone(true);
          }
        }
      }
      
      setSuccess("Journal entry saved successfully!");
      
      // Clear form if it's a new entry
      if (!existingEntry) {
        setContent("");
        setSelectedMood("Neutral");
        setTags([]);
      }
      
      // Call onSave callback if provided
      if (onSave && response.data) {
        onSave(response.data.entry || response.data);
      }
      
    } catch (err) {
      console.error("Error saving journal entry:", err);
      setError("Failed to save your journal entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-4">
      {/* Journal Guidelines */}
      <div className="mb-6 bg-white p-5 rounded-lg border border-[#CFE3DC] text-[#3C3C3C]">
        <h3 className="text-lg font-medium mb-2">Journaling Tips</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>Be honest with yourself - this is your safe space.</li>
          <li>Try to write regularly, even if it's just a few sentences.</li>
          <li>Focus on both challenges and positive moments in your day.</li>
          <li>Include any coping strategies that helped you today.</li>
          <li>Your entries will be analyzed to provide personalized insights.</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-[#C1DFF0]">
        <h2 className="text-xl font-semibold mb-4 text-[#3C3C3C]">{existingEntry ? "Edit Journal Entry" : "New Journal Entry"}</h2>

        <form onSubmit={handleSubmit}>
          {/* Mood Selection */}
          <div className="mb-5">
            <label className="block text-[#3C3C3C] text-sm font-medium mb-2">How are you feeling today?</label>
            <div className="flex flex-wrap gap-2">
              {moodOptions.map((mood) => (
                <button
                  type="button"
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`py-2 px-4 rounded-full text-xs font-medium 
                    ${selectedMood === mood.value 
                      ? "bg-[#3C3C3C] text-white" 
                      : "bg-white text-[#3C3C3C] border border-[#C1DFF0]"
                    }`}
                >
                  {mood.label}
                </button>
              ))}
            </div>
          </div>

          {/* Journal Content */}
          <div className="mb-5">
            <label htmlFor="content" className="block text-[#3C3C3C] text-sm font-medium mb-2">
              Journal Entry
            </label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full p-2.5 text-sm bg-[#F2F4F8] border border-[#CFE3DC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C1DFF0] focus:border-transparent text-[#3C3C3C]"
              placeholder="Share your thoughts and feelings..."
            ></textarea>
          </div>

          {/* Tags Input */}
          <div className="mb-5">
            <label htmlFor="tags" className="block text-[#3C3C3C] text-sm font-medium mb-2">
              Tags <span className="text-xs text-gray-500">(optional)</span>
            </label>
            
            {/* Display selected tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <div key={index} className="bg-[#F2F4F8] border border-[#CFE3DC] text-xs px-2.5 py-1 rounded-full flex items-center">
                  <span className="text-[#3C3C3C]">{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-1.5 text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="flex">
              <input
                id="tagInput"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow p-2 text-sm bg-[#F2F4F8] border border-[#CFE3DC] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#C1DFF0] focus:border-transparent text-[#3C3C3C]"
                placeholder="Add a tag and press Enter (e.g., work, anxiety, gratitude)"
              />
              <button
                type="button"
                onClick={handleTagAdd}
                className="p-2 bg-[#3C3C3C] text-white rounded-r-md"
              >
                Add
              </button>
            </div>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 flex-1 bg-[#3C3C3C] text-white rounded-md hover:bg-[#3C3C3C]/90 transition-colors shadow-sm"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                existingEntry ? "Update Entry" : "Save Entry"
              )}
            </button>
            <button
              type="button"
              className="py-2 px-4 border border-[#3C3C3C] text-[#3C3C3C] rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-[#FBE4E7]/30 text-[#3C3C3C] rounded-md">
              {error}
            </div>
          )}
        </form>
      </div>

      {/* Streak Milestone Celebration */}
      {showMilestone && (
        <StreakMilestone 
          streak={milestoneStreak} 
          onClose={() => setShowMilestone(false)} 
        />
      )}
    </div>
  );
}