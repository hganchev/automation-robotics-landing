'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const AutomationFlow: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const componentsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (sectionRef.current && componentsRef.current) {
      timelineRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        }
      });

      const components = componentsRef.current.querySelectorAll('.automation-component');
      
      components.forEach((component, index) => {
        timelineRef.current?.fromTo(
          component, 
          { 
            opacity: 0, 
            x: -50, 
            scale: 0.9 
          }, 
          { 
            opacity: 1, 
            x: 0, 
            scale: 1, 
            duration: 0.4,
            ease: 'power2.out' 
          }, 
          index * 0.3
        );
      });
      
      const connectors = componentsRef.current.querySelectorAll('.connector');
      connectors.forEach((connector, index) => {
        timelineRef.current?.fromTo(
          connector, 
          { 
            height: '0%', 
            opacity: 0 
          }, 
          { 
            height: '100%', 
            opacity: 1, 
            duration: 0.3,
            ease: 'power1.inOut' 
          }, 
          (index + 1) * 0.3 - 0.15
        );
      });
    }
    
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="min-h-screen py-20 px-4 md:px-10 transition-all duration-500 relative overflow-hidden"
      style={{ background: 'rgb(10, 10, 25)' }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-12 text-center">
          Intelligent <span className="text-blue-400">Automation</span> Flow
        </h2>
        
        <div 
          ref={componentsRef}
          className="automation-system relative bg-gray-900/40 backdrop-blur-sm rounded-lg p-8 border border-blue-900/50"
        >
          <div className="space-y-12">
            {/* Component 1: Sensor Array */}
            <div className="automation-component flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"></path>
                  <path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Smart Sensor Array</h4>
                <p className="text-blue-200">Detects objects and environmental conditions with 99.8% accuracy</p>
              </div>
            </div>
            
            <div className="connector h-12 w-0.5 bg-blue-500 ml-8 opacity-0"></div>
            
            <div className="automation-component flex items-center gap-6 ml-8">
              <div className="w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 11.5c0-1.4-1.1-2.5-2.5-2.5h-3.8L15 7.1c-.2-.5-.7-.8-1.2-.8h-3.6c-.5 0-1 .4-1.2.8l-.7 1.9H4.5C3.1 9 2 10.1 2 11.5v7C2 19.9 3.1 21 4.5 21h15c1.4 0 2.5-1.1 2.5-2.5v-7z"></path>
                  <path d="M12 18c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">AI Processing Unit</h4>
                <p className="text-blue-200">Real-time decision making with neural network optimization</p>
              </div>
            </div>
            
            <div className="connector h-12 w-0.5 bg-blue-500 ml-16 opacity-0"></div>
            
            <div className="automation-component flex items-center gap-6 ml-16">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.5 14.2l2.9 1.7-.8 1.3L13 15v-5h1.5v4.2zM22 7h-7V2H9v5H2v15h20V7zM11 4h2v2h-2V4zM4 20V9h16v11H4z"></path>
                  <path d="M12 10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Quality Control</h4>
                <p className="text-blue-200">Advanced inspection with machine vision and AI defect detection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20 mix-blend-screen">
        <div className="w-full h-full bg-blueprint bg-repeat"></div>
      </div>
    </section>
  );
};

export default AutomationFlow;