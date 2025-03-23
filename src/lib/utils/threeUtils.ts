import * as THREE from 'three';
import { gsap } from 'gsap';

// Helper function to set up a basic Three.js scene
export const createScene = () => {
  const scene = new THREE.Scene();
  
  // Increase ambient light intensity
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  
  // Adjust main directional light
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
  mainLight.position.set(5, 8, 5);
  mainLight.castShadow = true;
  scene.add(mainLight);
  
  // Add fill light from opposite side with increased intensity
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
  fillLight.position.set(-5, 3, -5);
  scene.add(fillLight);
  
  return scene;
};

// Helper function to set up a basic camera
export const createCamera = (width: number, height: number) => {
  const camera = new THREE.PerspectiveCamera(
    60, // Reduced FOV for better perspective
    width / height, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
  );
  
  // Position the camera more centrally
  camera.position.set(0, 2, 8);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  
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
    arm.children[2].rotation.x = Math.sin(time * 0.3) * 0.1 - 0.4;
  }
  
  // Move the gripper
  if (arm.children[3]) {
    arm.children[3].position.y = 8 + Math.sin(time) * 0.1;
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

// Function to create a 6-axis Universal Robot model with improved geometry
export function createUniversalRobot() {
  const robotGroup = new THREE.Group();
  
  // Base geometry
  const baseGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.5, 32);
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x4287f5 });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  robotGroup.add(base);

  // Create robot arm segments
  const segments = createRobotSegments();
  robotGroup.add(segments);

  // Initialize robot userData for animations
  robotGroup.userData = {
    joint1Group: segments.children[0],
    joint2Group: segments.children[0].children[0],
    joint3Group: segments.children[0].children[0].children[0],
    jointAngles: {
      joint1: 0,
      joint2: 0,
      joint3: 0
    }
  };

  return robotGroup;
}

function createRobotSegments() {
  const segmentsGroup = new THREE.Group();
  
  // Create arm segments with joints
  const armMaterial = new THREE.MeshStandardMaterial({ color: 0x4287f5 });
  
  // Add segments and connect them hierarchically with explicit rotation initialization
  const segment1 = createArmSegment(0.4, 0.2, 1, armMaterial);
  segment1.position.y = 0.5;
  segment1.rotation.set(0, 0, 0); // Initialize rotation

  const segment2 = createArmSegment(0.3, 0.15, 0.8, armMaterial);
  segment2.position.y = 1;
  segment2.rotation.set(0, 0, 0); // Initialize rotation
  
  const segment3 = createArmSegment(0.2, 0.1, 0.6, armMaterial);
  segment3.position.y = 0.8;
  segment3.rotation.set(0, 0, 0); // Initialize rotation
  
  // Add segments to group
  segmentsGroup.add(segment1);
  segment1.add(segment2);
  segment2.add(segment3);
  
  // Initialize group rotation
  segmentsGroup.rotation.set(0, 0, 0);
  
  return segmentsGroup;
}

// Helper function to create a single arm segment
function createArmSegment(radius: number, jointRadius: number, height: number, material: THREE.Material) {
  const group = new THREE.Group();
  
  const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, 32),
    material
  );
  cylinder.position.y = height / 2;
  
  const joint = new THREE.Mesh(
    new THREE.SphereGeometry(jointRadius, 32, 32),
    material
  );
  
  group.add(cylinder);
  group.add(joint);
  
  return group;
}

// Simple inverse kinematics solver for the 6-axis robot
const solveIK = (robot: THREE.Group, targetPosition: THREE.Vector3, targetRotation: THREE.Euler) => {
  if (!robot?.userData) return;
  
  const {
    joint1Group,
    joint2Group,
    joint3Group,
    joint4Group,
    joint5Group,
    joint6Group,
    jointAngles
  } = robot.userData;

  // Early return if required joints are missing
  if (!joint1Group || !joint2Group || !joint3Group) return;
  
  // Convert target position to robot's local space
  const localTarget = targetPosition.clone();
  robot.updateWorldMatrix(true, false);
  const worldInverse = new THREE.Matrix4().copy(robot.matrixWorld).invert();
  localTarget.applyMatrix4(worldInverse);
  
  // Base rotation (joint 1) - rotate to face target
  jointAngles.joint1 = Math.atan2(localTarget.x, localTarget.z);
  if (joint1Group.rotation) {
    joint1Group.rotation.y = jointAngles.joint1;
  }
  
  // Get distance to target (in xz plane)
  const distance = Math.sqrt(
    Math.pow(localTarget.x, 2) + 
    Math.pow(localTarget.z, 2)
  );
  
  // Calculate the height difference
  const heightDiff = localTarget.y - (joint2Group.position?.y || 0);
  
  // Use geometry to determine shoulder and elbow angles
  const upperArmLength = 2.4;
  const forearmLength = 2.2;
  
  const upperArmSq = Math.pow(upperArmLength, 2);
  const forearmSq = Math.pow(forearmLength, 2);
  const distanceSq = Math.pow(distance, 2) + Math.pow(heightDiff, 2);
  
  // Calculate elbow angle
  const elbowAngle = Math.PI - Math.acos(
    Math.min(1, Math.max(-1, (upperArmSq + forearmSq - distanceSq) / (2 * upperArmLength * forearmLength)))
  );
  
  // Calculate shoulder angle
  const shoulderAngle = Math.atan2(heightDiff, distance) + 
    Math.atan2(
      forearmLength * Math.sin(elbowAngle),
      upperArmLength + forearmLength * Math.cos(elbowAngle)
    );
  
  // Apply calculated angles
  jointAngles.joint2 = shoulderAngle;
  jointAngles.joint3 = elbowAngle;
  
  if (joint2Group.rotation) {
    joint2Group.rotation.z = shoulderAngle;
  }
  
  if (joint3Group.rotation) {
    joint3Group.rotation.z = elbowAngle - Math.PI/2; // Adjust by 90° due to initial orientation
  }
  
  // Apply wrist rotations if available
  if (targetRotation && joint4Group?.rotation && joint5Group?.rotation && joint6Group?.rotation) {
    jointAngles.joint4 = targetRotation.z;
    jointAngles.joint5 = targetRotation.y;
    jointAngles.joint6 = targetRotation.x;
    
    joint4Group.rotation.z = targetRotation.z;
    joint5Group.rotation.y = targetRotation.y;
    joint6Group.rotation.x = targetRotation.x;
  }
};

