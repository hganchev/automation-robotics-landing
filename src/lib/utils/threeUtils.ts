import * as THREE from 'three';

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
    50, // Wider FOV for better robot visibility
    width / height,
    0.1,
    1000
  );
  
  // Position the camera at an angle to better see the robot segments
  camera.position.set(0, 3, 15);
  camera.lookAt(new THREE.Vector3(0, 1, 0));
  
  return camera;
};

// Helper function to set up a WebGL renderer
export const createRenderer = (width: number, height: number) => {
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true
  });
  
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  
  return renderer;
};

// Create a new implementation of the robotic arm
export const createRoboticArm = () => {
  const robotGroup = new THREE.Group();

  // Create materials with better visibility
  const mainMaterial = new THREE.MeshStandardMaterial({
    color: 0x2196f3,
    metalness: 0.7,
    roughness: 0.3,
    emissive: 0x144b7a,
    emissiveIntensity: 0.2
  });

  const jointMaterial = new THREE.MeshStandardMaterial({
    color: 0xff4444,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x992222,
    emissiveIntensity: 0.3
  });

  // Base
  const baseGeometry = new THREE.CylinderGeometry(1.2, 1.5, 0.8, 32);
  const base = new THREE.Mesh(baseGeometry, mainMaterial);
  base.castShadow = true;
  base.receiveShadow = true;
  robotGroup.add(base);

  // Rotating platform on top of base
  const platformGeometry = new THREE.CylinderGeometry(1, 1.2, 0.4, 32);
  const platform = new THREE.Mesh(platformGeometry, mainMaterial);
  platform.position.y = 0.6;
  platform.castShadow = true;
  platform.receiveShadow = true;
  base.add(platform);

  // First joint (shoulder) - smaller size
  const shoulderJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 32, 32),
    jointMaterial
  );
  shoulderJoint.position.y = 0.4;
  shoulderJoint.castShadow = true;
  platform.add(shoulderJoint);

  // Upper arm - now cylindrical
  const upperArmGeometry = new THREE.CylinderGeometry(0.25, 0.25, 2.5, 32);
  const upperArm = new THREE.Mesh(upperArmGeometry, mainMaterial);
  upperArm.position.y = 1.25;
  upperArm.castShadow = true;
  shoulderJoint.add(upperArm);

  // Elbow joint - smaller size
  const elbowJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 32),
    jointMaterial
  );
  elbowJoint.position.y = 1.25;
  elbowJoint.castShadow = true;
  upperArm.add(elbowJoint);

  // Forearm - now cylindrical
  const forearmGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 32);
  const forearm = new THREE.Mesh(forearmGeometry, mainMaterial);
  forearm.position.y = 1;
  forearm.castShadow = true;
  elbowJoint.add(forearm);

  // Wrist joint - smaller size
  const wristJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 32, 32),
    jointMaterial
  );
  wristJoint.position.y = 1;
  wristJoint.castShadow = true;
  forearm.add(wristJoint);

  // End effector (gripper)
  const gripperGroup = new THREE.Group();
  wristJoint.add(gripperGroup);

  // Gripper base - make it wider and more substantial
  const gripperBaseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32);
  const gripperBase = new THREE.Mesh(gripperBaseGeometry, mainMaterial);
  gripperBase.position.y = 0.2;
  gripperBase.castShadow = true;
  gripperGroup.add(gripperBase);

  // Create more substantial gripper fingers
  const fingerGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.3); // Wider, shorter fingers
  const fingerMaterial = new THREE.MeshStandardMaterial({
    color: 0x666666,
    metalness: 0.8,
    roughness: 0.2
  });

  // Left finger with proper pivot point
  const leftFingerGroup = new THREE.Group();
  const leftFinger = new THREE.Mesh(fingerGeometry, fingerMaterial);
  leftFinger.position.y = 0.2; // Move up to align with pivot
  leftFingerGroup.position.set(-0.2, 0.4, 0);
  leftFingerGroup.add(leftFinger);
  leftFinger.castShadow = true;
  gripperBase.add(leftFingerGroup);

  // Right finger with proper pivot point
  const rightFingerGroup = new THREE.Group();
  const rightFinger = new THREE.Mesh(fingerGeometry, fingerMaterial);
  rightFinger.position.y = 0.2; // Move up to align with pivot
  rightFingerGroup.position.set(0.2, 0.4, 0);
  rightFingerGroup.add(rightFinger);
  rightFinger.castShadow = true;
  gripperBase.add(rightFingerGroup);

  // Store references for animation
  robotGroup.userData = {
    platform,
    shoulderJoint,
    elbowJoint,
    wristJoint,
    leftFingerGroup,
    rightFingerGroup
  };

  // Initial position
  robotGroup.position.y = 0;
  
  return robotGroup;
};

