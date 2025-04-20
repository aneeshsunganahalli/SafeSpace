import { useState } from 'react';
import axios from 'axios';

interface AnalysisProps {
  entryId: string;
  analysis: {
    supportiveResponse?: string;
    identifiedPatterns?: string[];
    suggestedStrategies?: string[];
    processed: boolean;
  };
  token: string | null;
  onRefresh: () => void;
}

export default function JournalAnalysisSection({ entryId, analysis, token, onRefresh }: AnalysisProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState("");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const handleReprocessAnalysis = async () => {
    try {
      setIsProcessing(true);
      setProcessingError("");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      await axios.post(`${backendUrl}/api/journal/${entryId}/reprocess`, {}, config);

      // Refresh the entry data
      if (onRefresh) {
        onRefresh();
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('Error reprocessing entry:', error);
      setProcessingError("Failed to analyze entry. Please try again later.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-[#3C3C3C] flex items-center">
          <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
          AI Insights
        </h3>

        {/* Reprocess button */}
        {!analysis.processed || processingError ? (
          <button
            onClick={handleReprocessAnalysis}
            disabled={isProcessing}
            className="flex items-center py-2 px-4 text-sm bg-[#3C3C3C] text-white rounded-md hover:bg-[#3C3C3C]/80 disabled:opacity-50 shadow"
          >
            {isProcessing ? (
              <>
                <span className="mr-2 inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Analyze Entry
              </>
            )}
          </button>
        ) : null}
      </div>

      {/* Processing error message */}
      {processingError && (
        <div className="card mb-6 overflow-hidden">
          <div className="py-2 px-4 bg-[#FBE4E7] text-[#3C3C3C] font-medium flex items-center justify-center">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Error
          </div>
          <div className="p-5 bg-white">
            <div className="flex items-center mb-1">
              <svg className="w-5 h-5 mr-2 text-[#FBE4E7]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="font-medium text-[#3C3C3C]">Processing Error</p>
            </div>
            <p className="text-sm text-[#3C3C3C] ml-7">{processingError}</p>
          </div>
        </div>
      )}

      {/* Show "processing" message if entry hasn't been processed */}
      {!analysis.processed && !isProcessing && !processingError && (
        <div className="card mb-6 overflow-hidden">
          <div className="py-2 px-4 bg-[#CFE3DC] text-[#3C3C3C] font-medium flex items-center justify-center">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Notice
          </div>
          <div className="p-5 bg-white">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#3C3C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-sm text-[#3C3C3C]">
                This entry hasn't been fully analyzed yet. Click "Analyze Entry" to process it.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Show all insights together when processed */}
      {analysis.processed && (
        <div className="space-y-6">
          {/* Reflection */}
          {analysis.supportiveResponse && (
            <div className="card overflow-hidden">
              <div className="py-2 px-4 bg-gradient-to-r from-[#3C3C3C] to-[#3C3C3C]/90 text-white font-medium flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
                AI Reflection
              </div>
              <div className="p-6 bg-white">
                <div className="flex items-start">
                  <div className="bg-[#3C3C3C] rounded-full p-2.5 mr-4 mt-1 shadow-md">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                  </div>
                  <blockquote className="italic text-[#3C3C3C] border-l-4 border-[#CFE3DC] pl-4 leading-relaxed">
                    {analysis.supportiveResponse}
                  </blockquote>
                </div>
              </div>
            </div>
          )}

          {/* Identified Patterns */}
          {analysis.identifiedPatterns && analysis.identifiedPatterns.length > 0 && (
            <div className="card overflow-hidden">
              <div className="py-2 px-4 bg-gradient-to-r from-[#C1DFF0] to-[#C1DFF0]/90 text-[#3C3C3C] font-medium flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Identified Patterns
              </div>
              <div className="p-6 bg-white">
                <ul className="space-y-3">
                  {analysis.identifiedPatterns.map((pattern, idx) => (
                    <li key={idx} className="bg-[#F2F4F8] p-4 rounded-lg border-l-4 border-[#C1DFF0] flex items-start shadow-sm transition-all hover:shadow">
                      <div className="bg-[#C1DFF0] rounded-full p-1.5 mr-3 shrink-0 mt-0.5 shadow-sm">
                        <svg className="w-4 h-4 text-[#3C3C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <span className="text-[#3C3C3C] leading-relaxed">{pattern}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Suggested Strategies */}
          {analysis.suggestedStrategies && analysis.suggestedStrategies.length > 0 && (
            <div className="card overflow-hidden">
              <div className="py-2 px-4 bg-gradient-to-r from-[#CFE3DC] to-[#CFE3DC]/90 text-[#3C3C3C] font-medium flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Suggested Strategies
              </div>
              <div className="p-6 bg-white">
                <ul className="space-y-3">
                  {analysis.suggestedStrategies.map((strategy, idx) => (
                    <li key={idx} className="bg-[#F2F4F8] p-4 rounded-lg border-l-4 border-[#CFE3DC] flex items-start shadow-sm transition-all hover:shadow">
                      <div className="bg-[#CFE3DC] rounded-full p-1.5 mr-3 shrink-0 mt-0.5 shadow-sm">
                        <svg className="w-4 h-4 text-[#3C3C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-[#3C3C3C] leading-relaxed">{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 text-xs text-[#3C3C3C] bg-[#F2F4F8] p-4 rounded-lg border border-[#C1DFF0] shadow-sm">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-[#3C3C3C]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p>
            These insights are generated by AI to help with reflection. They
            are not professional mental health advice.
          </p>
        </div>
      </div>
    </div>
  );
}