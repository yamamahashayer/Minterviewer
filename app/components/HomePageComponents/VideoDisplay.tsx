'use client';

'use client';

import React, { useState, useEffect } from "react";
import { useTheme } from "../../../Context/ThemeContext";

interface VideoDisplayProps {
  title?: string;
  subtitle?: string;
  delay?: number;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({
  title,
  subtitle,
  delay = 0,
}) => {
  const { isDark } = useTheme();
  const [dimensions, setDimensions] = useState({
    barHeights: [] as number[],
    barDurations: [] as number[],
  });

  useEffect(() => {
    const generateBars = () => {
      const isMobile = window.innerWidth < 640;
      const maxHeight = isMobile ? 30 : 40;
      const minHeight = isMobile ? 8 : 10;

      const heights = [...Array(12)].map(() =>
        Math.random() * maxHeight + minHeight
      );
      const durations = [...Array(12)].map(() =>
        800 + Math.random() * 400
      );

      setDimensions({
        barHeights: heights,
        barDurations: durations,
      });
    };

    // Initial generation
    generateBars();

    // Optional: Add window resize handler
    const handleResize = () => generateBars();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); return (
    <div
      className={`${isDark ? '!bg-[#2C313A]' : '!bg-[#1B2A30]'} rounded-xl p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[180px] sm:min-h-[200px] lg:min-h-[220px] relative overflow-hidden transition-all duration-500 hover:scale-105 shadow-lg transform`}
      style={{
        animationDelay: `${delay * 200}ms`,
        animationDuration: "1s",
        animationFillMode: "both",
        animationName: "fadeInScale",
      }}
    >
      {/* Green indicator dot */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 w-2.5 sm:w-3 h-2.5 sm:h-3 bg-green-400 rounded-full"></div>

      {/* Audio visualization bars */}
      <div className="flex items-end space-x-0.5 sm:space-x-1 mb-3 sm:mb-4">
        {dimensions.barHeights.map((height, i) => (
          <div
            key={i}
            className={`bg-green-400 rounded-sm transition-all duration-300 hover:bg-green-300`}
            style={{
              width: window.innerWidth >= 640 ? "4px" : "3px",
              height: `${height}px`,
              animationDelay: `${i * 100}ms`,
              animationDuration: `${dimensions.barDurations[i]}ms`,
            }}
          ></div>
        ))}
      </div>

      {title && (
        <div
          className="text-center px-2 opacity-0 animate-fade-in"
          style={{
            animationDelay: `${delay * 200 + 500}ms`,
            animationFillMode: "forwards",
          }}
        >
          <p className="text-white text-xs sm:text-sm font-medium leading-tight">
            {title}
          </p>
          {subtitle && (
            <p
              className={`${isDark ? "text-gray-300" : "text-gray-400"
                } text-xs mt-1`}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default VideoDisplay;
