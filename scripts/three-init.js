// Three.js initialization for 3D elements - Redesigned
let scene, camera, renderer;
let particles, geometry, materials = [];
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let clock = new THREE.Clock();
let mouseSpeed = 0.3;

// Initialize the 3D background
function init3DBackground() {
  // Set up scene
  scene = new THREE.Scene();
  
  // Set up camera with wider field of view
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 800;
  
  // Create geometry for particles
  geometry = new THREE.BufferGeometry();
  const vertices = [];
  const sizes = [];
  const colors = [];
  const color1 = new THREE.Color(0xff00f7); // Pink/purple
  const color2 = new THREE.Color(0x00ffea); // Cyan
  
  // Create more particles with different colors
  const particleCount = 2000;
  for (let i = 0; i < particleCount; i++) {
    // Create particles in a spherical distribution
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const radius = Math.random() * 800 + 200;
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    vertices.push(x, y, z);
    
    // Random size for each particle
    sizes.push(Math.random() * 5 + 2);
    
    // Create color gradient between the two colors
    const mixedColor = new THREE.Color();
    mixedColor.lerpColors(color1, color2, Math.random());
    colors.push(mixedColor.r, mixedColor.g, mixedColor.b);
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
  // Create shader material for particles
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: { value: new THREE.TextureLoader().load('https://assets.codepen.io/3685267/spark1.png') },
      time: { value: 0 }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      uniform float time;
      
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      
      void main() {
        gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
      }
    `,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    vertexColors: true
  });
  
  particles = new THREE.Points(geometry, particleMaterial);
  scene.add(particles);
  
  // Set up renderer with antialiasing
  renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true 
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  
  // Add renderer to the background-animation div
  const container = document.querySelector('.background-animation');
  if (container) {
    container.appendChild(renderer.domElement);
  }
  
  // Add event listeners for mouse movement
  document.addEventListener('mousemove', onDocumentMouseMove);
  window.addEventListener('resize', onWindowResize);
  
  // Start animation loop
  animate();
}

// Update camera position based on mouse movement
function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) * mouseSpeed;
  mouseY = (event.clientY - windowHalfY) * mouseSpeed;
}

// Handle window resize
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  render();
}

// Render scene
function render() {
  const time = clock.getElapsedTime();
  
  // Gently rotate the entire particle system
  particles.rotation.y = time * 0.05;
  
  // Make particles move in a wave pattern
  const positions = particles.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    
    // Add subtle wave motion
    positions[i] = x + Math.sin(time + x * 0.005) * 0.3;
    positions[i + 1] = y + Math.sin(time + y * 0.005) * 0.3;
  }
  particles.geometry.attributes.position.needsUpdate = true;
  
  // Update the time uniform for shader animations
  if (particles.material.uniforms) {
    particles.material.uniforms.time.value = time;
  }
  
  // Smooth camera movement following mouse position
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);
  
  renderer.render(scene, camera);
}

// Initialize 3D Cube for skills section
function initSkillCube() {
  const container = document.querySelector('.skill-cube-container');
  if (!container) return;
  
  // Create scene, camera, renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;
  
  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true 
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  
  // Create cube with holographic effect
  const cubeSize = 2;
  const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  
  // Create materials for each face with skill labels
  const skills = [
    'Web Dev',
    'Data Analysis',
    'Cybersecurity',
    'UI/UX',
    'JavaScript',
    'Python'
  ];
  
  const materials = skills.map(skill => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Fill with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, 'rgba(15, 3, 24, 0.8)');
    gradient.addColorStop(1, 'rgba(26, 11, 46, 0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    // Add grid lines
    ctx.strokeStyle = 'rgba(255, 0, 247, 0.3)';
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let i = 0; i < 10; i++) {
      ctx. beginPath();
      ctx.moveTo(0, i * (512 / 10));
      ctx.lineTo(512, i * (512 / 10));
      ctx.stroke();
    }
    
    // Vertical lines
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i * (512 / 10), 0);
      ctx.lineTo(i * (512 / 10), 512);
      ctx.stroke();
    }
    
    // Add glowing border
    ctx.strokeStyle = 'rgba(0, 255, 234, 0.8)';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 492, 492);
    
    // Add skill text
    ctx.font = 'bold 60px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Create gradient for text
    const textGradient = ctx.createLinearGradient(100, 100, 412, 412);
    textGradient.addColorStop(0, '#ff00f7');
    textGradient.addColorStop(1, '#00ffea');
    ctx.fillStyle = textGradient;
    
    ctx.fillText(skill, 256, 256);
    
    // Create Three.js texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    
    return new THREE.MeshBasicMaterial({ 
      map: texture,
      transparent: true,
      opacity: 0.9
    });
  });
  
  // Create cube with materials
  const cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Add point lights for glow effect
  const pointLight1 = new THREE.PointLight(0xff00f7, 1, 10);
  pointLight1.position.set(3, 3, 3);
  scene.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(0x00ffea, 1, 10);
  pointLight2.position.set(-3, -3, -3);
  scene.add(pointLight2);
  
  // Add mouse interaction
  let isDragging = false;
  let previousMousePosition = {
    x: 0,
    y: 0
  };
  
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
  });
  
  container.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  container.addEventListener('mouseleave', () => {
    isDragging = false;
  });
  
  container.addEventListener('mousemove', (e) => {
    const deltaMove = {
      x: e.offsetX - previousMousePosition.x,
      y: e.offsetY - previousMousePosition.y
    };
    
    if (isDragging) {
      // Rotate cube based on mouse movement
      cube.rotation.y += deltaMove.x * 0.01;
      cube.rotation.x += deltaMove.y * 0.01;
    }
    
    previousMousePosition = {
      x: e.offsetX,
      y: e.offsetY
    };
  });
  
  // Animation function
  function animate() {
    requestAnimationFrame(animate);
    
    // Auto-rotate when not dragging
    if (!isDragging) {
      cube.rotation.y += 0.005;
      cube.rotation.x += 0.002;
    }
    
    // Pulsate point lights
    const time = Date.now() * 0.001;
    pointLight1.intensity = 1 + 0.5 * Math.sin(time);
    pointLight2.intensity = 1 + 0.5 * Math.cos(time);
    
    renderer.render(scene, camera);
  }
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
  
  // Start animation
  animate();
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for splash screen to finish
  setTimeout(() => {
    const backgroundAnimation = document.querySelector('.background-animation');
    if (backgroundAnimation) {
      init3DBackground();
    }
    
    const skillCubeContainer = document.querySelector('.skill-cube-container');
    if (skillCubeContainer) {
      initSkillCube();
    }
  }, 5100); // Just after splash screen finishes
});