// Function to animate the 6-axis Universal Robot with inverse kinematics
export const animateUniversalRobot = (robot: THREE.Group, time: number) => {
  if (!robot?.userData?.joint1Group) return;
  
  try {
    // Define target positions for a pick-and-place routine
    const cycle = Math.floor(time * 0.25) % 4;
    const cycleTime = (time * 0.25) % 1;
    const smoothCycleTime = smoothStep(cycleTime);
    
    let targetX = 0, targetY = 0, targetZ = 0;
    let grip = false;
    
    // Pick and place motion sequence
    switch(cycle) {
      case 0:
        targetX = 2 + Math.sin(time * 0.1) * 0.3;
        targetY = -1 - smoothCycleTime * 1.5;
        targetZ = 1 + Math.cos(time * 0.1) * 0.3;
        grip = false;
        break;
      case 1:
        targetX = 2 + Math.sin(time * 0.1) * 0.3;
        targetY = -2.5 + smoothCycleTime * 2;
        targetZ = 1 + Math.cos(time * 0.1) * 0.3;
        grip = true;
        break;
      case 2:
        targetX = 2 + Math.sin(time * 0.1) * 0.3 - smoothCycleTime * 2;
        targetY = -0.5;
        targetZ = 1 + Math.cos(time * 0.1) * 0.3 - smoothCycleTime * 1;
        grip = true;
        break;
      case 3:
        targetX = 0 + Math.sin(time * 0.1) * 0.3;
        targetY = -0.5 - smoothCycleTime * 0.5;
        targetZ = 0 + Math.cos(time * 0.1) * 0.3;
        grip = cycleTime < 0.3;
        break;
    }
    
    // Apply IK to move robot to target position
    const targetPosition = new THREE.Vector3(targetX, targetY, targetZ);
    
    // Calculate orientation for the end effector with smaller rotation ranges
    const targetRotation = new THREE.Euler(
      0,
      Math.sin(time * 0.3) * 0.1, // Reduced from 0.2
      Math.sin(time * 0.5) * 0.15  // Reduced from 0.3
    );
    
    // Solve IK to position the robot
    solveIK(robot, targetPosition, targetRotation);
    
    // Animate gripper fingers if they exist
    if (robot.userData.leftFingers?.length && robot.userData.rightFingers?.length) {
      const gripperWidth = grip ? 0.08 : 0.15;
      
      robot.userData.leftFingers.forEach((finger: THREE.Mesh) => {
        if (finger?.position) {
          gsap.to(finger.position, {
            x: -gripperWidth,
            duration: 0.2,
            overwrite: true
          });
        }
      });
      
      robot.userData.rightFingers.forEach((finger: THREE.Mesh) => {
        if (finger?.position) {
          gsap.to(finger.position, {
            x: gripperWidth,
            duration: 0.2,
            overwrite: true
          });
        }
      });
    }
  } catch (error) {
    console.error('Error in animateUniversalRobot:', error);
  }
};

// Utility function for smooth transitions
function smoothStep(x: number): number {
  // Smoother interpolation than linear
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

// Function to create an animated conveyor belt with improved materials
export const createConveyorBelt = () => {
  const conveyorGroup = new THREE.Group();

  // Conveyor belt material with industrial look
  const beltMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.8,
    metalness: 0.2
  });

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x666666,
    roughness: 0.4,
    metalness: 0.8
  });

  // Main belt
  const beltGeometry = new THREE.BoxGeometry(2, 0.1, 6);
  const belt = new THREE.Mesh(beltGeometry, beltMaterial);
  belt.position.y = 0.5;
  conveyorGroup.add(belt);

  // Support frames
  const frameGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
  
  // Add legs at each corner
  const positions = [
    [-0.8, 0, -2.8],
    [0.8, 0, -2.8],
    [-0.8, 0, 2.8],
    [0.8, 0, 2.8]
  ];

  positions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(frameGeometry, frameMaterial);
    leg.position.set(x, y, z);
    conveyorGroup.add(leg);
  });

  // Add rollers for detail
  const rollerGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.8, 16);
  for (let z = -2.5; z <= 2.5; z += 0.5) {
    const roller = new THREE.Mesh(rollerGeometry, frameMaterial);
    roller.rotation.x = Math.PI / 2;
    roller.position.set(0, 0.6, z);
    conveyorGroup.add(roller);
  }

  return conveyorGroup;
}