// Function to animate the robotic arm
export const animateRoboticArm = (robot: THREE.Group, time: number) => {
  if (!robot?.userData) return;

  const {
    platform,
    shoulderJoint,
    elbowJoint,
    wristJoint,
    leftFingerGroup,
    rightFingerGroup
  } = robot.userData;

  // Define the pick and place cycle (4 seconds total)
  const cycleTime = (time % 4) / 4; // Normalize to 0-1 range
  
  // Define key positions and states
  if (cycleTime < 0.25) {
    // Moving to pickup position (down and forward)
    shoulderJoint.rotation.z = THREE.MathUtils.lerp(0, 0.5, cycleTime * 4);
    elbowJoint.rotation.z = THREE.MathUtils.lerp(0, -0.8, cycleTime * 4);
    wristJoint.rotation.z = THREE.MathUtils.lerp(0, 0.3, cycleTime * 4);
    
    // Open gripper
    leftFingerGroup.rotation.z = -0.5;
    rightFingerGroup.rotation.z = 0.5;
  } 
  else if (cycleTime < 0.5) {
    // Gripping (close fingers)
    const gripProgress = (cycleTime - 0.25) * 4;
    leftFingerGroup.rotation.z = THREE.MathUtils.lerp(-0.5, 0, gripProgress);
    rightFingerGroup.rotation.z = THREE.MathUtils.lerp(0.5, 0, gripProgress);
  }
  else if (cycleTime < 0.75) {
    // Moving to place position (up and right)
    const moveProgress = (cycleTime - 0.5) * 4;
    shoulderJoint.rotation.z = THREE.MathUtils.lerp(0.5, 0.3, moveProgress);
    elbowJoint.rotation.z = THREE.MathUtils.lerp(-0.8, -0.4, moveProgress);
    wristJoint.rotation.z = THREE.MathUtils.lerp(0.3, 0.1, moveProgress);
    platform.rotation.y = THREE.MathUtils.lerp(0, 0.7, moveProgress);
    
    // Keep gripper closed
    leftFingerGroup.rotation.z = 0;
    rightFingerGroup.rotation.z = 0;
  }
  else {
    // Release and return to center
    const returnProgress = (cycleTime - 0.75) * 4;
    shoulderJoint.rotation.z = THREE.MathUtils.lerp(0.3, 0, returnProgress);
    elbowJoint.rotation.z = THREE.MathUtils.lerp(-0.4, 0, returnProgress);
    wristJoint.rotation.z = THREE.MathUtils.lerp(0.1, 0, returnProgress);
    platform.rotation.y = THREE.MathUtils.lerp(0.7, 0, returnProgress);
    
    // Open gripper
    leftFingerGroup.rotation.z = THREE.MathUtils.lerp(0, -0.5, returnProgress);
    rightFingerGroup.rotation.z = THREE.MathUtils.lerp(0, 0.5, returnProgress);
  }

  // Add slight wobble to the entire robot
  robot.position.y = Math.sin(time * 0.8) * 0.05;
  robot.rotation.z = Math.sin(time * 0.3) * 0.02;
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
  
  // Create robot arm segments
  const segments = createRobotSegments();
  robotGroup.add(segments);
  segments.position.y = 0.4; // Adjust segments position relative to base
  
  // Initialize robot userData for animations - store all necessary joint references
  robotGroup.userData = {
    joint1Group: segments.children[0],
    joint2Group: segments.children[0]?.children[0],
    joint3Group: segments.children[0]?.children[0]?.children[0],
    joint4Group: segments.children[0]?.children[0]?.children[0]?.children[0],
    joint5Group: segments.children[0]?.children[0]?.children[0]?.children[0]?.children[0],
    joint6Group: segments.children[0]?.children[0]?.children[0]?.children[0]?.children[0]?.children[0],
    jointAngles: {
      joint1: 0,
      joint2: 0,
      joint3: 0,
      joint4: 0,
      joint5: 0,
      joint6: 0
    }
  };
  
  return robotGroup;
};

