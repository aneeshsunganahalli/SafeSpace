"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import StreakMilestone from '@/components/StreakMilestone';

export default function ProgressPage() {
  const { user } = useAuth();
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneTarget, setMilestoneTarget] = useState(7);
  const currentStreak = user?.currentStreak || 0;
  const longestStreak = user?.longestStreak || 0;

  // Determine which milestone target to display based on current streak
  useEffect(() => {
    if (currentStreak >= 30) {
      setMilestoneTarget(30);
    } else if (currentStreak >= 14) {
      setMilestoneTarget(14);
    } else {
      setMilestoneTarget(7);
    }
  }, [currentStreak]);

  const handleStreakClick = () => {
    setShowMilestone(true);
  };

  const calculateProgressPercentage = () => {
    // Calculate progress toward the current milestone
    let progress = 0;
    if (milestoneTarget === 7) {
      progress = (currentStreak / 7) * 100;
    } else if (milestoneTarget === 14) {
      progress = (currentStreak / 14) * 100;
    } else if (milestoneTarget === 30) {
      progress = (currentStreak / 30) * 100;
    }
    
    // Ensure progress doesn't exceed 100%
    return Math.min(progress, 100);
  };

  return (
    <main className="container mx-auto px-4 max-w-5xl py-2">
      <h1 className="text-3xl text-black font-bold mb-8">Your Progress</h1>

      {/* Streak Card */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Journaling Streak</h2>
        
        {/* Streak Display */}
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Current Streak */}
          <div 
            className="flex-1 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={handleStreakClick}
          >
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11.1c.5 2 .5 3.5-1.185 5.4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Streak</p>
                <p className="text-3xl font-bold">{currentStreak} day{currentStreak !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Progress Bar towards milestone */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-gray-500">Progress toward {milestoneTarget}-day milestone</span>
                <span className="text-xs font-bold text-orange-600">{Math.round(calculateProgressPercentage())}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-yellow-400 h-2.5 rounded-full shadow-sm transition-all duration-1000 ease-out"
                  style={{ width: `${calculateProgressPercentage()}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">Click to view details</p>
            </div>
          </div>

          {/* Longest Streak */}
          <div className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Longest Streak</p>
                <p className="text-3xl font-bold">{longestStreak} day{longestStreak !== 1 ? 's' : ''}</p>
              </div>
            </div>
            
            {/* Best Milestone Achieved */}
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                {longestStreak >= 30 ? (
                  <p>You've achieved the monthly milestone! 🏆</p>
                ) : longestStreak >= 14 ? (
                  <p>You've achieved the 2-week milestone! 🏅</p>
                ) : longestStreak >= 7 ? (
                  <p>You've achieved the weekly milestone! 🥇</p>
                ) : (
                  <p>Keep going to reach your first milestone!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Milestone explanation */}
        <div className="mt-6 border-t pt-4 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">Milestones:</h3>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li className={currentStreak >= 7 ? "text-green-600 font-medium" : ""}>7 days - Weekly milestone</li>
            <li className={currentStreak >= 14 ? "text-green-600 font-medium" : ""}>14 days - Bi-weekly milestone</li>
            <li className={currentStreak >= 30 ? "text-green-600 font-medium" : ""}>30 days - Monthly milestone</li>
          </ul>
        </div>
      </div>

      {/* Journal Statistics Section - Can be expanded in the future */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Journal Statistics</h2>
        <p className="text-gray-600">More statistics will be available as you continue your journaling journey.</p>
      </div>

      {/* Milestone modal */}
      {showMilestone && (
        <StreakMilestone 
          streak={currentStreak} 
          onClose={() => setShowMilestone(false)} 
        />
      )}
    </main>
  );
}