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
  
  const [sceneReady, setSceneReady] = useState(false);
  
  const handleResize = useCallback(() => {
    if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
    
    cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
    cameraRef.current.updateProjectionMatrix();
    
    rendererRef.current.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
  }, []);

  const handleMouseMove = (event: MouseEvent) => {
    if (!cameraRef.current || !robotRef.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / containerRef.current.offsetWidth) * 2 - 1;
    const y = -((event.clientY - rect.top) / containerRef.current.offsetHeight) * 2 + 1;
    
    gsap.to(cameraRef.current.position, {
      x: x * 0.5,
      y: y * 0.2,
      duration: 1,
      ease: 'power2.out'
    });
  };

  const handleScroll = () => {
    if (!robotRef.current || !factoryFloorRef.current || !cameraRef.current) return;
    
    const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    
    gsap.to(cameraRef.current.position, {
      y: 4 + scrollProgress * 2,
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
    
    gsap.to(factoryFloorRef.current.rotation, {
      x: scrollProgress * 0.1,
      duration: 0.5
    });
  };
  
  useEffect(() => {
    // Ensure we're in the browser environment
    if (typeof window === 'undefined' || !containerRef.current) return;
    
    let mounted = true;
    
    const initScene = () => {
      if (!containerRef.current || !mounted) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      const scene = createScene();
      const camera = createCamera(width, height);
      const renderer = createRenderer(width, height);
      
      const robot = createUniversalRobot();
      const factoryFloor = createFactoryFloor();
      
      scene.add(robot);
      scene.add(factoryFloor);
      
      camera.position.set(8, 4, 8);
      camera.lookAt(new THREE.Vector3(3, 0, 0));
      
      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;
      robotRef.current = robot;
      factoryFloorRef.current = factoryFloor;
      
      containerRef.current.appendChild(renderer.domElement);
      
      const animate = (time: number) => {
        if (!mounted || !sceneRef.current || !cameraRef.current || !rendererRef.current || !robotRef.current) return;
        
        animateUniversalRobot(robotRef.current, time * 0.001);
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        frameIdRef.current = requestAnimationFrame(animate);
      };
      
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (mouseMove) {
        window.addEventListener('mousemove', handleMouseMove);
      }
      
      if (scrollAnimation) {
        window.addEventListener('scroll', handleScroll);
      }
      
      window.addEventListener('resize', handleResize);
      
      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);
      
      const ambientLight = new THREE.AmbientLight(0x404040, 2);
      scene.add(ambientLight);
      
      if (mounted) {
        setSceneReady(true);
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(initScene, 0);
    
    return () => {
      mounted = false;
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (mouseMove) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      
      if (scrollAnimation) {
        window.removeEventListener('scroll', handleScroll);
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef, mouseMove, scrollAnimation, handleResize]);
  
  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    roboticArm: robotRef.current,
    factoryFloor: factoryFloorRef.current,
    sceneReady
  };
};