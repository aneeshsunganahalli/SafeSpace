'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import cloud from 'd3-cloud';
import { scaleOrdinal, scaleSqrt } from 'd3-scale'; // Import scaleSqrt
import { schemeTableau10 } from 'd3-scale-chromatic'; // Use a different color scheme

interface WordData {
  text: string;
  value: number;
}

// Interface for words after layout calculation by d3-cloud
interface LayoutWord extends cloud.Word {
  text: string;
  size: number;
  x: number;
  y: number;
  rotate: number;
}

// Define color scale outside useEffect so it's accessible in render
const colorScale = scaleOrdinal(schemeTableau10); // Use schemeTableau10

export default function WordCloudDisplay() {
  const [wordData, setWordData] = useState<WordData[]>([]);
  const [layoutWords, setLayoutWords] = useState<LayoutWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState<'week' | 'twoWeeks'>('week');
  const { token } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchWordCloudData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError('');
      setLayoutWords([]); // Clear previous layout
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/journal/wordcloud`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            timeframe: timeframe,
          },
        }
      );
      setWordData(response.data);
    } catch (err) {
      console.error('Error fetching word cloud data:', err);
      setError('Failed to load word cloud data');
      setWordData([]);
      setLayoutWords([]);
    } finally {
      // Keep loading true until layout is done in the effect
    }
  }, [token, timeframe]);

  useEffect(() => {
    fetchWordCloudData();
  }, [fetchWordCloudData]);

  // Effect to run d3-cloud layout when wordData changes or container resizes (simplified)
  useEffect(() => {
    // Ensure containerRef.current exists before accessing dimensions
    if (wordData.length > 0 && containerRef.current) {
      setLoading(true); // Start loading indicator for layout calculation
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      // Define a non-linear scale for font size (e.g., square root)
      const maxFreq = Math.max(...wordData.map(d => d.value), 0);
      const fontSizeScale = scaleSqrt()
        .domain([0, maxFreq]) // Domain from 0 to max frequency
        .range([10, 70]); // Output font size range (adjust as needed)

      const layout = cloud()
        .size([containerWidth, containerHeight])
        // Map data, applying the new font size scale
        .words(wordData.map(d => ({ text: d.text, size: fontSizeScale(d.value), value: d.value })))
        .padding(8) // Increased padding
        .rotate(0) // Make all words horizontal
        .font('Inter')
        .fontSize(d => d.size || 10) // Use calculated size
        .on('end', (words: cloud.Word[]) => {
          // Cast to LayoutWord[] - assuming d3-cloud adds x, y, rotate etc.
          setLayoutWords(words as LayoutWord[]);
          setLoading(false); // Layout finished
        });

      layout.start();
    } else if (!loading && wordData.length === 0) {
        // If fetch finished but no data, stop loading
        setLoading(false);
    }
    // Add containerRef.current as a dependency to potentially re-run if it changes
    // Although in this simple case, it might not be strictly necessary if size is fixed
  }, [wordData, containerRef.current]); // Rerun layout if wordData or container ref changes

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Common Themes</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              timeframe === 'week'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            disabled={loading}
          >
            Past Week
          </button>
          <button
            onClick={() => setTimeframe('twoWeeks')}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              timeframe === 'twoWeeks'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            disabled={loading}
          >
            Past 2 Weeks
          </button>
        </div>
      </div>
      <div ref={containerRef} className="h-64 w-full relative">
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-10">
            <p className="text-gray-500">Loading word cloud...</p>
          </div>
        )}
        {error && !loading && (
          <div className="absolute inset-0 flex justify-center items-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        {!loading && !error && wordData.length === 0 && (
          <div className="absolute inset-0 flex justify-center items-center">
            <p className="text-gray-500">Not enough data for word cloud.</p>
          </div>
        )}
        {!loading && !error && layoutWords.length > 0 && containerRef.current && ( // Ensure ref is current here too
          <svg width="100%" height="100%">
            {/* Use containerRef.current dimensions for centering */}
            <g transform={`translate(${containerRef.current.offsetWidth / 2}, ${containerRef.current.offsetHeight / 2})`}>
              {layoutWords.map((word, i) => (
                <text
                  key={word.text + i}
                  fontFamily={word.font || 'Inter'}
                  fontSize={word.size}
                  // Use the updated colorScale
                  fill={colorScale(word.text) as string}
                  textAnchor="middle"
                  transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
                  style={{ cursor: 'default', transition: 'font-size 0.3s ease' }} // Add smooth transition
                >
                  {word.text}
                </text>
              ))}
            </g>
          </svg>
        )}
      </div>
    </div>
  );
}
