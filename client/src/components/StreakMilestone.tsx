"use client";

import { useState, useEffect } from 'react';

interface StreakMilestoneProps {
  streak: number;
  onClose: () => void;
}

export default function StreakMilestone({ streak, onClose }: StreakMilestoneProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animate in
    setIsVisible(true);
    
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleClose = () => {
    setIsVisible(false);
    // Delay actual removal to allow animation to complete
    setTimeout(onClose, 300);
  };
  
  const getMilestoneMessage = () => {
    if (streak >= 30) return "An incredible month of consistent journaling!";
    if (streak >= 14) return "Two weeks of daily journaling is a major achievement!";
    if (streak >= 7) return "A full week of daily reflections!";
    return "You're building a great habit!";
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose}></div>
      <div className={`relative bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full mx-4 transition-all duration-300 ${isVisible ? 'transform scale-100' : 'transform scale-95'}`}>
        <div className="p-1 bg-gradient-to-r from-amber-300 to-yellow-400"></div>
        
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-900">Streak Achievement!</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mt-6 flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11.1c.5 2 .5 3.5-1.185 5.4" />
              </svg>
            </div>
            
            <h4 className="text-2xl font-bold text-amber-800">{streak} Day Streak!</h4>
            <p className="mt-2 text-gray-600">{getMilestoneMessage()}</p>
            
            <div className="mt-6 w-full bg-gray-100 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-amber-300 to-yellow-400 h-2.5 rounded-full"
                style={{ width: `${Math.min(streak/30 * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {streak >= 30 ? "Amazing!" : `${streak}/30 days to your monthly goal`}
            </p>
          </div>
          
          <div className="mt-8">
            <button
              onClick={handleClose}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg shadow-sm"
            >
              Keep Going!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}