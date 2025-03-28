'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// Mock data for IoT sensors
const generateMockData = () => ({
  temperature: Math.floor(Math.random() * 15) + 65, // 65-80
  humidity: Math.floor(Math.random() * 30) + 40, // 40-70
  pressure: Math.floor(Math.random() * 20) + 990, // 990-1010
  vibration: Math.floor(Math.random() * 100) / 10, // 0-10
  energy: Math.floor(Math.random() * 40) + 80, // 80-120
  production: Math.floor(Math.random() * 15) + 85, // 85-100
  efficiency: Math.floor(Math.random() * 12) + 88, // 88-100
  defectRate: Math.floor(Math.random() * 100) / 100, // 0-1%
});

const LiveDataDashboard: React.FC = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [sensorData, setSensorData] = useState(generateMockData());
  const [activeRobot, setActiveRobot] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  
  // Handle client-side initialization
  useEffect(() => {
    // Set initial time with static value to prevent hydration mismatch
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}:${seconds}`);
    
    // Small delay before setting client state to prevent flicker
    const timer = setTimeout(() => {
      setIsClient(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Update time every second with RAF for smoother updates
  useEffect(() => {
    if (!isClient) return;
    
    let frameId: number;
    let lastUpdate = 0;
    
    const updateTime = (timestamp: number) => {
      // Update only if a second has passed
      if (timestamp - lastUpdate >= 1000) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        setCurrentTime(`${hours}:${minutes}:${seconds}`);
        lastUpdate = timestamp;
      }
      frameId = requestAnimationFrame(updateTime);
    };
    
    frameId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(frameId);
  }, [isClient]);
  
  // Simulate live data updates with smoother transitions
  useEffect(() => {
    if (!isClient) return;

    let frameId: number;
    let lastUpdate = 0;
    
    const updateData = (timestamp: number) => {
      // Update every 3 seconds
      if (timestamp - lastUpdate >= 3000) {
        setSensorData(prevData => {
          const newData = generateMockData();
          // Smooth out changes by averaging with previous values
          return {
            temperature: (prevData.temperature + newData.temperature) / 2,
            humidity: (prevData.humidity + newData.humidity) / 2,
            pressure: (prevData.pressure + newData.pressure) / 2,
            vibration: (prevData.vibration + newData.vibration) / 2,
            energy: (prevData.energy + newData.energy) / 2,
            production: (prevData.production + newData.production) / 2,
            efficiency: (prevData.efficiency + newData.efficiency) / 2,
            defectRate: (prevData.defectRate + newData.defectRate) / 2,
          };
        });
        lastUpdate = timestamp;
      }
      frameId = requestAnimationFrame(updateData);
    };
    
    frameId = requestAnimationFrame(updateData);
    return () => cancelAnimationFrame(frameId);
  }, [isClient]);
  
  // Highlight connections on robot hover
  const handleRobotHover = (index: number) => {
    setActiveRobot(index);
    
    if (dashboardRef.current) {
      const connections = dashboardRef.current.querySelectorAll(`.connection-${index}`);
      
      gsap.to(connections, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.1
      });
    }
  };
  
  const handleRobotLeave = (index: number) => {
    setActiveRobot(null);
    
    if (dashboardRef.current) {
      const connections = dashboardRef.current.querySelectorAll(`.connection-${index}`);
      
      gsap.to(connections, {
        strokeDashoffset: 200,
        opacity: 0.3,
        duration: 0.5,
        ease: 'power2.in',
        stagger: 0.1
      });
    }
  };

  if (!isClient) {
    return null; // Return null on server-side to prevent hydration mismatch
  }
  
  return (
    <section className="bg-gray-900 py-24 px-4 md:px-10 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">
          Live Data <span className="text-blue-400">Dashboard</span>
        </h2>
        <p className="text-xl text-blue-200 mb-20 text-center max-w-2xl mx-auto">
          Monitor your entire facility in real-time with our integrated IoT platform
        </p>
        
        <div 
          ref={dashboardRef}
          className="relative bg-black/60 backdrop-blur-md rounded-xl p-6 border border-blue-900/50 min-h-[500px]"
        >
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-8 border-b border-blue-900/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-mono text-green-400">SYSTEM ONLINE</span>
            </div>
            
            <div className="font-mono text-blue-400">
              {currentTime} • LIVE
            </div>
          </div>
          
          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Metrics */}
            <div className="space-y-6">
              <h3 className="font-bold text-xl text-blue-400 mb-4">Environment Metrics</h3>
              
              <div className="space-y-4">
                {/* Temperature */}
                <div className="bg-gray-800/70 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Temperature</span>
                    <span className="text-blue-300 font-mono">{sensorData.temperature}°F</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-red-500 transition-all duration-1000"
                      style={{ width: `${(sensorData.temperature - 60) * 5}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Humidity */}
                <div className="bg-gray-800/70 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Humidity</span>
                    <span className="text-blue-300 font-mono">{sensorData.humidity}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-1000"
                      style={{ width: `${sensorData.humidity}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Pressure */}
                <div className="bg-gray-800/70 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Air Pressure</span>
                    <span className="text-blue-300 font-mono">{sensorData.pressure} mb</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-1000"
                      style={{ width: `${(sensorData.pressure - 980) / 40 * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Vibration */}
                <div className="bg-gray-800/70 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Vibration</span>
                    <span className="text-blue-300 font-mono">{sensorData.vibration} Hz</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 transition-all duration-1000"
                      style={{ width: `${sensorData.vibration * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Middle Column - Interactive Facility Layout */}
            <div className="relative">
              <h3 className="font-bold text-xl text-blue-400 mb-4">Facility Layout</h3>
              
              <div className="relative h-80 bg-blue-900/20 rounded-lg border border-blue-800/50 p-4">
                {/* Factory floor layout (simplified) */}
                {/* For a real implementation, this would be a detailed SVG or Canvas element */}
                <svg width="100%" height="100%" viewBox="0 0 300 300">
                  {/* Floor grid */}
                  <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="0.5" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#smallGrid)" />
                  
                  {/* Main machine outlines */}
                  <rect x="40" y="30" width="80" height="60" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" rx="2" />
                  <rect x="170" y="30" width="80" height="60" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" rx="2" />
                  <rect x="40" y="200" width="80" height="60" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" rx="2" />
                  <rect x="170" y="200" width="80" height="60" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" rx="2" />
                  
                  {/* Central control system */}
                  <circle cx="150" cy="150" r="25" fill="rgba(147, 51, 234, 0.3)" stroke="#9333ea" strokeWidth="2" />
                  <circle cx="150" cy="150" r="18" fill="rgba(147, 51, 234, 0.2)" stroke="#9333ea" strokeWidth="1" />
                  
                  {/* Connection lines - normally hidden, shown on hover */}
                  <path 
                    className="connection-0" 
                    d="M 80 90 L 80 120 L 130 150" 
                    stroke="#3b82f6" 
                    strokeWidth="2" 
                    strokeDasharray="4 2"
                    strokeDashoffset="200"
                    opacity="0.3"
                    fill="none" 
                  />
                  <path 
                    className="connection-1" 
                    d="M 210 90 L 210 120 L 172 150" 
                    stroke="#3b82f6" 
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    strokeDashoffset="200"
                    opacity="0.3" 
                    fill="none" 
                  />
                  <path 
                    className="connection-2" 
                    d="M 80 200 L 80 180 L 130 150" 
                    stroke="#3b82f6" 
                    strokeWidth="2" 
                    strokeDasharray="4 2"
                    strokeDashoffset="200"
                    opacity="0.3"
                    fill="none" 
                  />
                  <path 
                    className="connection-3" 
                    d="M 210 200 L 210 180 L 172 150" 
                    stroke="#3b82f6" 
                    strokeWidth="2" 
                    strokeDasharray="4 2"
                    strokeDashoffset="200"
                    opacity="0.3"
                    fill="none" 
                  />
                  
                  {/* Interactive robots */}
                  <circle 
                    cx="80" 
                    cy="60" 
                    r="12" 
                    fill={activeRobot === 0 ? "rgba(239, 68, 68, 0.8)" : "rgba(239, 68, 68, 0.4)"} 
                    stroke={activeRobot === 0 ? "#ef4444" : "#9b2c2c"} 
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-red-500 transition-all"
                    onMouseEnter={() => handleRobotHover(0)}
                    onMouseLeave={() => handleRobotLeave(0)}
                  />
                  
                  <circle 
                    cx="210" 
                    cy="60" 
                    r="12" 
                    fill={activeRobot === 1 ? "rgba(239, 68, 68, 0.8)" : "rgba(239, 68, 68, 0.4)"} 
                    stroke={activeRobot === 1 ? "#ef4444" : "#9b2c2c"} 
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-red-500 transition-all"
                    onMouseEnter={() => handleRobotHover(1)}
                    onMouseLeave={() => handleRobotLeave(1)}
                  />
                  
                  <circle 
                    cx="80" 
                    cy="230" 
                    r="12" 
                    fill={activeRobot === 2 ? "rgba(239, 68, 68, 0.8)" : "rgba(239, 68, 68, 0.4)"} 
                    stroke={activeRobot === 2 ? "#ef4444" : "#9b2c2c"} 
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-red-500 transition-all"
                    onMouseEnter={() => handleRobotHover(2)}
                    onMouseLeave={() => handleRobotLeave(2)}
                  />
                  
                  <circle 
                    cx="210" 
                    cy="230" 
                    r="12" 
                    fill={activeRobot === 3 ? "rgba(239, 68, 68, 0.8)" : "rgba(239, 68, 68, 0.4)"} 
                    stroke={activeRobot === 3 ? "#ef4444" : "#9b2c2c"} 
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-red-500 transition-all"
                    onMouseEnter={() => handleRobotHover(3)}
                    onMouseLeave={() => handleRobotLeave(3)}
                  />
                </svg>
                
                {/* Hover instructions */}
                <div className="absolute bottom-2 right-2 text-xs text-blue-400 opacity-70">
                  Hover over robots to see connections
                </div>
              </div>
              
              {/* Robot status display - shows data for selected robot */}
              <div className="mt-4 p-4 bg-gray-800/70 rounded-lg">
                <h4 className="font-bold text-blue-400">
                  {activeRobot !== null ? `Robot ${activeRobot + 1} Status` : 'Robot Status'}
                </h4>
                
                {activeRobot !== null ? (
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>Status:</div>
                    <div className="text-green-400">Operational</div>
                    <div>Workload:</div>
                    <div>{Math.floor(Math.random() * 30) + 70}%</div>
                    <div>Last Maintenance:</div>
                    <div>3 days ago</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 mt-2">
                    Select a robot to view details
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column - Production Metrics */}
            <div className="space-y-6">
              <h3 className="font-bold text-xl text-blue-400 mb-4">Production Metrics</h3>
              
              <div className="space-y-4">
                {/* Energy Consumption */}
                <div className="bg-gray-800/70 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Energy Consumption</span>
                    <span className="text-blue-300 font-mono">{sensorData.energy} kWh</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${(sensorData.energy - 70) / 60 * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Production Rate */}
                <div className="bg-gray-800/70 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Production Rate</span>
                    <span className="text-blue-300 font-mono">{sensorData.production}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-1000"
                      style={{ width: `${sensorData.production}%` }}
                    />
                  </div>
                </div>
                
                {/* Efficiency */}
                <div className="bg-gray-800/70 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">System Efficiency</span>
                    <span className="text-blue-300 font-mono">{sensorData.efficiency}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-1000"
                      style={{ width: `${sensorData.efficiency}%` }}
                    />
                  </div>
                </div>
                
                {/* Defect Rate */}
                <div className="bg-gray-800/70 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Defect Rate</span>
                    <span className="text-blue-300 font-mono">{sensorData.defectRate.toFixed(2)}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-1000"
                      style={{ width: `${sensorData.defectRate * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDataDashboard;