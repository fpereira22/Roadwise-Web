'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
// Cono de tráfico naranja
const TrafficCone = ({ position, scale = 1, rotationSpeed = 0.3 }: { position: [number, number, number]; scale?: number; rotationSpeed?: number }) => {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * rotationSpeed) * 0.1;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group ref={meshRef} position={position} scale={scale}>
                {/* Base del cono */}
                <mesh position={[0, 0.02, 0]}>
                    <boxGeometry args={[0.4, 0.04, 0.4]} />
                    <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
                </mesh>
                {/* Cuerpo del cono */}
                <mesh position={[0, 0.25, 0]}>
                    <coneGeometry args={[0.18, 0.45, 16]} />
                    <meshStandardMaterial color="#FF6B35" roughness={0.4} metalness={0.1} />
                </mesh>
                {/* Franjas reflectantes */}
                <mesh position={[0, 0.35, 0]}>
                    <cylinderGeometry args={[0.12, 0.14, 0.06, 16]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.3} emissive="#ffffff" emissiveIntensity={0.2} />
                </mesh>
                <mesh position={[0, 0.2, 0]}>
                    <cylinderGeometry args={[0.15, 0.16, 0.05, 16]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.3} emissive="#ffffff" emissiveIntensity={0.2} />
                </mesh>
            </group>
        </Float>
    );
};

// Tacha vial (ojo de gato)
const RoadStud = ({ position, blinkDelay = 0 }: { position: [number, number, number]; blinkDelay?: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (glowRef.current) {
            const intensity = 0.3 + Math.sin(state.clock.elapsedTime * 2 + blinkDelay) * 0.3;
            (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <group position={position}>
                {/* Base de la tacha */}
                <mesh ref={meshRef} position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.08, 0.1, 0.03, 8]} />
                    <meshStandardMaterial color="#2a2a3e" roughness={0.7} />
                </mesh>
                {/* Reflector brillante */}
                <mesh ref={glowRef} position={[0, 0.025, 0]}>
                    <cylinderGeometry args={[0.05, 0.06, 0.02, 8]} />
                    <meshStandardMaterial
                        color="#FFD700"
                        emissive="#FF6B35"
                        emissiveIntensity={0.5}
                        roughness={0.1}
                        metalness={0.8}
                    />
                </mesh>
            </group>
        </Float>
    );
};

// Barrera vial (Jersey barrier simplificada)
const JerseyBarrier = ({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) => {
    return (
        <Float speed={1} rotationIntensity={0.05} floatIntensity={0.2}>
            <group position={position} rotation={[0, rotation, 0]}>
                {/* Cuerpo principal de la barrera */}
                <mesh>
                    <boxGeometry args={[0.8, 0.25, 0.15]} />
                    <meshStandardMaterial color="#6b7280" roughness={0.9} />
                </mesh>
                {/* Franja naranja superior */}
                <mesh position={[0, 0.08, 0.076]}>
                    <boxGeometry args={[0.78, 0.06, 0.01]} />
                    <meshStandardMaterial color="#FF6B35" roughness={0.5} emissive="#FF6B35" emissiveIntensity={0.1} />
                </mesh>
                {/* Franja blanca */}
                <mesh position={[0, 0, 0.076]}>
                    <boxGeometry args={[0.78, 0.06, 0.01]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.3} />
                </mesh>
            </group>
        </Float>
    );
};

// Señal de trabajo (Hombres Trabajando)
const WorkSign = ({ position }: { position: [number, number, number] }) => {
    const signRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (signRef.current) {
            signRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
            <group ref={signRef} position={position}>
                {/* Poste */}
                <mesh position={[0, -0.3, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
                    <meshStandardMaterial color="#4a5568" roughness={0.6} metalness={0.4} />
                </mesh>
                {/* Panel de señal (diamante) */}
                <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 4]}>
                    <boxGeometry args={[0.35, 0.35, 0.02]} />
                    <meshStandardMaterial color="#FF6B35" roughness={0.4} emissive="#FF6B35" emissiveIntensity={0.15} />
                </mesh>
                {/* Borde de la señal */}
                <mesh position={[0, 0.1, 0.011]} rotation={[0, 0, Math.PI / 4]}>
                    <boxGeometry args={[0.32, 0.32, 0.005]} />
                    <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
                </mesh>
                {/* Símbolo (persona trabajando - simplificado) */}
                <mesh position={[0, 0.1, 0.015]} rotation={[0, 0, Math.PI / 4]}>
                    <boxGeometry args={[0.15, 0.15, 0.005]} />
                    <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
                </mesh>
            </group>
        </Float>
    );
};

// Fragmento de asfalto con grietas
const AsphaltChunk = ({ position }: { position: [number, number, number] }) => {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
            <group ref={meshRef} position={position}>
                {/* Base de asfalto */}
                <mesh>
                    <boxGeometry args={[0.5, 0.08, 0.5]} />
                    <meshStandardMaterial color="#2d3748" roughness={0.95} />
                </mesh>
                {/* Grietas (líneas en la superficie) */}
                <mesh position={[0.1, 0.041, 0]} rotation={[0, 0.3, 0]}>
                    <boxGeometry args={[0.25, 0.005, 0.02]} />
                    <meshStandardMaterial color="#1a202c" roughness={1} />
                </mesh>
                <mesh position={[-0.08, 0.041, 0.1]} rotation={[0, -0.5, 0]}>
                    <boxGeometry args={[0.2, 0.005, 0.015]} />
                    <meshStandardMaterial color="#1a202c" roughness={1} />
                </mesh>
                <mesh position={[0.05, 0.041, -0.12]} rotation={[0, 0.8, 0]}>
                    <boxGeometry args={[0.15, 0.005, 0.01]} />
                    <meshStandardMaterial color="#1a202c" roughness={1} />
                </mesh>
                {/* Marca de línea vial */}
                <mesh position={[0, 0.042, 0]}>
                    <boxGeometry args={[0.08, 0.003, 0.4]} />
                    <meshStandardMaterial color="#fbbf24" roughness={0.3} emissive="#fbbf24" emissiveIntensity={0.1} />
                </mesh>
            </group>
        </Float>
    );
};

