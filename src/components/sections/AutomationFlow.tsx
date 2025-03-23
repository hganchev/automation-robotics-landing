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
    // Initialize GSAP ScrollTrigger for animation flow
    if (sectionRef.current && componentsRef.current) {
      // Create a timeline for the sequence of animations
      timelineRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        }
      });

      // Get all component elements
      const components = componentsRef.current.querySelectorAll('.automation-component');
      
      // Animate each component appearing sequentially
      components.forEach((component, index) => {
        timelineRef.current?.fromTo(
          component, 
          { 
            opacity: 0, 
            y: 50, 
            scale: 0.8 
          }, 
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.5,
            ease: 'power2.out' 
          }, 
          index * 0.2
        );
      });
      
      // Animate the connecting lines between components
      const connectors = componentsRef.current.querySelectorAll('.connector');
      connectors.forEach((connector, index) => {
        timelineRef.current?.fromTo(
          connector, 
          { 
            width: '0%', 
            opacity: 0 
          }, 
          { 
            width: '100%', 
            opacity: 1, 
            duration: 0.3,
            ease: 'none' 
          }, 
          (index + 1) * 0.2 - 0.1
        );
      });
      
      // Final animation showing the complete system
      timelineRef.current.to('.automation-system', {
        boxShadow: '0 0 30px rgba(10, 132, 255, 0.6)',
        duration: 0.5,
      });
    }
    
    // Cleanup
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  // Shader-like effect for background lighting change
  useEffect(() => {
    if (sectionRef.current) {
      // Create scroll-based lighting effect
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          // Transition background colors based on scroll position
          const progress = self.progress;
          const startColor = { r: 10, g: 10, b: 25 }; // Dark blue-black
          const endColor = { r: 20, g: 40, b: 80 }; // Lighter blue
          
          // Interpolate between colors
          const r = Math.floor(startColor.r + (endColor.r - startColor.r) * progress);
          const g = Math.floor(startColor.g + (endColor.g - startColor.g) * progress);
          const b = Math.floor(startColor.b + (endColor.b - startColor.b) * progress);
          
          // Apply gradient background
          sectionRef.current!.style.background = 
            `linear-gradient(180deg, rgb(${r}, ${g}, ${b}), rgb(${r - 5}, ${g - 10}, ${b - 5}))`;
          
          // Add pulsing effect
          const pulse = Math.sin(Date.now() / 1000) * 0.05 + 0.95;
          sectionRef.current!.style.boxShadow = `inset 0 0 100px rgba(10, 132, 255, ${0.1 * pulse})`;
        }
      });
    }
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="min-h-screen py-20 px-4 md:px-10 transition-all duration-500"
      style={{ background: 'rgb(10, 10, 25)' }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-center">
          Intelligent Automation Flow
        </h2>
        <p className="text-xl text-blue-200 mb-20 text-center max-w-2xl mx-auto">
          Watch as our integrated systems work together to create a seamless automation process
        </p>
        
        <div 
          ref={componentsRef}
          className="automation-system relative bg-gray-900/40 backdrop-blur-sm rounded-lg p-8 border border-blue-900/50"
        >
          {/* Component 1: Sensor Array */}
          <div className="automation-component flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center">
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
          
          {/* Connector Line */}
          <div className="connector h-10 w-1 bg-blue-500 ml-8 opacity-0"></div>
          
          {/* Component 2: AI Processing */}
          <div className="automation-component flex items-center gap-4 mb-10 ml-8">
            <div className="w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 11.5c0-1.4-1.1-2.5-2.5-2.5h-3.8L15 7.1c-.2-.5-.7-.8-1.2-.8h-3.6c-.5 0-1 .4-1.2.8l-.7 1.9H4.5C3.1 9 2 10.1 2 11.5v7C2 19.9 3.1 21 4.5 21h15c1.4 0 2.5-1.1 2.5-2.5v-7zM12 18c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"></path>
                <circle cx="12" cy="14" r="2.5"></circle>
              </svg>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">AI Processing Unit</h4>
              <p className="text-blue-200">Real-time decision making with neural network optimization</p>
            </div>
          </div>
          
          {/* Connector Line */}
          <div className="connector h-10 w-1 bg-blue-500 ml-16 opacity-0"></div>
          
          {/* Component 3: Robotic Control */}
          <div className="automation-component flex items-center gap-4 mb-10 ml-16">
            <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 5h10v2h2V3H5v4h2V5zm10 16H7v-2H5v4h14v-4h-2v2zm-6-3c3.3 0 6-2.7 6-6s-2.7-6-6-6-6 2.7-6 6 2.7 6 6 6zm0-10c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z"></path>
              </svg>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Robotic Control System</h4>
              <p className="text-blue-200">Precision movement with adaptive adjustment capabilities</p>
            </div>
          </div>
          
          {/* Connector Line */}
          <div className="connector h-10 w-1 bg-blue-500 ml-24 opacity-0"></div>
          
          {/* Component 4: Automated Transport */}
          <div className="automation-component flex items-center gap-4 mb-10 ml-24">
            <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.7 1.3 3 3 3s3-1.3 3-3h6c0 1.7 1.3 3 3 3s3-1.3 3-3h2v-5l-3-4zm-1 1.5l1.96 2.5H17V9.5h2zm-11 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm9 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path>
              </svg>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Automated Transport</h4>
              <p className="text-blue-200">Intelligent AGVs and conveyor systems for material movement</p>
            </div>
          </div>
          
          {/* Connector Line */}
          <div className="connector h-10 w-1 bg-blue-500 ml-32 opacity-0"></div>
          
          {/* Component 5: Quality Control */}
          <div className="automation-component flex items-center gap-4 ml-32">
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center">
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
        
        {/* Blueprint overlay that appears on scroll */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20 mix-blend-screen">
          <div className="w-full h-full bg-blueprint bg-repeat"></div>
        </div>
      </div>
    </section>
  );
};

export default AutomationFlow;