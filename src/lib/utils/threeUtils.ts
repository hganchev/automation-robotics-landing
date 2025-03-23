import * as THREE from 'three';

// Helper function to set up a basic Three.js scene
export const createScene = () => {
  const scene = new THREE.Scene();
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);
  
  return scene;
};

// Helper function to set up a basic camera
export const createCamera = (width: number, height: number) => {
  const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    width / height, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
  );
  
  // Position the camera
  camera.position.z = 5;
  
  return camera;
};

// Helper function to set up a WebGL renderer
export const createRenderer = (width: number, height: number) => {
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true // Transparent background
  });
  
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  return renderer;
};

// Function to create a robotic arm model (simplified for now)
export const createRoboticArm = () => {
  const group = new THREE.Group();
  
  // Base
  const baseGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);
  const baseMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x0a84ff,
    metalness: 0.7,
    roughness: 0.2
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  group.add(base);
  
  // Lower arm segment
  const lowerArmGeometry = new THREE.BoxGeometry(0.5, 2, 0.5);
  const lowerArmMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    metalness: 0.8,
    roughness: 0.2
  });
  const lowerArm = new THREE.Mesh(lowerArmGeometry, lowerArmMaterial);
  lowerArm.position.y = 1.5;
  group.add(lowerArm);
  
  // Upper arm segment
  const upperArmGeometry = new THREE.BoxGeometry(0.4, 1.8, 0.4);
  const upperArm = new THREE.Mesh(upperArmGeometry, lowerArmMaterial);
  upperArm.position.y = 3;
  group.add(upperArm);
  
  // Gripper
  const gripperGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  const gripperMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff3b30,
    metalness: 0.8,
    roughness: 0.2
  });
  const gripper = new THREE.Mesh(gripperGeometry, gripperMaterial);
  gripper.position.y = 4;
  group.add(gripper);
  
  // Position the entire arm
  group.position.y = -1;
  
  return group;
};

// Function to create a factory floor
export const createFactoryFloor = () => {
  // Create a grid for the factory floor
  const gridHelper = new THREE.GridHelper(20, 20, 0xaaaaaa, 0x444444);
  gridHelper.position.y = -2;
  
  // Create a floor plane
  const planeGeometry = new THREE.PlaneGeometry(20, 20);
  const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x222222,
    metalness: 0.2,
    roughness: 0.8,
    side: THREE.DoubleSide
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = Math.PI / 2;
  plane.position.y = -2;
  
  const floor = new THREE.Group();
  floor.add(gridHelper);
  floor.add(plane);
  
  return floor;
};

// Function to create an animated conveyor belt
export const createConveyorBelt = () => {
  const group = new THREE.Group();
  
  // Belt base
  const baseGeometry = new THREE.BoxGeometry(6, 0.2, 1.5);
  const baseMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x555555,
    metalness: 0.6,
    roughness: 0.4
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  group.add(base);
  
  // Belt surface (this will be animated)
  const beltGeometry = new THREE.BoxGeometry(6, 0.05, 1.2);
  const beltMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x222222,
    metalness: 0.1,
    roughness: 0.9
  });
  const belt = new THREE.Mesh(beltGeometry, beltMaterial);
  belt.position.y = 0.125;
  group.add(belt);
  
  // Rollers at each end
  const rollerGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
  const rollerMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x888888,
    metalness: 0.8,
    roughness: 0.3
  });
  
  const roller1 = new THREE.Mesh(rollerGeometry, rollerMaterial);
  roller1.position.set(3, 0.2, 0);
  roller1.rotation.z = Math.PI / 2;
  group.add(roller1);
  
  const roller2 = new THREE.Mesh(rollerGeometry, rollerMaterial);
  roller2.position.set(-3, 0.2, 0);
  roller2.rotation.z = Math.PI / 2;
  group.add(roller2);
  
  // Position the conveyor
  group.position.y = -1;
  
  return group;
};

// Function to animate the robotic arm
export const animateRoboticArm = (arm: THREE.Group, time: number) => {
  // Rotate the base slightly
  if (arm.children[0]) {
    arm.children[0].rotation.y = Math.sin(time * 0.5) * 0.2;
  }
  
  // Move the lower arm
  if (arm.children[1]) {
    arm.children[1].rotation.x = Math.sin(time * 0.4) * 0.15;
  }
  
  // Move the upper arm and gripper
  if (arm.children[2]) {
    arm.children[2].rotation.x = Math.sin(time * 0.3) * 0.1 - 0.2;
  }
  
  // Move the gripper
  if (arm.children[3]) {
    arm.children[3].position.y = 4 + Math.sin(time) * 0.1;
  }
};

// Helper function for the scroll shader effect
export const createScrollShader = () => {
  // Create a shader material that will change based on scroll position
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      scrollPosition: { value: 0 },
      colorA: { value: new THREE.Color('#0a84ff') },
      colorB: { value: new THREE.Color('#30d158') }
    },
    vertexShader: `
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float scrollPosition;
      uniform vec3 colorA;
      uniform vec3 colorB;
      varying vec2 vUv;
      
      void main() {
        vec3 finalColor = mix(colorA, colorB, scrollPosition);
        
        // Add some time-based variation
        float pulse = sin(time * 2.0) * 0.5 + 0.5;
        finalColor += pulse * 0.1;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  });
  
  return shaderMaterial;
};