'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MovingRoadProps {
    speed?: number;
}

const MovingRoad = ({ speed = 0.5 }: MovingRoadProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const textureOffset = useRef(0);

    // Create road texture programmatically
    const roadTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            // Road base color - dark asphalt
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add subtle asphalt texture noise
            for (let i = 0; i < 3000; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const gray = Math.random() * 30 + 20;
                ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, 0.3)`;
                ctx.fillRect(x, y, 2, 2);
            }

            // Road lane markings
            const laneWidth = 6;
            const dashLength = 80;
            const gapLength = 60;

            // Left lane marking (dashed)
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = laneWidth;
            ctx.setLineDash([dashLength, gapLength]);
            ctx.beginPath();
            ctx.moveTo(canvas.width * 0.25, 0);
            ctx.lineTo(canvas.width * 0.25, canvas.height);
            ctx.stroke();

            // Right lane marking (dashed)
            ctx.beginPath();
            ctx.moveTo(canvas.width * 0.75, 0);
            ctx.lineTo(canvas.width * 0.75, canvas.height);
            ctx.stroke();

            // Center line (solid yellow-orange for Roadwise brand)
            ctx.strokeStyle = '#FF6B35';
            ctx.lineWidth = 4;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(canvas.width * 0.5, 0);
            ctx.lineTo(canvas.width * 0.5, canvas.height);
            ctx.stroke();

            // Road edges (solid white)
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(10, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(canvas.width - 10, 0);
            ctx.lineTo(canvas.width - 10, canvas.height);
            ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 8);

        return texture;
    }, []);

    // Animate road movement
    useFrame((_, delta) => {
        if (meshRef.current && roadTexture) {
            textureOffset.current += delta * speed;
            roadTexture.offset.y = textureOffset.current;
        }
    });

    return (
        <mesh
            ref={meshRef}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.5, 0]}
            receiveShadow
        >
            <planeGeometry args={[12, 100]} />
            <meshStandardMaterial
                map={roadTexture}
                roughness={0.9}
                metalness={0.1}
            />
        </mesh>
    );
};

export default MovingRoad;
