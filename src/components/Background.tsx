import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, useTexture, Trail } from '@react-three/drei';
import { random } from 'maath';

function Stars({ count = 2000, ...props }: { count?: number; [key: string]: any }) {
  const ref = useRef<THREE.Points>(null!);
  const [sphere] = useState(() => random.inSphere(new Float32Array(count * 3), { radius: 1.5 }) as Float32Array);
  const { mouse } = useThree();
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.05;
      ref.current.rotation.y -= delta * 0.075;
      
      // Add subtle mouse interaction
      ref.current.rotation.x += mouse.y * 0.003;
      ref.current.rotation.y += mouse.x * 0.003;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#fff"
          size={0.0015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function MovingParticle({ speed = 0.05, color = "#5c9fff" }) {
  const ref = useRef<THREE.Mesh>(null!);
  const [startPosition] = useState(() => new THREE.Vector3(
    Math.random() * 2 - 1, 
    Math.random() * 2 - 1, 
    Math.random() * 2 - 1
  ));
  
  useFrame((state) => {
    if (ref.current) {
      // Create orbital motion
      const t = state.clock.getElapsedTime() * speed;
      ref.current.position.x = startPosition.x + Math.sin(t) * 0.5;
      ref.current.position.y = startPosition.y + Math.cos(t * 0.7) * 0.5;
      ref.current.position.z = startPosition.z + Math.sin(t * 0.5) * 0.5;
    }
  });

  return (
    <Trail
      width={0.03}
      color={color}
      length={5}
      decay={1}
      local={false}
      attenuation={(t) => t * t}
    >
      <mesh ref={ref} position={startPosition}>
        <sphereGeometry args={[0.005, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </Trail>
  );
}

export default function Background() {
  return (
    <>
      {/* Transparent background to work with LetterGlitch */}
      <color attach="background" args={['transparent']} />
      
      {/* Reduced fog for more subtlety */}
      <fog attach="fog" args={['#070b1a', 1.5, 3]} />
      
      <ambientLight intensity={0.5} />
      <Stars />
      {Array.from({ length: 8 }).map((_, i) => (
        <MovingParticle 
          key={i} 
          speed={0.03 + Math.random() * 0.03} 
          color={i % 3 === 0 ? "#5c9fff" : i % 3 === 1 ? "#ff8a00" : "#39a2db"}
        />
      ))}
    </>
  );
}