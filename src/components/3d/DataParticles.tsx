'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DataParticlesProps {
    count?: number;
}

const DataParticles = ({ count = 100 }: DataParticlesProps) => {
    const pointsRef = useRef<THREE.Points>(null);

    // Create particle positions
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        // Distribute particles in a corridor along the road
        positions[i * 3] = (Math.random() - 0.5) * 15; // x
        positions[i * 3 + 1] = Math.random() * 8 + 1; // y
        positions[i * 3 + 2] = Math.random() * 60 - 40; // z

        // Roadwise colors - orange and blue accent
        const isOrange = Math.random() > 0.5;
        if (isOrange) {
            colors[i * 3] = 1; // R
            colors[i * 3 + 1] = 0.42; // G
            colors[i * 3 + 2] = 0.21; // B
        } else {
            colors[i * 3] = 0.29; // R
            colors[i * 3 + 1] = 0.56; // G
            colors[i * 3 + 2] = 0.85; // B
        }

        speeds[i] = Math.random() * 0.3 + 0.1;
    }

    useFrame((_, delta) => {
        if (pointsRef.current) {
            const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

            for (let i = 0; i < count; i++) {
                // Move particles toward camera
                positions[i * 3 + 2] += speeds[i] * delta * 30;

                // Reset position when past camera
                if (positions[i * 3 + 2] > 20) {
                    positions[i * 3 + 2] = -40;
                    positions[i * 3] = (Math.random() - 0.5) * 15;
                    positions[i * 3 + 1] = Math.random() * 8 + 1;
                }
            }

            pointsRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                vertexColors
                transparent
                opacity={0.7}
                sizeAttenuation
            />
        </points>
    );
};

export default DataParticles;
