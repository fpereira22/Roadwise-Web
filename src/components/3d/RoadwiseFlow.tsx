'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import FlowingLines from './FlowingLines';
import GlowingCapsule from './GlowingCapsule';
import styles from './RoadwiseFlow.module.css';

// Parallax camera effect based on mouse movement
const ParallaxCamera = () => {
    const { camera } = useThree();
    const mouse = useRef({ x: 0, y: 0 });
    const target = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Normalize mouse position to -1 to 1
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame(() => {
        // Smooth interpolation for parallax effect
        target.current.x += (mouse.current.x * 0.8 - target.current.x) * 0.05;
        target.current.y += (mouse.current.y * 0.5 - target.current.y) * 0.05;

        // Apply subtle camera rotation
        camera.rotation.y = target.current.x * 0.08;
        camera.rotation.x = target.current.y * 0.05;
    });

    return null;
};

// Floating particles for extra atmosphere
const FloatingParticles = () => {
    const particlesRef = useRef<THREE.Points>(null);

    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }

    useFrame((state) => {
        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

            for (let i = 0; i < particleCount; i++) {
                // Slow upward drift
                positions[i * 3 + 1] += 0.005;

                // Reset when out of view
                if (positions[i * 3 + 1] > 10) {
                    positions[i * 3 + 1] = -10;
                }
            }

            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                color="#FF6B35"
                transparent
                opacity={0.4}
                sizeAttenuation
            />
        </points>
    );
};

// Scene content
const SceneContent = () => {
    return (
        <>
            {/* Parallax effect */}
            <ParallaxCamera />

            {/* Background - pure black is set via CSS */}

            {/* Flowing vertical lines */}
            <FlowingLines count={14} />

            {/* Main glowing capsule/node */}
            <GlowingCapsule />

            {/* Subtle floating particles */}
            <FloatingParticles />

            {/* Post-processing effects */}
            <EffectComposer>
                <Bloom
                    intensity={1.5}
                    luminanceThreshold={0.1}
                    luminanceSmoothing={0.9}
                    mipmapBlur
                />
            </EffectComposer>
        </>
    );
};

const RoadwiseFlow = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className={styles.canvasContainer} />;
    }

    return (
        <div className={styles.canvasContainer}>
            <Canvas
                camera={{ position: [0, 0, 8], fov: 50 }}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: 'high-performance'
                }}
                dpr={[1, 2]}
            >
                <color attach="background" args={['#000000']} />
                <Suspense fallback={null}>
                    <SceneContent />
                </Suspense>
            </Canvas>

            {/* Gradient overlay for smooth text integration */}
            <div className={styles.gradientOverlay} />
        </div>
    );
};

export default RoadwiseFlow;
