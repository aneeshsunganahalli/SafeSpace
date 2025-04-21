'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import cloud from 'd3-cloud';
import { scaleOrdinal, scaleSqrt } from 'd3-scale';
import { schemeTableau10 } from 'd3-scale-chromatic';

interface WordData {
  text: string;
  value: number;
}

interface LayoutWord extends cloud.Word {
  text: string;
  size: number;
  x: number;
  y: number;
  rotate: number;
}

// Define color scale outside
const colorScale = scaleOrdinal(schemeTableau10);

export default function WordCloudDisplay() {
  const [wordData, setWordData] = useState<WordData[]>([]);
  const [layoutWords, setLayoutWords] = useState<LayoutWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState<'week' | 'twoWeeks'>('week');
  const { token } = useAuth();
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  const fetchWordCloudData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    setLayoutWords([]);
    try {
      const response = await axios.get(
        `${backendUrl}/api/journal/wordcloud`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { timeframe: timeframe },
        }
      );
      setWordData(response.data);
    } catch (err) {
      console.error('Error fetching word cloud data:', err);
      setError('Failed to load word cloud data');
      setWordData([]);
    }
  }, [token, timeframe]);

  useEffect(() => {
    fetchWordCloudData();
  }, [fetchWordCloudData]);

  // Effect to run d3-cloud layout for sizing
  useEffect(() => {
    if (wordData.length > 0) {
      setLoading(true);
      // Increase the size ratio to allow words to fill more of the available space
      const layoutWidth = 2000; // Increased from 800 
      const layoutHeight = 800; // Increased from 600

      const maxFreq = Math.max(...wordData.map(d => d.value), 0);
      const fontSizeScale = scaleSqrt()
        .domain([0, maxFreq])
        .range([18, 100]); // Increased minimum and maximum font size

      const layout = cloud()
        .size([layoutWidth, layoutHeight])
        .words(wordData.map(d => ({ text: d.text, size: fontSizeScale(d.value), value: d.value })))
        .padding(2) // Reduced padding to allow words to be closer together
        .rotate(() => (Math.random() > 0.8 ? 90 : 0)) // Reduce number of rotated words
        .font('Inter')
        .fontSize(d => d.size || 16)
        .spiral('rectangular') // Use rectangular spiral for better space filling
        .on('end', (words: cloud.Word[]) => {
          setLayoutWords(words as LayoutWord[]);
          setLoading(false);
        });

      layout.start();
    } else {
      setLayoutWords([]);
      setLoading(false);
    }
  }, [wordData]);

  // Memoize the SVG visualization to avoid recalculating on every render
  const cloudSvg = useMemo(() => {
    if (layoutWords.length === 0) return null;

    const width = 1000; // Match the layout width
    const height = 800; // Match the layout height

    return (
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${width} ${height}`} 
        className="cloud-svg"
        preserveAspectRatio="xMidYMid meet" // Ensures proper scaling
      >
        <defs>
          <filter id="cloud-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="15" result="blur" />
            <feComponentTransfer in="blur" result="glow">
              <feFuncA type="linear" slope="1.5" intercept="-0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="cloud-gradient" cx="50%" cy="50%" r="65%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.7" />
            <stop offset="100%" stopColor="white" stopOpacity="0.3" />
          </radialGradient>
        </defs>
        
        {/* Cloud shape background - enlarged to fill more space */}
        <ellipse 
          cx={width/2} 
          cy={height/2} 
          rx={width * 0.45} // Use 90% of width
          ry={height * 0.4} // Use 80% of height
          fill="url(#cloud-gradient)" 
          filter="url(#cloud-filter)" 
        />
        
        {/* Words positioned by d3-cloud */}
        <g transform={`translate(${width/2},${height/2})`}>
          {layoutWords.map((word, i) => (
            <text
              key={word.text + i}
              textAnchor="middle"
              transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
              fontSize={word.size}
              fontFamily="Inter, sans-serif"
              fill={colorScale(word.text) as string}
              style={{ 
                transition: "font-size 0.3s ease",
                filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.15))"
              }}
            >
              {word.text}
            </text>
          ))}
        </g>
      </svg>
    );
  }, [layoutWords]);

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Word Cloud ☁️</h3>
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

      {/* Container for the SVG */}
      <div className="h-96 w-full relative">
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
        
        {/* Render the SVG word cloud */}
        {!loading && !error && layoutWords.length > 0 && (
          <div className="w-full h-full">
            {cloudSvg}
          </div>
        )}
      </div>
    </div>
  );
}
