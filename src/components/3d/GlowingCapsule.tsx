'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Trail } from '@react-three/drei';

const GlowingCapsule = () => {
    const capsuleRef = useRef<THREE.Group>(null);
    const trailRef = useRef<THREE.Mesh>(null);
    const time = useRef(0);

    // Capsule path - moves along the center
    useFrame((state, delta) => {
        if (capsuleRef.current) {
            time.current += delta * 0.6;

            // Smooth vertical movement
            const yPos = Math.sin(time.current) * 4;
            capsuleRef.current.position.y = yPos;

            // Subtle horizontal sway
            capsuleRef.current.position.x = Math.sin(time.current * 0.5) * 0.3;

            // Gentle rotation pulse
            capsuleRef.current.rotation.z = Math.sin(time.current * 2) * 0.05;
        }

        // Trail effect
        if (trailRef.current) {
            const material = trailRef.current.material as THREE.MeshBasicMaterial;
            material.opacity = 0.4 + Math.sin(time.current * 3) * 0.2;
        }
    });

    return (
        <group ref={capsuleRef} position={[0, 0, 0.5]}>
            {/* Main capsule body */}
            <mesh>
                <capsuleGeometry args={[0.15, 0.8, 8, 16]} />
                <meshBasicMaterial
                    color="#FF6B35"
                    transparent
                    opacity={0.95}
                />
            </mesh>

            {/* Inner glow core */}
            <mesh>
                <capsuleGeometry args={[0.08, 0.5, 8, 16]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* Outer glow halo */}
            <mesh>
                <capsuleGeometry args={[0.25, 1, 8, 16]} />
                <meshBasicMaterial
                    color="#FF6B35"
                    transparent
                    opacity={0.15}
                />
            </mesh>

            {/* Bottom accent ring */}
            <mesh position={[0, -0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.12, 0.02, 8, 24]} />
                <meshBasicMaterial
                    color="#4a90d9"
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Top accent ring */}
            <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.12, 0.02, 8, 24]} />
                <meshBasicMaterial
                    color="#4a90d9"
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Trail effect - static representation */}
            <mesh ref={trailRef} position={[0, -1.2, -0.1]}>
                <planeGeometry args={[0.06, 2]} />
                <meshBasicMaterial
                    color="#FF6B35"
                    transparent
                    opacity={0.3}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
};

export default GlowingCapsule;