function createRobotSegments() {
  const segmentsGroup = new THREE.Group();
  
  // Create arm segments with joints - larger and more visible
  const armMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x4287f5,
    metalness: 0.7,
    roughness: 0.3,
    emissive: 0x1a4082,
    emissiveIntensity: 0.2
  });
  
  // Add segments and connect them hierarchically with explicit rotation initialization
  const segment1 = createArmSegment(0.8, 0.4, 2.0, armMaterial);
  segment1.position.y = 0.8;
  segment1.rotation.set(0, 0, 0);

  const segment2 = createArmSegment(0.6, 0.35, 1.8, armMaterial);
  segment2.position.y = 2.0;
  segment2.rotation.set(0, 0, 0);
  
  const segment3 = createArmSegment(0.5, 0.3, 1.5, armMaterial);
  segment3.position.y = 1.8;
  segment3.rotation.set(0, 0, 0);
  
  // Create end effector (gripper)
  const gripperMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff3b30,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x992012,
    emissiveIntensity: 0.3
  });
  
  const gripper = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.3, 0.6),
    gripperMaterial
  );
  gripper.position.y = 1.6;
  segment3.add(gripper);
  
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
    // Define target positions for a pick-and-place routine with larger movements
    const cycle = Math.floor(time * 0.15) % 4; // Slowed down the cycle
    const cycleTime = (time * 0.15) % 1;
    const smoothCycleTime = smoothStep(cycleTime);
    
    let targetX = 0, targetY = 0, targetZ = 0;
    
    // Pick and place motion sequence with increased range
    switch (cycle) {
      case 0:
        targetX = 3 * Math.sin(time * 0.1);
        targetY = 1 + Math.sin(time * 0.2) * 0.5;
        targetZ = 2 * Math.cos(time * 0.1);
        break;
      case 1:
        targetX = 3 * Math.sin(time * 0.1);
        targetY = 1 + smoothCycleTime * 2;
        targetZ = 2 * Math.cos(time * 0.1);
        break;
      case 2:
        targetX = 3 * Math.sin(time * 0.1) * (1 - smoothCycleTime);
        targetY = 3 - smoothCycleTime * 1.5;
        targetZ = 2 * Math.cos(time * 0.1) * (1 - smoothCycleTime);
        break;
      case 3:
        targetX = smoothCycleTime * 0.5;
        targetY = 1.5 - smoothCycleTime;
        targetZ = smoothCycleTime * 0.5;
        break;
    }
    
    // Calculate orientation for the end effector with more pronounced rotation
    const targetRotation = new THREE.Euler(
      Math.sin(time * 0.3) * 0.2,
      Math.sin(time * 0.4) * 0.3,
      Math.sin(time * 0.5) * 0.25
    );
    
    // Apply IK to position the robot
    solveIK(robot, new THREE.Vector3(targetX, targetY, targetZ), targetRotation);
    
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