// Escena principal con todos los elementos
const RoadElementsScene = () => {
    return (
        <>
            {/* Iluminación mejorada sin necesidad de HDR externo */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 8, 5]} intensity={1} color="#ffffff" castShadow />
            <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#FF6B35" />
            <pointLight position={[0, 3, 2]} intensity={0.8} color="#ffffff" />
            <pointLight position={[-2, 1, 1]} intensity={0.3} color="#FF6B35" />
            <pointLight position={[2, 1, 1]} intensity={0.3} color="#4a90d9" />

            {/* Luz de relleno desde abajo para dar profundidad */}
            <hemisphereLight args={['#ffffff', '#1a1a2e', 0.5]} />

            {/* Conos - fila izquierda */}
            <TrafficCone position={[-2.5, 0, 0]} scale={1.2} rotationSpeed={0.4} />
            <TrafficCone position={[-1.8, -0.5, 0.5]} scale={0.9} rotationSpeed={0.3} />

            {/* Tachas viales - línea central */}
            <RoadStud position={[-0.8, -0.3, 0]} blinkDelay={0} />
            <RoadStud position={[-0.4, -0.3, 0.2]} blinkDelay={1} />
            <RoadStud position={[0, -0.3, 0]} blinkDelay={2} />
            <RoadStud position={[0.4, -0.3, -0.2]} blinkDelay={3} />
            <RoadStud position={[0.8, -0.3, 0.1]} blinkDelay={4} />

            {/* Señal de trabajo - centro-derecha */}
            <WorkSign position={[1.5, 0.3, 0]} />

            {/* Barrera Jersey - derecha */}
            <JerseyBarrier position={[2.5, -0.2, 0]} rotation={0.2} />

            {/* Fragmento de asfalto - arriba */}
            <AsphaltChunk position={[0, 0.8, -0.5]} />

            {/* Conos adicionales - fondo derecho */}
            <TrafficCone position={[2.8, 0.3, -0.8]} scale={0.7} rotationSpeed={0.5} />
        </>
    );
};

// Componente exportable
const RoadElements3D = ({ className }: { className?: string }) => {
    return (
        <div className={className} style={{ width: '100%', height: '400px', position: 'relative' }}>
            <Canvas
                camera={{ position: [0, 1, 5], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <RoadElementsScene />
            </Canvas>
        </div>
    );
};

export default RoadElements3D;
