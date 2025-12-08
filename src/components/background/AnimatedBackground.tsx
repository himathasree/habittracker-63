import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const GlowingSphere = ({ 
  position, 
  scale, 
  speed, 
  color,
  opacity = 0.08
}: { 
  position: [number, number, number]; 
  scale: number; 
  speed: number; 
  color: string;
  opacity?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.15;
    }
  });

  return (
    <Float speed={speed * 0.5} rotationIntensity={0.2} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={opacity}
          distort={0.2}
          speed={1}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
};

const SubtleParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={100}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#8b5cf6"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

const GradientMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} scale={15}>
      <planeGeometry args={[2, 2, 32, 32]} />
      <meshBasicMaterial
        color="#7c3aed"
        transparent
        opacity={0.03}
      />
    </mesh>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.2} />
      
      {/* Large subtle spheres for depth */}
      <GlowingSphere position={[-5, 3, -8]} scale={4} speed={0.3} color="#8b5cf6" opacity={0.05} />
      <GlowingSphere position={[6, -2, -10]} scale={5} speed={0.2} color="#06b6d4" opacity={0.04} />
      <GlowingSphere position={[0, 4, -12]} scale={3.5} speed={0.25} color="#a855f7" opacity={0.05} />
      
      {/* Medium accent spheres */}
      <GlowingSphere position={[-4, -3, -6]} scale={2} speed={0.4} color="#0ea5e9" opacity={0.06} />
      <GlowingSphere position={[5, 2, -7]} scale={2.5} speed={0.35} color="#7c3aed" opacity={0.05} />
      
      {/* Subtle particle field */}
      <SubtleParticles />
      
      {/* Background gradient mesh */}
      <GradientMesh />
    </>
  );
};

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
      {/* Overlay gradient for extra polish */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default AnimatedBackground;
