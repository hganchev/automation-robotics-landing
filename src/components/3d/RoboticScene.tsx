'use client';

import dynamic from 'next/dynamic';
import React, { useRef } from 'react';
import { useThreeScene } from '@/hooks/useThreeScene';

interface RoboticSceneProps {
  className?: string;
  height?: string;
}

const RoboticScene: React.FC<RoboticSceneProps> = ({
  className = '',
  height = '100vh'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Three.js scene with custom hook
  const { sceneReady } = useThreeScene({
    containerRef,
    mouseMove: true,
    scrollAnimation: true
  });

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Three.js scene container */}
      <div 
        ref={containerRef} 
        className="w-full h-full bg-gradient-to-b from-gray-900 to-black"
        suppressHydrationWarning
      />
      
      {/* Main headline */}
      <div className="absolute top-1/3 left-10 transform -translate-y-1/2 z-10 max-w-xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Next-Gen <span className="text-blue-400">Automation</span> & <span className="text-blue-400">Robotics</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          Revolutionize your manufacturing with cutting-edge robotics and intelligent automation systems.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Explore Solutions
        </button>
      </div>
      
      {/* Universal Robot Label */}
      <div className="absolute bottom-10 right-10 z-10 bg-black/50 backdrop-blur-sm p-3 rounded-lg border border-blue-500/30">
        <div className="text-blue-400 font-mono text-sm">Universal Robot UR10e</div>
        <div className="text-xs text-gray-400">6-axis industrial automation</div>
      </div>
    </div>
  );
};

// Export as dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(RoboticScene), {
  ssr: false
});