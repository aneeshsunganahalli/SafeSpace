"use client";

import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

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
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

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
        onSave(response.data);
      }
      
    } catch (err) {
      console.error("Error saving journal entry:", err);
      setError("Failed to save your journal entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {existingEntry ? "Edit Journal Entry" : "Create New Journal Entry"}
      </h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-md">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Mood Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How are you feeling today?
          </label>
          <div className="flex flex-wrap gap-2">
            {moodOptions.map((mood) => (
              <button
                type="button"
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`py-2 px-4 rounded-full text-sm font-medium ${
                  selectedMood === mood.value
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {mood.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Journal Content */}
        <div className="mb-6">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Write your thoughts
          </label>
          <textarea
            id="content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="How was your day? What's on your mind? How are you feeling?"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-sm p-4"
          />
        </div>
        
        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (optional)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add tags (e.g., work, family)"
              className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-sm"
            />
            <button
              type="button"
              onClick={handleTagAdd}
              className="bg-gray-100 text-gray-800 px-4 rounded-r-md border border-l-0 border-gray-300 hover:bg-gray-200"
            >
              Add
            </button>
          </div>
        </div>
        
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : existingEntry
              ? "Update Entry"
              : "Save Entry"}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>
          Your journal entries will be analyzed to provide personalized insights
          and coping strategies. All data is kept private and secure.
        </p>
      </div>
    </div>
  );
}