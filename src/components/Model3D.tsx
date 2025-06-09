import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Float, PresentationControls } from '@react-three/drei';

interface FloatingObjectProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
  shape: 'cube' | 'sphere' | 'torus' | 'cone' | 'octahedron';
  speed?: number;
  amplitude?: number;
}

const FloatingObject = ({ 
  position, 
  rotation = [0, 0, 0], 
  scale = 1, 
  color = '#39a2db', 
  shape,
  speed = 1,
  amplitude = 0.5
}: FloatingObjectProps) => {
  const ref = useRef<THREE.Mesh>(null!);
  const initialY = position[1];
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    if (ref.current) {
      // Add gentle floating motion
      ref.current.position.y = initialY + Math.sin(t) * amplitude * 0.1;
      ref.current.rotation.x = rotation[0] + Math.sin(t * 0.5) * 0.1;
      ref.current.rotation.y = rotation[1] + Math.sin(t * 0.3) * 0.1;
      ref.current.rotation.z = rotation[2] + Math.sin(t * 0.2) * 0.1;
    }
  });

  let geometry;
  switch (shape) {
    case 'cube':
      geometry = <boxGeometry args={[1, 1, 1]} />;
      break;
    case 'sphere':
      geometry = <sphereGeometry args={[0.7, 32, 32]} />;
      break;
    case 'torus':
      geometry = <torusGeometry args={[0.5, 0.2, 16, 32]} />;
      break;
    case 'cone':
      geometry = <coneGeometry args={[0.5, 1, 32]} />;
      break;
    case 'octahedron':
      geometry = <octahedronGeometry args={[0.7]} />;
      break;
    default:
      geometry = <boxGeometry args={[1, 1, 1]} />;
  }

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={ref} position={position} scale={scale}>
        {geometry}
        <meshStandardMaterial 
          color={color} 
          roughness={0.3} 
          metalness={0.7}
          emissive={color}
          emissiveIntensity={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
};

const Model3D = () => {
  const { viewport } = useThree();
  const isMobile = window.innerWidth < 768;
  
  // Adjust positioning based on viewport size
  const scaleFactor = isMobile ? 0.5 : 1;
  
  return (
    <PresentationControls
      global
      rotation={[0, 0, 0]}
      polar={[-Math.PI / 4, Math.PI / 4]}
      azimuth={[-Math.PI / 4, Math.PI / 4]}
      config={{ mass: 2, tension: 400 }}
      snap={{ mass: 4, tension: 300 }}
    >
      <group>
        <FloatingObject 
          position={[-2 * scaleFactor, 1 * scaleFactor, -1]} 
          shape="cube" 
          color="#0A2463" 
          scale={0.2 * scaleFactor}
          speed={0.8}
        />
        <FloatingObject 
          position={[-1 * scaleFactor, -1.5 * scaleFactor, -2]} 
          shape="sphere" 
          color="#39A2DB" 
          scale={0.2 * scaleFactor}
          speed={1.2}
        />
        <FloatingObject 
          position={[2 * scaleFactor, 0.8 * scaleFactor, -1.5]} 
          shape="torus" 
          color="#FF8600" 
          scale={0.15 * scaleFactor}
          rotation={[Math.PI / 6, 0, Math.PI / 4]}
          speed={0.5}
        />
        <FloatingObject 
          position={[1.5 * scaleFactor, -0.8 * scaleFactor, -1]} 
          shape="octahedron" 
          color="#0A2463" 
          scale={0.25 * scaleFactor}
          speed={1.5}
        />
        <FloatingObject 
          position={[0, 1.2 * scaleFactor, -2]} 
          shape="cone" 
          color="#FF8600" 
          scale={0.2 * scaleFactor}
          rotation={[Math.PI / 4, 0, 0]}
          speed={0.7}
        />
      </group>
    </PresentationControls>
  );
};

export default Model3D; 