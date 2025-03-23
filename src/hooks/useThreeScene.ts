import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { 
  createScene, 
  createCamera, 
  createRenderer,
  createRoboticArm,
  createFactoryFloor,
  animateRoboticArm
} from '../lib/utils/threeUtils';

// Updated interface to accept the React.RefObject<HTMLDivElement | null>
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
  const roboticArmRef = useRef<THREE.Group | null>(null);
  const factoryFloorRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number | null>(null);
  
  // State to hold scene objects for external access
  const [sceneReady, setSceneReady] = useState(false);
  
  // Handle mouse movement effect
  const handleMouseMove = (event: MouseEvent) => {
    if (!cameraRef.current || !roboticArmRef.current || !containerRef.current) return;
    
    // Calculate mouse position relative to container
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / containerRef.current.offsetWidth) * 2 - 1;
    const y = -((event.clientY - rect.top) / containerRef.current.offsetHeight) * 2 + 1;
    
    // Subtly move the camera based on mouse position
    gsap.to(cameraRef.current.position, {
      x: x * 0.5,
      y: y * 0.2,
      duration: 1,
      ease: 'power2.out'
    });
    
    // Slightly rotate the robotic arm based on mouse position
    if (roboticArmRef.current) {
      gsap.to(roboticArmRef.current.rotation, {
        y: x * 0.2,
        duration: 1,
        ease: 'power2.out'
      });
    }
  };
  
  // Handle scroll effect
  const handleScroll = () => {
    if (!roboticArmRef.current || !factoryFloorRef.current) return;
    
    // Calculate scroll progress (0 to 1)
    const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    
    // Apply lighting changes based on scroll position
    if (sceneRef.current) {
      // Adjust lighting intensity based on scroll
      sceneRef.current.children.forEach(child => {
        if (child instanceof THREE.Light) {
          gsap.to(child, {
            intensity: 1 + scrollProgress * 2,
            duration: 0.5
          });
        }
      });
    }
    
    // Rotate factory floor based on scroll
    gsap.to(factoryFloorRef.current.rotation, {
      x: scrollProgress * 0.2,
      duration: 0.5
    });
  };
  
  // Initialize the scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Get container dimensions
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // Create scene, camera, and renderer
    const scene = createScene();
    const camera = createCamera(width, height);
    const renderer = createRenderer(width, height);
    
    // Create objects
    const roboticArm = createRoboticArm();
    const factoryFloor = createFactoryFloor();
    
    // Add objects to scene
    scene.add(roboticArm);
    scene.add(factoryFloor);
    
    // Store refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    roboticArmRef.current = roboticArm;
    factoryFloorRef.current = factoryFloor;
    
    // Add renderer to DOM
    containerRef.current.appendChild(renderer.domElement);
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      // Update camera
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      
      // Update renderer
      rendererRef.current.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };
    
    // Animation loop
    const animate = (time: number) => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !roboticArmRef.current) return;
      
      // Animate the robotic arm
      animateRoboticArm(roboticArmRef.current, time * 0.001);
      
      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Continue animation loop
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation loop
    frameIdRef.current = requestAnimationFrame(animate);
    
    // Add event listeners
    if (mouseMove) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    if (scrollAnimation) {
      window.addEventListener('scroll', handleScroll);
    }
    
    window.addEventListener('resize', handleResize);
    
    // Mark scene as ready
    setSceneReady(true);
    
    // Cleanup
    return () => {
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
  }, [containerRef, mouseMove, scrollAnimation]);
  
  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    roboticArm: roboticArmRef.current,
    factoryFloor: factoryFloorRef.current,
    sceneReady
  };
};