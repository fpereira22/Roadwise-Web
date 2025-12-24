'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import styles from './ScrollPath.module.css';

// ============================================================
// ⚙️ CONFIGURACIÓN DE PUNTOS DE ANCLAJE
// ============================================================

const CONFIG = {
    xStart: 5,          // Punto inicial (viewBox units)
    xLateral: 2,        // Borde izquierdo (viewBox units)
    xEnd: 5,            // Punto final (viewBox units)
    curveEntryEnd: 15,  // Fin curva entrada (viewBox units)
    curveExitStart: 85, // Inicio curva salida (viewBox units)
};

// ============================================================
// SECCIONES EN ESPAÑOL
// ============================================================

const getSectionLabel = (progress: number): string | null => {
    if (progress < 0.12) return null;
    if (progress < 0.28) return 'Nosotros';
    if (progress < 0.48) return 'Innovación I+D';
    if (progress < 0.72) return 'Experiencia';
    return 'Contacto';
};

// ============================================================
// COMPONENTE OPTIMIZADO
// ============================================================

const ScrollPath = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentSection, setCurrentSection] = useState<string | null>(null);
    const [vehiclePos, setVehiclePos] = useState({ x: CONFIG.xStart, y: 3, angle: 0 });
    const pathRef = useRef<SVGPathElement>(null);

    const { scrollYProgress } = useScroll();

    // useSpring para fluidez
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Path SVG - el coche seguirá exactamente este path
    const roadPath = useMemo(() => {
        const { xStart, xLateral, xEnd, curveEntryEnd, curveExitStart } = CONFIG;
        return `M ${xStart} 3 
                C ${xStart} ${curveEntryEnd * 0.5}, 
                  ${xLateral} ${curveEntryEnd * 0.7}, 
                  ${xLateral} ${curveEntryEnd} 
                L ${xLateral} ${curveExitStart} 
                C ${xLateral} ${curveExitStart + 5}, 
                  ${xEnd} ${curveExitStart + 8}, 
                  ${xEnd} 97`;
    }, []);

    // Referencia al SVG para obtener la matriz de transformación
    const svgRef = useRef<SVGSVGElement>(null);

    // Calcular posición en el path con coordenadas de pantalla reales
    const getPosition = useCallback((progress: number) => {
        const path = pathRef.current;
        const svg = svgRef.current;
        if (!path || !svg) return { x: CONFIG.xStart, y: 3, angle: 0 };

        try {
            const len = path.getTotalLength();
            const pt = path.getPointAtLength(progress * len);

            // Obtener la matriz de transformación del SVG a pantalla
            const ctm = svg.getScreenCTM();
            if (!ctm) return { x: pt.x, y: pt.y, angle: 0 };

            // Transformar punto del viewBox a coordenadas de pantalla
            const screenPt = pt.matrixTransform(ctm);

            // Convertir a porcentajes del viewport
            const x = (screenPt.x / window.innerWidth) * 100;
            const y = (screenPt.y / window.innerHeight) * 100;

            // Calcular ángulo tangente
            const d = len * 0.01;
            const p1 = path.getPointAtLength(Math.max(0, progress * len - d));
            const p2 = path.getPointAtLength(Math.min(len, progress * len + d));
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI) + 90;

            return { x, y, angle };
        } catch {
            return { x: CONFIG.xStart, y: 3, angle: 0 };
        }
    }, []);

    // Actualización
    useEffect(() => {
        const unsubscribe = smoothProgress.on('change', (value) => {
            setVehiclePos(getPosition(value));
            setCurrentSection(getSectionLabel(value));
        });
        return () => unsubscribe();
    }, [smoothProgress, getPosition]);

    // Mount
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 200);
        return () => clearTimeout(timer);
    }, []);

    // Opacidad del vehículo
    const vehicleOpacity = useTransform(smoothProgress, [0.92, 1], [1, 0]);
    const textOpacity = useTransform(smoothProgress, [0.10, 0.14], [0, 1]);

    if (!isVisible) return null;

    return (
        <div className={styles.container}>
            {/* SVG del camino - preserveAspectRatio="none" para estirar a pantalla completa */}
            <svg
                ref={svgRef}
                className={styles.svg}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="0" stdDeviation="0.3" floodColor="#FF6B35" floodOpacity="0.8" />
                    </filter>
                </defs>

                {/* Borde izquierdo */}
                <path
                    d={roadPath}
                    fill="none"
                    stroke="rgba(100,100,100,0.4)"
                    strokeWidth="0.12"
                    strokeLinecap="round"
                    style={{ transform: 'translateX(-0.4px)' }}
                />

                {/* Línea central (referencia para el coche) */}
                <path
                    ref={pathRef}
                    d={roadPath}
                    fill="none"
                    stroke="rgba(120,120,120,0.5)"
                    strokeWidth="0.08"
                    strokeDasharray="0.8 0.5"
                    strokeLinecap="round"
                />

                {/* Borde derecho */}
                <path
                    d={roadPath}
                    fill="none"
                    stroke="rgba(100,100,100,0.4)"
                    strokeWidth="0.12"
                    strokeLinecap="round"
                    style={{ transform: 'translateX(0.4px)' }}
                />

                {/* Trail de progreso */}
                <motion.path
                    d={roadPath}
                    fill="none"
                    stroke="#FF6B35"
                    strokeWidth="0.2"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    style={{ pathLength: smoothProgress }}
                />

                {/* Marcador inicio */}
                <circle cx={CONFIG.xStart} cy="3" r="0.6" fill="rgba(255,107,53,0.3)" stroke="#FF6B35" strokeWidth="0.15" />

                {/* Marcador fin */}
                <circle cx={CONFIG.xEnd} cy="97" r="0.5" fill="rgba(100,100,100,0.3)" />
            </svg>

            {/* Vehículo - usando wrapper para offset de centrado */}
            <div
                className={styles.vehicleWrapper}
                style={{
                    left: `${vehiclePos.x}%`,
                    top: `${vehiclePos.y}%`,
                }}
            >
                <motion.div
                    className={styles.vehicle}
                    style={{
                        rotate: vehiclePos.angle,
                        opacity: vehicleOpacity
                    }}
                >
                    <svg viewBox="0 0 24 40" className={styles.car}>
                        <ellipse cx="12" cy="20" rx="7" ry="14" fill="rgba(0,0,0,0.3)" />
                        <rect x="4" y="5" width="16" height="30" rx="4" fill="#FF6B35" />
                        <rect x="4" y="5" width="16" height="30" rx="4" fill="none" stroke="#222" strokeWidth="0.5" />
                        <rect x="6" y="11" width="12" height="11" rx="2" fill="#1a1a2e" />
                        <rect x="5" y="3" width="14" height="7" rx="3" fill="#E55A2B" />
                        <rect x="5" y="1" width="4" height="2.5" rx="1" fill="#fff" />
                        <rect x="15" y="1" width="4" height="2.5" rx="1" fill="#fff" />
                        <rect x="3.5" y="12" width="1" height="13" rx="0.5" fill="rgba(255,255,255,0.35)" />
                        <rect x="19.5" y="12" width="1" height="13" rx="0.5" fill="rgba(255,255,255,0.35)" />
                        <rect x="5" y="33" width="4" height="2" rx="1" fill="#e33" />
                        <rect x="15" y="33" width="4" height="2" rx="1" fill="#e33" />
                        <circle cx="12" cy="17" r="2.5" fill="rgba(74,144,217,0.6)" />
                        <circle cx="12" cy="17" r="1" fill="#4a90d9" />
                    </svg>
                </motion.div>
            </div>

            {/* Label de sección */}
            {currentSection && (
                <motion.div
                    className={styles.label}
                    style={{
                        left: `calc(${vehiclePos.x}% + 20px)`,
                        top: `${vehiclePos.y}%`,
                        opacity: textOpacity
                    }}
                >
                    <span className={styles.dot}></span>
                    <span className={styles.text}>{currentSection}</span>
                </motion.div>
            )}
        </div>
    );
};

export default ScrollPath;
