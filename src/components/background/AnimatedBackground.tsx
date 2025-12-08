import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingOrb = ({ 
  position, 
  scale, 
  speed, 
  color,
  distort = 0.4
}: { 
  position: [number, number, number]; 
  scale: number; 
  speed: number; 
  color: string;
  distort?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
      // Subtle pulsing effect
      const pulse = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.1 + 1;
      meshRef.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[1, 3]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.12}
          distort={distort}
          speed={1.5}
          roughness={0.3}
        />
      </mesh>
    </Float>
  );
};

const WavyRing = ({ 
  position, 
  scale, 
  speed, 
  color 
}: { 
  position: [number, number, number]; 
  scale: number; 
  speed: number; 
  color: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.1;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * speed * 0.2) * 0.3;
    }
  });

  return (
    <Float speed={speed * 0.7} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1, 0.3, 16, 64]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.1}
          distort={0.3}
          speed={2}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
};

const ParticleWave = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      
      // Gradient colors from purple to cyan
      const t = Math.random();
      colors[i * 3] = 0.545 * (1 - t) + 0.055 * t;     // R
      colors[i * 3 + 1] = 0.361 * (1 - t) + 0.714 * t;  // G
      colors[i * 3 + 2] = 0.965 * (1 - t) + 0.906 * t;  // B
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
      
      // Wave effect on particles
      const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < posArray.length / 3; i++) {
        const x = posArray[i * 3];
        const z = posArray[i * 3 + 2];
        posArray[i * 3 + 1] += Math.sin(state.clock.elapsedTime + x * 0.5 + z * 0.5) * 0.002;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={300}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={300}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        transparent
        opacity={0.7}
        vertexColors
        sizeAttenuation
      />
    </points>
  );
};

const FlowingLines = () => {
  const linesRef = useRef<THREE.Group>(null);
  
  const curves = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const points = [];
      for (let j = 0; j <= 50; j++) {
        const t = j / 50;
        points.push(
          new THREE.Vector3(
            (t - 0.5) * 20,
            Math.sin(t * Math.PI * 2 + i) * 3 + (i - 2) * 2,
            -5 - i * 2
          )
        );
      }
      return new THREE.CatmullRomCurve3(points);
    });
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((line, i) => {
        const mesh = line as THREE.Line;
        const positions = mesh.geometry.attributes.position.array as Float32Array;
        for (let j = 0; j < positions.length / 3; j++) {
          positions[j * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + j * 0.1 + i) * 0.01;
        }
        mesh.geometry.attributes.position.needsUpdate = true;
      });
    }
  });

  return (
    <group ref={linesRef}>
      {curves.map((curve, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={51}
              array={new Float32Array(curve.getPoints(50).flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial 
            color={i % 2 === 0 ? "#8b5cf6" : "#0ea5e9"} 
            transparent 
            opacity={0.15} 
          />
        </line>
      ))}
    </group>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.3} />
      <pointLight position={[-5, 5, 5]} intensity={0.2} color="#8b5cf6" />
      <pointLight position={[5, -5, 5]} intensity={0.2} color="#0ea5e9" />
      
      {/* Main floating orbs */}
      <FloatingOrb position={[-4, 2, -4]} scale={2.5} speed={1} color="#8b5cf6" distort={0.5} />
      <FloatingOrb position={[4, -1, -5]} scale={2} speed={0.8} color="#0ea5e9" distort={0.4} />
      <FloatingOrb position={[0, 3, -6]} scale={1.8} speed={1.2} color="#a855f7" distort={0.45} />
      <FloatingOrb position={[-3, -3, -3]} scale={1.5} speed={1.4} color="#06b6d4" distort={0.35} />
      <FloatingOrb position={[5, 2, -7]} scale={2.2} speed={0.6} color="#7c3aed" distort={0.5} />
      
      {/* Wavy rings for extra depth */}
      <WavyRing position={[-2, 0, -8]} scale={3} speed={0.5} color="#8b5cf6" />
      <WavyRing position={[3, 1, -10]} scale={2.5} speed={0.7} color="#0ea5e9" />
      
      {/* Particle wave system */}
      <ParticleWave />
      
      {/* Flowing lines */}
      <FlowingLines />
    </>
  );
};

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default AnimatedBackground;
