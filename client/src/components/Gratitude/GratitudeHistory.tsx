'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface GratitudeEntry {
  _id: string;
  date: string;
  entries: { content: string }[];
}

export default function GratitudeHistory() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchRecentGratitude = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/gratitude/recent`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && Array.isArray(response.data)) {
          setEntries(response.data);
        }
      } catch (err) {
        console.error('Error fetching gratitude history:', err);
        setError('Failed to load your gratitude history');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRecentGratitude();
    }
  }, [token, backendUrl]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex">
              <div className="h-16 w-16 bg-gray-200 rounded mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-gradient-to-r from-white to-[#F2F4F8] p-6 rounded-lg shadow-md mb-6 border border-[#CFE3DC]">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 mr-2 text-[#C1DFF0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <h2 className="text-xl font-semibold text-[#3C3C3C]">Gratitude History</h2>
        </div>
        <div className="bg-white p-6 rounded-lg border border-dashed border-[#CFE3DC] text-center">
          <svg className="w-16 h-16 mx-auto text-[#CFE3DC] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <p className="text-gray-500 mb-1">No gratitude entries yet</p>
          <p className="text-sm text-gray-400">Your recent gratitude entries will appear here once you start recording them.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-[#CFE3DC]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2 text-[#C1DFF0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <h2 className="text-xl font-semibold text-[#3C3C3C]">Gratitude History</h2>
        </div>
        <div className="text-xs font-medium text-[#3C3C3C] bg-white py-1.5 px-3 rounded-lg shadow-sm border border-[#CFE3DC]">
          Last 7 Days
        </div>
      </div>
      
      {error && (
        <div className="p-4 mb-4 bg-[#FBE4E7]/30 text-[#3C3C3C] text-sm rounded-lg border-l-4 border-[#FBE4E7] flex items-center">
          <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {error}
        </div>
      )}
      
      <div className="space-y-4 ml-8">
        {entries.map((entry, entryIndex) => {
          const entryDate = new Date(entry.date);
          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          let dateLabel = formatDate(entry.date);
          if (entryDate.toDateString() === today.toDateString()) {
            dateLabel = "Today";
          } else if (entryDate.toDateString() === yesterday.toDateString()) {
            dateLabel = "Yesterday";
          }
          
          return (
            <div key={entry._id} className="relative">
              {/* Timeline connector */}
              {entryIndex < entries.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-[#CFE3DC]"></div>
              )}
              
              <div className="flex items-start group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C1DFF0] to-[#CFE3DC] flex items-center justify-center shadow-md flex-shrink-0 z-10">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-sm font-bold text-[#3C3C3C]">{dateLabel}</h3>
                    <span className="text-xs text-gray-400 ml-2">
                      {dateLabel === "Today" || dateLabel === "Yesterday" ? formatDate(entry.date) : ""}
                    </span>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border border-[#CFE3DC]/60 shadow-sm hover:shadow transition-all">
                    <ul className="list-none space-y-2">
                      {entry.entries.map((item, idx) => (
                        <li key={idx} className="flex items-start text-gray-600 group">
                          <div className="p-1 rounded-full bg-[#CFE3DC]/20 group-hover:bg-[#CFE3DC]/40 transition-colors mt-0.5 mr-2">
                            <svg className="w-3 h-3 text-[#3C3C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <span className="text-sm">{item.content}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}