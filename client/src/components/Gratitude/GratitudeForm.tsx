'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function GratitudeForm() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchTodaysGratitude = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/gratitude/today`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.entries && response.data.entries.length > 0) {
          // Map entries from the API response format to our simple string array
          const gratitudeEntries = response.data.entries.map((entry: { content: string }) => entry.content);
          // Make sure we always have exactly 3 entries (fill with empty strings if needed)
          setEntries([
            ...gratitudeEntries,
            ...Array(3 - gratitudeEntries.length).fill('')
          ].slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching gratitude entry:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTodaysGratitude();
    }
  }, [token, backendUrl]);

  const handleEntryChange = (index: number, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = value;
    setEntries(newEntries);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty entries
    const filledEntries = entries.filter(entry => entry.trim() !== '');
    
    if (filledEntries.length === 0) {
      setError('Please enter at least one thing you\'re grateful for today');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      await axios.post(
        `${backendUrl}/api/gratitude`,
        { entries: filledEntries },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error saving gratitude entries:', err);
      setError('Failed to save your gratitude entries. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-5 bg-gray-200 rounded w-2/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-1/4 mt-4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-md mb-8 border border-[#C1DFF0] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#C1DFF0]/10 blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[#CFE3DC]/15 blur-xl"></div>
      
      {/* Header with icon */}
      <div className="flex items-center mb-6 relative z-10">
        <div className="p-2.5 bg-gradient-to-br from-[#C1DFF0] to-[#CFE3DC] rounded-full shadow-sm mr-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#3C3C3C]">Daily Gratitude</h2>
          <p className="text-sm text-gray-500">What are you thankful for today?</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="space-y-5 mb-6">
          {entries.map((entry, index) => (
            <div 
              key={index} 
              className="flex items-center transition-all duration-300 hover:translate-x-1 group"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm mr-4 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-focus-within:scale-110 ${
                entry ? 'bg-gradient-to-br from-[#C1DFF0] to-[#3C3C3C]/70 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                <span className="font-medium">{index + 1}</span>
              </div>
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={entry}
                  onChange={(e) => handleEntryChange(index, e.target.value)}
                  placeholder={`I'm grateful for...`}
                  className="w-full p-4 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-0 text-[#3C3C3C] shadow-sm transition-all duration-300 hover:bg-gray-50/80 focus:bg-white"
                />
                {entry && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#C1DFF0]"></div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {error && (
          <div className="p-4 mb-5 bg-[#FBE4E7]/20 text-[#3C3C3C] text-sm rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="p-4 mb-5 bg-[#CFE3DC]/20 text-[#3C3C3C] text-sm rounded-lg flex items-center animate-pulse">
            <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Your gratitude entries have been saved successfully!</span>
          </div>
        )}
        
        <div className="text-right">
          <button 
            type="submit"
            disabled={submitting}
            className="py-3 px-6 bg-[#3C3C3C] text-white rounded-lg hover:bg-[#3C3C3C]/90 hover:shadow transition-all duration-300 flex items-center justify-center font-medium ml-auto"
          >
            {submitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                </svg>
                Save Gratitude
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}