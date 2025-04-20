"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StreakMilestoneProps {
  streak: number;
  onClose: () => void;
}

export default function StreakMilestone({ streak, onClose }: StreakMilestoneProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [milestoneTarget, setMilestoneTarget] = useState(7);
  
  useEffect(() => {
    // Determine the appropriate milestone target
    if (streak >= 30) {
      setMilestoneTarget(30);
    } else if (streak >= 14) {
      setMilestoneTarget(14);
    } else {
      setMilestoneTarget(7);
    }
    
    // Animate in
    setIsVisible(true);
    
    // Auto-dismiss after 7 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 7000);
    
    return () => clearTimeout(timer);
  }, [streak]);
  
  const handleClose = () => {
    setIsVisible(false);
    // Delay actual removal to allow animation to complete
    setTimeout(onClose, 300);
  };
  
  const getMilestoneMessage = () => {
    if (streak >= 30) return "An incredible month of consistent journaling!";
    if (streak >= 14) return "Two weeks of daily journaling. Great achievement!";
    if (streak >= 7) return "A full week of daily reflections!";
    return "You're building a great habit!";
  };

  // Calculate progress percentage toward the current milestone target
  const calculateProgress = () => {
    let progress = 0;
    
    if (milestoneTarget === 7) {
      progress = Math.min(100, Math.round((streak / 7) * 100));
    } else if (milestoneTarget === 14) {
      progress = Math.min(100, Math.round((streak / 14) * 100));
    } else if (milestoneTarget === 30) {
      progress = Math.min(100, Math.round((streak / 30) * 100));
    }
    
    return progress;
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="fixed inset-0 bg-white" onClick={handleClose}></div>
      <div 
        className={`relative bg-white rounded-2xl shadow-xl overflow-hidden max-w-sm w-full mx-4 transition-all duration-300 ${
          isVisible ? 'transform scale-100' : 'transform scale-95'
        }`}
      >
        {/* Top accent line */}
        <div className="h-1 bg-orange-500"></div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Streak Achievement
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mt-2 flex flex-col items-center text-center">
            {/* Badge circle */}
            <div className="relative mb-4">
              <div className="h-24 w-24 rounded-full bg-yellow-50 border-4 border-orange-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11.1c.5 2 .5 3.5-1.185 5.4" />
                </svg>
              </div>
            </div>
            
            {/* Streak count display */}
            <div className="bg-orange-500 rounded-full px-4 py-1.5 inline-flex items-center mb-3">
              <span className="text-lg font-bold text-white mr-1">{streak}</span>
              <span className="text-white/90 text-md">day streak</span>
            </div>
            
            {/* Achievement message */}
            <p className="text-gray-700 font-medium mb-6">
              {getMilestoneMessage()}
            </p>
            
            {/* Progress bar */}
            <div className="w-full mb-6">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-gray-500">Progress toward {milestoneTarget}-day milestone</span>
                <span className="text-xs font-bold text-orange-600">{calculateProgress()}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full">
                <div 
                  className="h-2.5 bg-orange-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleClose}
              className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
            >
              Keep Going!
            </button>
            
            <Link
              href="/progress"
              className="w-full py-2 text-center text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
              onClick={handleClose}
            >
              View Progress Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}