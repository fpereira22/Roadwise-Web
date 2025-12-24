'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FlowingLinesProps {
    count?: number;
}

const FlowingLines = ({ count = 12 }: FlowingLinesProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const pulseRefs = useRef<THREE.Mesh[]>([]);

    // Generate line positions
    const linePositions = useMemo(() => {
        const positions: { x: number; isActive: boolean; delay: number }[] = [];
        const spread = 8;

        for (let i = 0; i < count; i++) {
            const x = (i - count / 2) * (spread / count) + (Math.random() - 0.5) * 0.3;
            // Some lines are "active" (glowing orange), others are dim
            const isActive = i === Math.floor(count / 2) || i === Math.floor(count / 2) - 1 || Math.random() > 0.7;
            positions.push({ x, isActive, delay: Math.random() * Math.PI * 2 });
        }
        return positions;
    }, [count]);

    // Animate pulse positions
    useFrame((state) => {
        pulseRefs.current.forEach((pulse, index) => {
            if (pulse) {
                const time = state.clock.elapsedTime + linePositions[index].delay;
                // Move pulse up the line
                pulse.position.y = ((time * 1.5) % 20) - 10;

                // Fade in/out based on position
                const material = pulse.material as THREE.MeshBasicMaterial;
                const distFromCenter = Math.abs(pulse.position.y);
                material.opacity = Math.max(0, 1 - distFromCenter / 8);
            }
        });
    });

    return (
        <group ref={groupRef}>
            {linePositions.map((line, index) => (
                <group key={index}>
                    {/* Background line (dim) */}
                    <mesh position={[line.x, 0, 0]}>
                        <planeGeometry args={[0.02, 30]} />
                        <meshBasicMaterial
                            color={line.isActive ? "#1a1a1a" : "#0a0a0a"}
                            transparent
                            opacity={0.5}
                        />
                    </mesh>

                    {/* Active glow line */}
                    {line.isActive && (
                        <>
                            {/* Main glow line */}
                            <mesh position={[line.x, 0, 0.01]}>
                                <planeGeometry args={[0.015, 30]} />
                                <meshBasicMaterial
                                    color="#FF6B35"
                                    transparent
                                    opacity={0.3}
                                />
                            </mesh>

                            {/* Pulse/particle moving along line */}
                            <mesh
                                ref={(el) => { if (el) pulseRefs.current[index] = el; }}
                                position={[line.x, 0, 0.02]}
                            >
                                <planeGeometry args={[0.08, 0.4]} />
                                <meshBasicMaterial
                                    color="#FF6B35"
                                    transparent
                                    opacity={0.9}
                                />
                            </mesh>
                        </>
                    )}
                </group>
            ))}
        </group>
    );
};

export default FlowingLines;
