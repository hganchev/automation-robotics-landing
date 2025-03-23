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
export const createUniversalRobot = () => {
  const robotGroup = new THREE.Group();
  
  // Colors and materials with improved metallic finish
  const primaryColor = new THREE.Color(0x0099cc);
  const jointColor = new THREE.Color(0x888888);
  const baseColor = new THREE.Color(0x333333);
  
  const primaryMaterial = new THREE.MeshStandardMaterial({
    color: primaryColor,
    metalness: 0.8,
    roughness: 0.1,
    envMapIntensity: 1.0
  });
  
  const jointMaterial = new THREE.MeshStandardMaterial({
    color: jointColor,
    metalness: 0.9,
    roughness: 0.05,
  });
  
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: baseColor,
    metalness: 0.8,
    roughness: 0.15
  });

  // Base with smoother geometry
  const baseGeometry = new THREE.CylinderGeometry(1.2, 1.4, 0.6, 32, 2, true);
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  robotGroup.add(base);
  
  // Smoother base plate
  const basePlateGeometry = new THREE.CylinderGeometry(1.0, 1.0, 0.15, 32, 2);
  const basePlate = new THREE.Mesh(basePlateGeometry, jointMaterial);
  basePlate.position.y = 0.375;
  base.add(basePlate);
  
  // === Joint 1 (Base Rotation) with improved geometry ===
  const joint1Group = new THREE.Group();
  joint1Group.position.y = 0.45;
  basePlate.add(joint1Group);
  
  const joint1Geometry = new THREE.CylinderGeometry(0.8, 0.8, 0.7, 32, 2);
  const joint1 = new THREE.Mesh(joint1Geometry, primaryMaterial);
  joint1Group.add(joint1);
  
  // === Shoulder Link ===
  const shoulderGroup = new THREE.Group();
  shoulderGroup.position.y = 0.45;
  joint1Group.add(shoulderGroup);
  
  // Shoulder housing
  const shoulderHousingGeometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
  const shoulderHousing = new THREE.Mesh(shoulderHousingGeometry, primaryMaterial);
  shoulderHousing.position.y = 0;
  shoulderGroup.add(shoulderHousing);
  
  // === Joint 2 (Shoulder) ===
  const joint2Group = new THREE.Group();
  joint2Group.position.y = 0;
  joint2Group.position.z = 0.45;
  shoulderGroup.add(joint2Group);
  
  // Joint 2 housing
  const joint2Geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32);
  const joint2 = new THREE.Mesh(joint2Geometry, jointMaterial);
  joint2.rotation.x = Math.PI / 2; // Rotate to align with Z axis
  joint2Group.add(joint2);
  
  // === Upper Arm ===
  const upperArmGroup = new THREE.Group();
  upperArmGroup.position.z = 0;
  joint2Group.add(upperArmGroup);
  
  // Improved upper arm geometry
  const upperArmGeometry = new THREE.BoxGeometry(0.6, 0.6, 2.4, 2, 2, 4);
  const upperArm = new THREE.Mesh(upperArmGeometry, primaryMaterial);
  upperArm.position.z = 1.2;
  upperArmGroup.add(upperArm);
  
  // === Joint 3 (Elbow) ===
  const joint3Group = new THREE.Group();
  joint3Group.position.z = 2.4;
  upperArmGroup.add(joint3Group);
  
  // Joint 3 housing
  const joint3Geometry = new THREE.CylinderGeometry(0.45, 0.45, 0.45, 32);
  const joint3 = new THREE.Mesh(joint3Geometry, jointMaterial);
  joint3.rotation.x = Math.PI / 2; // Rotate to align with Z axis
  joint3Group.add(joint3);
  
  // === Forearm ===
  const forearmGroup = new THREE.Group();
  forearmGroup.position.z = 0;
  joint3Group.add(forearmGroup);
  
  // Improved forearm geometry
  const forearmGeometry = new THREE.BoxGeometry(0.5, 0.5, 2.2, 2, 2, 4);
  const forearm = new THREE.Mesh(forearmGeometry, primaryMaterial);
  forearm.position.z = 1.1;
  forearmGroup.add(forearm);
  
  // === Joint 4 (Wrist 1 - Roll) ===
  const joint4Group = new THREE.Group();
  joint4Group.position.z = 2.2;
  forearmGroup.add(joint4Group);
  
  // Joint 4 housing
  const joint4Geometry = new THREE.CylinderGeometry(0.4, 0.4, 0.4, 32);
  const joint4 = new THREE.Mesh(joint4Geometry, jointMaterial);
  joint4.rotation.z = Math.PI / 2; // Align for roll rotation
  joint4Group.add(joint4);
  
  // === Wrist Housing ===
  const wristGroup = new THREE.Group();
  wristGroup.position.x = 0;
  joint4Group.add(wristGroup);
  
  // Wrist segment
  const wristGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.4);
  const wrist = new THREE.Mesh(wristGeometry, primaryMaterial);
  wrist.position.x = 0.4;
  wristGroup.add(wrist);
  
  // === Joint 5 (Wrist 2 - Pitch) ===
  const joint5Group = new THREE.Group();
  joint5Group.position.x = 0.8;
  wristGroup.add(joint5Group);
  
  // Joint 5 housing
  const joint5Geometry = new THREE.CylinderGeometry(0.35, 0.35, 0.35, 32);
  const joint5 = new THREE.Mesh(joint5Geometry, jointMaterial);
  joint5.rotation.y = Math.PI / 2; // Align for pitch rotation
  joint5Group.add(joint5);
  
  // === Wrist Flange ===
  const flangeGroup = new THREE.Group();
  flangeGroup.position.z = 0;
  joint5Group.add(flangeGroup);
  
  // Flange connector
  const flangeGeometry = new THREE.BoxGeometry(0.35, 0.35, 0.6);
  const flange = new THREE.Mesh(flangeGeometry, primaryMaterial);
  flange.position.z = 0.3;
  flangeGroup.add(flange);
  
  // === Joint 6 (Wrist 3 - Yaw) ===
  const joint6Group = new THREE.Group();
  joint6Group.position.z = 0.6;
  flangeGroup.add(joint6Group);
  
  // Joint 6 housing - end effector mount
  const joint6Geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.3, 32);
  const joint6 = new THREE.Mesh(joint6Geometry, jointMaterial);
  joint6Group.add(joint6);
  
  // === End Effector (Gripper) ===
  const gripperGroup = new THREE.Group();
  gripperGroup.position.y = 0.3;
  joint6Group.add(gripperGroup);
  
  // Gripper base
  const gripperBaseGeometry = new THREE.BoxGeometry(0.5, 0.25, 0.5);
  const gripperBase = new THREE.Mesh(gripperBaseGeometry, jointMaterial);
  gripperGroup.add(gripperBase);
  
  // Gripper fingers container - this will help with the opening/closing animation
  const fingersGroup = new THREE.Group();
  fingersGroup.position.y = 0.15;
  gripperGroup.add(fingersGroup);

  // Finger shapes
  const fingerGeometry = new THREE.BoxGeometry(0.08, 0.3, 0.15);
  const fingerMaterial = new THREE.MeshStandardMaterial({
    color: 0x666666,
    metalness: 0.9,
    roughness: 0.2
  });
  
  // Create finger pairs (2 pairs for 4 fingers total)
  const leftFinger1 = new THREE.Mesh(fingerGeometry, fingerMaterial);
  leftFinger1.position.set(-0.15, 0.15, -0.1);
  fingersGroup.add(leftFinger1);
  
  const rightFinger1 = new THREE.Mesh(fingerGeometry, fingerMaterial);
  rightFinger1.position.set(0.15, 0.15, -0.1);
  fingersGroup.add(rightFinger1);
  
  const leftFinger2 = new THREE.Mesh(fingerGeometry, fingerMaterial);
  leftFinger2.position.set(-0.15, 0.15, 0.1);
  fingersGroup.add(leftFinger2);
  
  const rightFinger2 = new THREE.Mesh(fingerGeometry, fingerMaterial);
  rightFinger2.position.set(0.15, 0.15, 0.1);
  fingersGroup.add(rightFinger2);
  
  // Store references to all joint groups for animation
  robotGroup.userData = {
    // Joint groups for rotation control
    joint1Group, // Base rotation
    joint2Group, // Shoulder
    joint3Group, // Elbow
    joint4Group, // Wrist roll
    joint5Group, // Wrist pitch
    joint6Group, // Wrist yaw
    
    // End effector
    gripperGroup,
    fingersGroup,
    leftFingers: [leftFinger1, leftFinger2],
    rightFingers: [rightFinger1, rightFinger2],
    
    // Store current target for IK
    ikTarget: new THREE.Vector3(0, 0, 0),
    isGripping: false,
    
    // Store current joint angles for IK calculation
    jointAngles: {
      joint1: 0,
      joint2: 0,
      joint3: 0,
      joint4: 0,
      joint5: 0,
      joint6: 0
    }
  };
  
  // Initial position and rotation
  robotGroup.position.y = -1.5;
  robotGroup.position.x = 0; // Changed from 3.5 to 0 to center the robot
  robotGroup.rotation.y = -Math.PI / 5;
  
  // Adjust initial posture to be more natural
  joint1Group.rotation.y = Math.PI / 6; // Slight rotation at base
  joint2Group.rotation.x = -Math.PI / 6; // Shoulder up slightly
  joint3Group.rotation.x = Math.PI / 3; // Elbow bent naturally
  joint4Group.rotation.z = Math.PI / 6; // Wrist roll
  joint5Group.rotation.x = -Math.PI / 6; // Wrist pitch
  joint6Group.rotation.z = -90; // Neutral end effector
  
  return robotGroup;
};

