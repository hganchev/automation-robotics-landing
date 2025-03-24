'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Feature data
const features = [
  {
    icon: (
      <svg className="w-6 h-6 text-blue-400 feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "AI-Powered Optimization",
    description: "Machine learning algorithms continuously optimize robot movements and production flow for maximum efficiency."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-blue-400 feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Predictive Maintenance",
    description: "Prevent unexpected downtime with advanced diagnostics that predict maintenance needs before failures occur."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-blue-400 feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: "Cloud Integration",
    description: "Seamlessly connect your automation systems to the cloud for remote monitoring, updates, and data analytics."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-blue-400 feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: "Modular Systems",
    description: "Easily reconfigure your production line with plug-and-play modularity for different production needs."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-blue-400 feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    title: "Adaptive Learning",
    description: "Systems that learn from experience, continuously improving performance and adapting to changing conditions."
  },
  {
    icon: (
      <svg className="w-6 h-6 text-blue-400 feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
    title: "Advanced Security",
    description: "Industry-leading security protocols to protect your automation systems and data from external threats."
  }
];

// Feature Card Component
const FeatureCard = React.forwardRef<HTMLDivElement, {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}>(({ icon, title, description, index }, ref) => (
  <div
    ref={ref}
    className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-blue-900/30 hover:border-blue-500/50 transition-all group"
    data-index={index}
    style={{ opacity: 0, transform: 'translateY(50px)' }}
  >
    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600/40 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-blue-200">{description}</p>
  </div>
));

FeatureCard.displayName = 'FeatureCard';

const AdvancedFeatures: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const featureRefs = useRef<Array<HTMLDivElement | null>>([]);
  
  // Initialize animations when component mounts
  useEffect(() => {
    // Ensure we're in the browser
    if (typeof window === 'undefined') return;
    
    // Force register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Short delay to ensure DOM elements are fully rendered
    const initTimer = setTimeout(() => {
      // Set initial state for title and subtitle
      if (titleRef.current && subtitleRef.current) {
        gsap.set([titleRef.current, subtitleRef.current], { 
          opacity: 0,
          y: 30 
        });
      }
      
      // Animate title and subtitle first
      const titleAnimation = gsap.to([titleRef.current, subtitleRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        immediateRender: false
      });
      
      // Create ScrollTrigger for title/subtitle
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        end: "top 50%",
        animation: titleAnimation,
        once: false,
        id: "title-animation"
      });
      
      // Animate each feature card
      featureRefs.current.forEach((card, index) => {
        if (!card) return;
        
        // Calculate stagger delay based on grid position
        const row = Math.floor(index / 3);
        const col = index % 3;
        const delay = row * 0.2 + col * 0.1;
        
        // Create animation for this card
        const cardAnim = gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.2)",
          delay: delay,
          immediateRender: false
        });
        
        // Create ScrollTrigger for this card
        ScrollTrigger.create({
          trigger: card,
          start: "top 90%",
          end: "top 60%",
          animation: cardAnim,
          id: `card-${index}`
        });
      });
      
      // Create animation for icon pulse effect
      const icons = document.querySelectorAll(".feature-icon");
      icons.forEach(icon => {
        gsap.to(icon, {
          scale: 1.2,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, 500);
    
    // Cleanup function for animation context
    return () => {
      clearTimeout(initTimer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf(".feature-icon");
    };
  }, []);

  // Set up refs array
  const setFeatureRef = (el: HTMLDivElement | null, index: number) => {
    featureRefs.current[index] = el;
  };
  
  return (
    <section 
      ref={sectionRef} 
      className="py-24 px-6 md:px-10 bg-gray-900"
      id="advanced-features"
    >
      <div className="max-w-6xl mx-auto">
        <h2 
          ref={titleRef}
          className="text-3xl md:text-5xl font-bold mb-4 text-center"
          style={{ opacity: 0, transform: 'translateY(30px)' }}
        >
          Advanced <span className="text-blue-400">Features</span>
        </h2>
        <p 
          ref={subtitleRef}
          className="text-xl text-blue-200 mb-16 text-center max-w-2xl mx-auto"
          style={{ opacity: 0, transform: 'translateY(30px)' }}
        >
          Our next-generation robotics and automation solutions offer unparalleled capabilities
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              ref={(el) => setFeatureRef(el, index)}
              index={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvancedFeatures;