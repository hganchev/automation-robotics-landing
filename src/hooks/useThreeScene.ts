'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { 
  createScene, 
  createCamera, 
  createRenderer,
  createUniversalRobot,
  createFactoryFloor,
  animateUniversalRobot
} from '../lib/utils/threeUtils';

interface UseThreeSceneProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  mouseMove?: boolean;
  scrollAnimation?: boolean;
}

export const useThreeScene = ({ 
  containerRef,
  mouseMove = true,
  scrollAnimation = true 
}: UseThreeSceneProps) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const robotRef = useRef<THREE.Group | null>(null);
  const factoryFloorRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  
  const [sceneReady, setSceneReady] = useState(false);
  
  const handleResize = useCallback(() => {
    if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    
    rendererRef.current.setSize(width, height);
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!cameraRef.current || !robotRef.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / containerRef.current.offsetWidth) * 2 - 1;
    const y = -((event.clientY - rect.top) / containerRef.current.offsetHeight) * 2 + 1;
    
    // Reduce movement sensitivity significantly, keep y position stable
    gsap.to(cameraRef.current.position, {
      x: x * 0.3,  // Reduced from 0.5
      // Keep the y position fixed
      duration: 1.5,
      ease: 'power2.out'
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (!robotRef.current || !factoryFloorRef.current || !cameraRef.current) return;
    
    const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    
    // Keep the camera more centered on the robot
    gsap.to(cameraRef.current.position, {
      y: 3 + scrollProgress * 1.5, // Reduced range of movement
      z: 12 - scrollProgress * 2,  // Move camera closer as user scrolls
      duration: 0.5
    });
    
    if (sceneRef.current) {
      sceneRef.current.children.forEach(child => {
        if (child instanceof THREE.Light) {
          gsap.to(child, {
            intensity: 1 + scrollProgress,
            duration: 0.5
          });
        }
      });
    }
    
    if (factoryFloorRef.current) {
      gsap.to(factoryFloorRef.current.rotation, {
        x: scrollProgress * 0.1,
        duration: 0.5
      });
    }
  }, []);

  // Main scene initialization effect
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    mountedRef.current = true;
    
    const initScene = () => {
      if (!containerRef.current || !mountedRef.current) return;
      
      try {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        const scene = createScene();
        const camera = createCamera(width, height);
        const renderer = createRenderer(width, height);
        
        const robot = createUniversalRobot();
        const factoryFloor = createFactoryFloor();
        
        scene.add(robot);
        scene.add(factoryFloor);
        
        // Adjust robot position and scale
        robot.position.set(0, 0, 0); 
        robot.scale.set(0.8, 0.8, 0.8); // Scale down the robot to fit better in view
        
        // Position the factory floor slightly lower to make sure robot is fully visible
        factoryFloor.position.y = -0.5;
        
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
        mainLight.position.set(5, 5, 5);
        mainLight.castShadow = true;
        scene.add(mainLight);
        
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.7);
        fillLight.position.set(-5, 3, -5);
        scene.add(fillLight);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;
        robotRef.current = robot;
        factoryFloorRef.current = factoryFloor;
        
        containerRef.current.appendChild(renderer.domElement);
        
        const animate = (time: number) => {
          if (!mountedRef.current || !sceneRef.current || !cameraRef.current || !rendererRef.current || !robotRef.current) return;
          
          animateUniversalRobot(robotRef.current, time * 0.001);
          rendererRef.current.render(sceneRef.current, cameraRef.current);
          frameIdRef.current = requestAnimationFrame(animate);
        };
        
        frameIdRef.current = requestAnimationFrame(animate);
        
        if (mouseMove && mountedRef.current) {
          window.addEventListener('mousemove', handleMouseMove);
        }
        
        if (scrollAnimation && mountedRef.current) {
          window.addEventListener('scroll', handleScroll);
        }
        
        if (mountedRef.current) {
          window.addEventListener('resize', handleResize);
          setSceneReady(true);
        }
      } catch (error) {
        console.error('Error initializing Three.js scene:', error);
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(initScene, 0);
    
    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      // Clean up references
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      robotRef.current = null;
      factoryFloorRef.current = null;
    };
  }, [containerRef, mouseMove, scrollAnimation, handleMouseMove, handleScroll, handleResize]);

  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    roboticArm: robotRef.current,
    factoryFloor: factoryFloorRef.current,
    sceneReady
  };
};