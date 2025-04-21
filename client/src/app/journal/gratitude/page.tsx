"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import GratitudeForm from "../../../components/Gratitude/GratitudeForm";
import GratitudeHistory from "../../../components/Gratitude/GratitudeHistory";

export default function GratitudePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

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
          <h1 className="text-3xl font-bold text-black">Gratitude Practice</h1>
          <p className="text-gray-600 mt-2">
            Cultivate a positive mindset by acknowledging what you're grateful for
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Gratitude form */}
          <div className="lg:col-span-2">
            <GratitudeForm />
            
            {/* Info card about gratitude benefits */}
            <div className="bg-[#F2F4F8] p-6 rounded-lg border border-[#C1DFF0] mb-6">
              <h2 className="text-lg font-semibold mb-3 text-[#3C3C3C]">Benefits of Gratitude</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-[#C1DFF0] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Improves mental health and reduces stress</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-[#C1DFF0] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Enhances empathy and reduces aggression</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-[#C1DFF0] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Improves sleep quality and overall well-being</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-[#C1DFF0] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Increases resilience and reduces symptoms of depression</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Right column: Gratitude history */}
          <div className="lg:col-span-1">
            <GratitudeHistory />
            
            {/* Gratitude quote */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#CFE3DC]">
              <blockquote className="italic text-gray-600">
                "Gratitude turns what we have into enough, and more. It turns denial into acceptance, chaos into order, confusion into clarity."
              </blockquote>
              <p className="text-right text-sm font-medium text-gray-500 mt-2">— Melody Beattie</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}