// Simple inverse kinematics solver for the 6-axis robot
const solveIK = (robot: THREE.Group, targetPosition: THREE.Vector3, targetRotation: THREE.Euler) => {
  if (!robot || !robot.userData) return;
  
  const {
    joint1Group,
    joint2Group,
    joint3Group,
    joint4Group,
    joint5Group,
    joint6Group,
    jointAngles
  } = robot.userData;
  
  // Convert target position to robot's local space
  const localTarget = targetPosition.clone();
  // Fix: Use updateWorldMatrix and create a proper world inverse matrix
  robot.updateWorldMatrix(true, false);
  const worldInverse = new THREE.Matrix4().copy(robot.matrixWorld).invert();
  localTarget.applyMatrix4(worldInverse);
  
  // Base rotation (joint 1) - rotate to face target
  jointAngles.joint1 = Math.atan2(localTarget.x, localTarget.z);
  joint1Group.rotation.y = jointAngles.joint1;
  
  // Get distance to target (in xz plane)
  const distance = Math.sqrt(
    Math.pow(localTarget.x, 2) + 
    Math.pow(localTarget.z, 2)
  );
  
  // Calculate the height difference
  const heightDiff = localTarget.y - joint2Group.position.y;
  
  // Use geometry to determine shoulder and elbow angles (simple 2-joint IK)
  // For the Universal Robot, we have these approximate lengths:
  const upperArmLength = 2.4; // Length of upper arm
  const forearmLength = 2.2;  // Length of forearm
  
  // Use law of cosines to compute joint angles
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
  
  // Apply the angles
  joint2Group.rotation.z = shoulderAngle;
  joint3Group.rotation.z = elbowAngle - Math.PI/2; // Adjust by 90° due to initial orientation
  
  // For simplicity, we'll just use the target rotation directly for the wrist joints
  if (targetRotation) {
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
  if (!robot || !robot.userData) return;
  
  const {
    joint1Group,
    joint2Group,
    joint3Group,
    joint4Group,
    joint5Group,
    joint6Group,
    gripperGroup,
    fingersGroup,
    leftFingers,
    rightFingers,
    ikTarget,
    isGripping
  } = robot.userData;
  
  // Define target positions for a pick-and-place routine
  const cycle = Math.floor(time * 0.25) % 4; // 0, 1, 2, 3
  const cycleTime = (time * 0.25) % 1; // 0-1 within each cycle
  const smoothCycleTime = smoothStep(cycleTime);
  
  let targetX, targetY, targetZ;
  let grip = false;
  
  // Pick and place motion sequence
  switch(cycle) {
    case 0: // Move to pick position
      targetX = 4 + Math.sin(time * 0.1) * 0.3;
      targetY = -1 - smoothCycleTime * 1.5;
      targetZ = 1 + Math.cos(time * 0.1) * 0.3;
      grip = false;
      break;
    case 1: // Grip and lift up
      targetX = 4 + Math.sin(time * 0.1) * 0.3;
      targetY = -2.5 + smoothCycleTime * 2;
      targetZ = 1 + Math.cos(time * 0.1) * 0.3;
      grip = true;
      break;
    case 2: // Move right to place position
      targetX = 4 + Math.sin(time * 0.1) * 0.3 - smoothCycleTime * 2;
      targetY = -0.5;
      targetZ = 1 + Math.cos(time * 0.1) * 0.3 - smoothCycleTime * 1;
      grip = true;
      break;
    case 3: // Release and move back up
      targetX = 2 + Math.sin(time * 0.1) * 0.3;
      targetY = -0.5 - smoothCycleTime * 0.5;
      targetZ = 0 + Math.cos(time * 0.1) * 0.3;
      grip = cycleTime < 0.3; // Release after the first 30% of this cycle
      break;
  }
  
  // Apply IK to move robot to target position
  const targetPosition = new THREE.Vector3(targetX, targetY, targetZ);
  
  // Calculate a reasonable orientation for the end effector based on position
  const targetRotation = new THREE.Euler(
    0,
    Math.sin(time * 0.3) * 0.2,
    Math.sin(time * 0.5) * 0.3
  );
  
  // Solve IK to position the robot
  solveIK(robot, targetPosition, targetRotation);
  
  // Animate gripper fingers
  const gripperWidth = grip ? 0.08 : 0.15;
  
  // Fix: Add proper type for the finger parameter
  if (Array.isArray(leftFingers)) {
    leftFingers.forEach((finger: THREE.Mesh) => {
      gsap.to(finger.position, {
        x: -gripperWidth,
        duration: 0.2,
        overwrite: true
      });
    });
  }
  
  if (Array.isArray(rightFingers)) {
    rightFingers.forEach((finger: THREE.Mesh) => {
      gsap.to(finger.position, {
        x: gripperWidth,
        duration: 0.2,
        overwrite: true
      });
    });
  }
  
  // Store current state
  robot.userData.isGripping = grip;
  robot.userData.ikTarget = targetPosition;
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