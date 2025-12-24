'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import MovingRoad from './MovingRoad';
import ScannerVehicle from './ScannerVehicle';
import DataParticles from './DataParticles';
import styles from './RoadwiseScene3D.module.css';

const SceneContent = () => {
    return (
        <>
            {/* Camera positioned behind and above the vehicle */}
            <PerspectiveCamera
                makeDefault
                position={[0, 3, 12]}
                fov={60}
                near={0.1}
                far={100}
            />

            {/* Atmospheric fog for depth */}
            <fog attach="fog" args={['#0a0a15', 5, 50]} />

            {/* Ambient lighting - very subtle */}
            <ambientLight intensity={0.15} color="#4a90d9" />

            {/* Main scene illumination from above */}
            <directionalLight
                position={[5, 10, 5]}
                intensity={0.3}
                color="#ffffff"
                castShadow
                shadow-mapSize={[1024, 1024]}
            />

            {/* Orange accent light from below/behind */}
            <pointLight
                position={[0, 2, 15]}
                intensity={1}
                color="#FF6B35"
                distance={30}
            />

            {/* Blue accent lighting */}
            <pointLight
                position={[-8, 5, -10]}
                intensity={0.5}
                color="#4a90d9"
                distance={40}
            />

            <pointLight
                position={[8, 5, -10]}
                intensity={0.5}
                color="#4a90d9"
                distance={40}
            />

            {/* Road surface */}
            <MovingRoad speed={0.8} />

            {/* Futuristic scanner vehicle */}
            <ScannerVehicle />

            {/* Data particles floating effect */}
            <DataParticles count={80} />

            {/* Road barriers/walls for atmosphere */}
            <mesh position={[-7, 0.5, -20]} castShadow>
                <boxGeometry args={[0.3, 1.5, 80]} />
                <meshStandardMaterial
                    color="#1a1a2e"
                    metalness={0.5}
                    roughness={0.7}
                />
            </mesh>
            <mesh position={[7, 0.5, -20]} castShadow>
                <boxGeometry args={[0.3, 1.5, 80]} />
                <meshStandardMaterial
                    color="#1a1a2e"
                    metalness={0.5}
                    roughness={0.7}
                />
            </mesh>

            {/* Subtle reflection plane beneath */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.51, 0]}
            >
                <planeGeometry args={[20, 100]} />
                <meshStandardMaterial
                    color="#050510"
                    metalness={0.9}
                    roughness={0.1}
                    transparent
                    opacity={0.5}
                />
            </mesh>
        </>
    );
};

const RoadwiseScene3D = () => {
    return (
        <div className={styles.canvasContainer}>
            <Canvas
                shadows
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    <SceneContent />
                </Suspense>
            </Canvas>

            {/* Gradient overlay for better text readability */}
            <div className={styles.gradientOverlay} />
        </div>
    );
};

export default RoadwiseScene3D;
