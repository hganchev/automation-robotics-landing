import React from 'react';
import RoboticScene from '../components/3d/RoboticScene';
import AutomationFlow from '../components/sections/AutomationFlow';
import LiveDataDashboard from '../components/sections/LiveDataDashboard';

export default function Home() {
  return (
    <div className="bg-black text-white">
      {/* Hero section with 3D robotic arm */}
      <RoboticScene />
      
      {/* Interactive automation flow visualization */}
      <AutomationFlow />
      
      {/* Live data dashboard section */}
      <LiveDataDashboard />
      
      {/* Features section */}
      <section className="py-24 px-6 md:px-10 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">
            Advanced <span className="text-blue-400">Features</span>
          </h2>
          <p className="text-xl text-blue-200 mb-16 text-center max-w-2xl mx-auto">
            Our next-generation robotics and automation solutions offer unparalleled capabilities
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-blue-900/30 hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600/40 transition-colors">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">AI-Powered Optimization</h3>
              <p className="text-blue-200">Machine learning algorithms continuously optimize robot movements and production flow for maximum efficiency.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-blue-900/30 hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600/40 transition-colors">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Predictive Maintenance</h3>
              <p className="text-blue-200">Prevent unexpected downtime with advanced diagnostics that predict maintenance needs before failures occur.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-blue-900/30 hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600/40 transition-colors">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Cloud Integration</h3>
              <p className="text-blue-200">Seamlessly connect your automation systems to the cloud for remote monitoring, updates, and data analytics.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-blue-900/30 hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600/40 transition-colors">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Modular Systems</h3>
              <p className="text-blue-200">Easily reconfigure your production line with plug-and-play modularity for different production needs.</p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-blue-900/30 hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600/40 transition-colors">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Adaptive Learning</h3>
              <p className="text-blue-200">Systems that learn from experience, continuously improving performance and adapting to changing conditions.</p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-blue-900/30 hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600/40 transition-colors">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Advanced Security</h3>
              <p className="text-blue-200">Industry-leading security protocols to protect your automation systems and data from external threats.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 z-0"></div>
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 z-0"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to <span className="text-blue-400">Transform</span> Your Manufacturing?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join the future of intelligent automation with our cutting-edge robotics solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors">
              Request a Demo
            </button>
            <button className="bg-transparent border border-blue-400 hover:bg-blue-900/30 text-blue-300 px-8 py-4 rounded-lg font-medium text-lg transition-colors">
              View Case Studies
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">AutomateX</h3>
            <p className="text-blue-300 mb-6">Revolutionizing manufacturing with next-generation automation and robotics solutions.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-400 hover:text-blue-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 4.01c-1 .49-2.07.83-3.19.99C19.69 4.38 18.92 3.8 18 3.5c-1.73-.65-3.77.12-4.5 1.69C13 5.8 13 6.44 13 7.78v.59c-3.38 0-6.76-1.48-9-4 0 0-4.74 5.81 1.1 9.94.99.73 2.75 1.46 4.9 1.46v.59c0 1.58-.29 3.37-2 4.39 2.08.98 4.51 1.11 6.6.37 3.09-1.09 5.16-4 5.4-7.21.1-1.31 0-2.26 0-2.26-.58 2.54-2.95 3.63-4.5 3.63 0 0 4.34-.95 4.5-6.38V8.43c.96.66 1.91.94 3 1.06-1.13-1.11-2.86-1.55-3-1.55S22 4.01 22 4.01z" />
                </svg>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-3.25c0-.69-.56-1.25-1.25-1.25S10 11.31 10 12v3H8v-6h2v1.29c.52-.72 1.14-1.29 2.25-1.29 1.71 0 2.75 1.16 2.75 3v3z" />
                </svg>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Solutions</h4>
            <ul className="space-y-2 text-blue-300">
              <li><a href="#" className="hover:text-blue-100">Robotic Arms</a></li>
              <li><a href="#" className="hover:text-blue-100">Conveyor Systems</a></li>
              <li><a href="#" className="hover:text-blue-100">Vision Systems</a></li>
              <li><a href="#" className="hover:text-blue-100">IoT Integration</a></li>
              <li><a href="#" className="hover:text-blue-100">Digital Twins</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-blue-300">
              <li><a href="#" className="hover:text-blue-100">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-100">Case Studies</a></li>
              <li><a href="#" className="hover:text-blue-100">Whitepapers</a></li>
              <li><a href="#" className="hover:text-blue-100">Webinars</a></li>
              <li><a href="#" className="hover:text-blue-100">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-blue-300">
              <li><a href="#" className="hover:text-blue-100">About Us</a></li>
              <li><a href="#" className="hover:text-blue-100">Careers</a></li>
              <li><a href="#" className="hover:text-blue-100">Contact Us</a></li>
              <li><a href="#" className="hover:text-blue-100">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-100">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-blue-900/30 text-center text-blue-400 text-sm">
          &copy; {new Date().getFullYear()} AutomateX Robotics. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
