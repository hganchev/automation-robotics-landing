'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins outside component but inside client-side check
if (typeof window !== 'undefined') {
  // Only register the plugin once
  if (!gsap.plugins || !gsap.plugins.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }
  
  // Disable smooth scroll (which can interfere with ScrollTrigger)
  // Uncomment if needed
  // gsap.config({ nullTargetWarn: false });
}

// Component types
type AutomationComponentProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  className?: string;
};

// Reusable component for automation items
const AutomationComponent = React.forwardRef<
  HTMLDivElement,
  AutomationComponentProps
>(({ icon, title, description, bgColor, className = '' }, ref) => (
  <div ref={ref} className={`flex items-center gap-6 ${className}`}>
    <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div>
      <h4 className="text-xl font-bold text-white">{title}</h4>
      <p className="text-blue-200">{description}</p>
    </div>
  </div>
));

// Add display name for React DevTools
AutomationComponent.displayName = 'AutomationComponent';

// Connector component
const Connector = React.forwardRef<HTMLDivElement, { className?: string }>((props, ref) => (
  <div 
    ref={ref} 
    className={`h-12 w-0.5 bg-blue-500 ${props.className || ''}`}
  />
));

Connector.displayName = 'Connector';

const AutomationFlow: React.FC = () => {
  // Refs for animation targets
  const sectionRef = useRef<HTMLDivElement>(null);
  const component1Ref = useRef<HTMLDivElement>(null);
  const component2Ref = useRef<HTMLDivElement>(null);
  const component3Ref = useRef<HTMLDivElement>(null);
  const connector1Ref = useRef<HTMLDivElement>(null);
  const connector2Ref = useRef<HTMLDivElement>(null);
  
  // Flag to track if animation has been initialized
  const isInitializedRef = useRef(false);
  
  // Initialize animations
  useEffect(() => {
    // Safety check for browser environment
    if (typeof window === 'undefined') return;
    
    // Prevent double initialization
    if (isInitializedRef.current) return;
    
    // Make sure ScrollTrigger is registered
    if (!gsap.plugins || !gsap.plugins.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
    
    // Delay slightly to ensure DOM is fully ready
    const initTimer = setTimeout(() => {
      // Make sure all refs are available before attempting to animate
      if (!sectionRef.current || 
          !component1Ref.current || 
          !component2Ref.current || 
          !component3Ref.current || 
          !connector1Ref.current || 
          !connector2Ref.current) {
        return;
      }
      
      // Create a GSAP context for proper cleanup
      const ctx = gsap.context(() => {
        // Set initial states
        gsap.set([component1Ref.current, component2Ref.current, component3Ref.current], {
          opacity: 0,
          x: -50,
          scale: 0.9
        });
        
        gsap.set([connector1Ref.current, connector2Ref.current], {
          height: '0%',
          opacity: 0
        });
        
        // Force a refresh of ScrollTrigger
        ScrollTrigger.refresh(true);
        
        // Animate first component with simpler configuration
        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%', // Trigger earlier in the viewport
            toggleActions: 'play none none reverse',
            once: false,
            id: 'component-1',
            markers: false, // Enable markers for debugging (remove in production)
          }
        })
        .to(component1Ref.current, {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out'
        });
        
        // Animate first connector and second component
        gsap.timeline({
          scrollTrigger: {
            trigger: component1Ref.current,
            start: 'bottom 70%',
            toggleActions: 'play none none reverse',
            once: false,
            id: 'component-2',
            markers: false, // Enable markers for debugging (remove in production)
          }
        })
        .to(connector1Ref.current, {
          height: '100%',
          opacity: 1,
          duration: 0.6,
          ease: 'power1.inOut'
        })
        .to(component2Ref.current, {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.3');
        
        // Animate second connector and third component
        gsap.timeline({
          scrollTrigger: {
            trigger: component2Ref.current,
            start: 'bottom 70%',
            toggleActions: 'play none none reverse',
            once: false,
            id: 'component-3',
            markers: false, // Enable markers for debugging (remove in production)
          }
        })
        .to(connector2Ref.current, {
          height: '100%',
          opacity: 1,
          duration: 0.6,
          ease: 'power1.inOut'
        })
        .to(component3Ref.current, {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.3');
        
        // Mark as initialized
        isInitializedRef.current = true;
      }, sectionRef);
      
      // Cleanup function
      return () => {
        ctx.revert(); // Clean up all GSAP animations and ScrollTriggers
        isInitializedRef.current = false;
      };
    }, 500); // Small delay to ensure DOM is ready
    
    return () => {
      clearTimeout(initTimer);
    };
  }, []); // Empty dependency array means this only runs once on mount

  return (
    <section 
      ref={sectionRef} 
      className="min-h-screen py-20 px-4 md:px-10 transition-all duration-500 relative overflow-hidden"
      style={{ background: 'rgb(10, 10, 25)' }}
      id="automation-flow-section" // Add ID for easier debug
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-12 text-center">
          Intelligent <span className="text-blue-400">Automation</span> Flow
        </h2>
        
        <div className="automation-system relative bg-gray-900/40 backdrop-blur-sm rounded-lg p-8 border border-blue-900/50">
          <div className="space-y-12">
            {/* Component 1: Sensor Array */}
            <AutomationComponent
              ref={component1Ref as React.RefObject<HTMLDivElement>}
              icon={
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"></path>
                  <path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path>
                </svg>
              }
              title="Smart Sensor Array"
              description="Detects objects and environmental conditions with 99.8% accuracy"
              bgColor="bg-blue-800"
            />
            
            <Connector ref={connector1Ref as React.RefObject<HTMLDivElement>} className="ml-8" />
            
            {/* Component 2: AI Processing */}
            <AutomationComponent
              ref={component2Ref as React.RefObject<HTMLDivElement>}
              icon={
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 11.5c0-1.4-1.1-2.5-2.5-2.5h-3.8L15 7.1c-.2-.5-.7-.8-1.2-.8h-3.6c-.5 0-1 .4-1.2.8l-.7 1.9H4.5C3.1 9 2 10.1 2 11.5v7C2 19.9 3.1 21 4.5 21h15c1.4 0 2.5-1.1 2.5-2.5v-7z"></path>
                  <path d="M12 18c-2.2 0-4-1.8-4-4s1.8-4 4-4 4-1.8 4-4-1.8-4-4-4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                </svg>
              }
              title="AI Processing Unit"
              description="Real-time decision making with neural network optimization"
              bgColor="bg-purple-700"
              className="ml-8"
            />
            
            <Connector ref={connector2Ref as React.RefObject<HTMLDivElement>} className="ml-16" />
            
            {/* Component 3: Quality Control */}
            <AutomationComponent
              ref={component3Ref as React.RefObject<HTMLDivElement>}
              icon={
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.5 14.2l2.9 1.7-.8 1.3L13 15v-5h1.5v4.2zM22 7h-7V2H9v5H2v15h20V7zM11 4h2v2h-2V4zM4 20V9h16v11H4z"></path>
                  <path d="M12 10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2-.9 2-2-.9-2-2-2z"></path>
                </svg>
              }
              title="Quality Control"
              description="Advanced inspection with machine vision and AI defect detection"
              bgColor="bg-yellow-600"
              className="ml-16"
            />
          </div>
        </div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20 mix-blend-screen">
        <div className="w-full h-full bg-blueprint bg-repeat"></div>
      </div>
    </section>
  );
};

export default AutomationFlow;