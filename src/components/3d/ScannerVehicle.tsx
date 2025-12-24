'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ScannerVehicle = () => {
    const vehicleRef = useRef<THREE.Group>(null);
    const scannerRef = useRef<THREE.Mesh>(null);
    const scannerLightRef = useRef<THREE.SpotLight>(null);
    const scanPhase = useRef(0);

    // Subtle vehicle hover animation
    useFrame((state) => {
        if (vehicleRef.current) {
            // Gentle floating motion
            vehicleRef.current.position.y = -0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
        }

        // Scanner sweep animation
        if (scannerRef.current && scannerLightRef.current) {
            scanPhase.current += 0.02;
            const scanOffset = Math.sin(scanPhase.current) * 3;
            scannerRef.current.position.z = -4 + scanOffset;
            scannerLightRef.current.position.z = -4 + scanOffset;

            // Pulse scanner opacity
            const material = scannerRef.current.material as THREE.MeshBasicMaterial;
            material.opacity = 0.3 + Math.sin(scanPhase.current * 2) * 0.15;
        }
    });

    return (
        <group ref={vehicleRef} position={[0, -0.1, 2]}>
            {/* Main Vehicle Body - Futuristic Low-Profile Design */}
            <group>
                {/* Base chassis */}
                <mesh position={[0, 0.15, 0]} castShadow>
                    <boxGeometry args={[1.8, 0.3, 4]} />
                    <meshStandardMaterial
                        color="#2a2a3e"
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>

                {/* Cabin/Cockpit */}
                <mesh position={[0, 0.45, 0.3]} castShadow>
                    <boxGeometry args={[1.5, 0.4, 2]} />
                    <meshStandardMaterial
                        color="#1a1a2e"
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>

                {/* Windshield accent */}
                <mesh position={[0, 0.5, -0.5]} rotation={[0.3, 0, 0]}>
                    <boxGeometry args={[1.4, 0.02, 0.8]} />
                    <meshStandardMaterial
                        color="#4a90d9"
                        metalness={0.9}
                        roughness={0.1}
                        emissive="#4a90d9"
                        emissiveIntensity={0.3}
                    />
                </mesh>

                {/* Orange accent strips - Roadwise brand */}
                <mesh position={[0, 0.32, 0]} castShadow>
                    <boxGeometry args={[1.85, 0.04, 4.1]} />
                    <meshStandardMaterial
                        color="#FF6B35"
                        metalness={0.7}
                        roughness={0.3}
                        emissive="#FF6B35"
                        emissiveIntensity={0.4}
                    />
                </mesh>

                {/* Side accents left */}
                <mesh position={[-0.95, 0.15, 0]} castShadow>
                    <boxGeometry args={[0.05, 0.35, 4]} />
                    <meshStandardMaterial
                        color="#FF6B35"
                        metalness={0.6}
                        roughness={0.4}
                        emissive="#FF6B35"
                        emissiveIntensity={0.3}
                    />
                </mesh>

                {/* Side accents right */}
                <mesh position={[0.95, 0.15, 0]} castShadow>
                    <boxGeometry args={[0.05, 0.35, 4]} />
                    <meshStandardMaterial
                        color="#FF6B35"
                        metalness={0.6}
                        roughness={0.4}
                        emissive="#FF6B35"
                        emissiveIntensity={0.3}
                    />
                </mesh>

                {/* Front nose */}
                <mesh position={[0, 0.1, -2.2]} castShadow>
                    <boxGeometry args={[1.6, 0.2, 0.5]} />
                    <meshStandardMaterial
                        color="#2a2a3e"
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>

                {/* Rear section */}
                <mesh position={[0, 0.25, 2.1]} castShadow>
                    <boxGeometry args={[1.7, 0.35, 0.3]} />
                    <meshStandardMaterial
                        color="#2a2a3e"
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>
            </group>

            {/* Headlights */}
            <pointLight
                position={[-0.6, 0.1, -2.3]}
                intensity={2}
                distance={15}
                color="#ffffff"
            />
            <pointLight
                position={[0.6, 0.1, -2.3]}
                intensity={2}
                distance={15}
                color="#ffffff"
            />

            {/* Headlight meshes */}
            <mesh position={[-0.6, 0.1, -2.25]}>
                <boxGeometry args={[0.3, 0.1, 0.05]} />
                <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={2}
                />
            </mesh>
            <mesh position={[0.6, 0.1, -2.25]}>
                <boxGeometry args={[0.3, 0.1, 0.05]} />
                <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={2}
                />
            </mesh>

            {/* Tail lights */}
            <mesh position={[-0.7, 0.25, 2.2]}>
                <boxGeometry args={[0.2, 0.1, 0.05]} />
                <meshStandardMaterial
                    color="#ff3333"
                    emissive="#ff3333"
                    emissiveIntensity={1}
                />
            </mesh>
            <mesh position={[0.7, 0.25, 2.2]}>
                <boxGeometry args={[0.2, 0.1, 0.05]} />
                <meshStandardMaterial
                    color="#ff3333"
                    emissive="#ff3333"
                    emissiveIntensity={1}
                />
            </mesh>

            {/* AI Sensor dome on top */}
            <mesh position={[0, 0.75, 0]}>
                <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial
                    color="#1a1a2e"
                    metalness={0.9}
                    roughness={0.1}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Sensor ring */}
            <mesh position={[0, 0.67, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.28, 0.03, 8, 24]} />
                <meshStandardMaterial
                    color="#FF6B35"
                    emissive="#FF6B35"
                    emissiveIntensity={0.5}
                />
            </mesh>

            {/* Scanner Light Beam */}
            <spotLight
                ref={scannerLightRef}
                position={[0, 0.5, -4]}
                angle={0.15}
                penumbra={0.5}
                intensity={5}
                distance={20}
                color="#FF6B35"
                target-position={[0, -0.5, -6]}
                castShadow
            />

            {/* Scanner visualization plane */}
            <mesh
                ref={scannerRef}
                position={[0, -0.4, -4]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[10, 0.15]} />
                <meshBasicMaterial
                    color="#FF6B35"
                    transparent
                    opacity={0.4}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Secondary scanner line */}
            <mesh
                position={[0, -0.35, -5]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[8, 0.08]} />
                <meshBasicMaterial
                    color="#4a90d9"
                    transparent
                    opacity={0.3}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
};

export default ScannerVehicle;
