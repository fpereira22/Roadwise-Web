'use client';

import dynamic from 'next/dynamic';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './HeroSection.module.css';

// Dynamic import for 3D scene to avoid SSR issues with Three.js
const RoadwiseScene3D = dynamic(
    () => import('./3d/RoadwiseScene3D'),
    { ssr: false }
);

const HeroSection = () => {
    return (
        <section id="inicio" className={styles.hero}>
            {/* 3D Background Scene */}
            <div className={styles.scene3dWrapper}>
                <RoadwiseScene3D />
            </div>

            {/* Content Overlay */}
            <Container className={styles.content}>
                <Row className="justify-content-center">
                    <Col lg={10} xl={8} className="text-center">
                        <div className={styles.tagline}>
                            <span className={styles.taglineBadge}>
                                Excelencia en Infraestructura Vial
                            </span>
                        </div>

                        <h1 className={styles.title}>
                            Líderes en la{' '}
                            <span className={styles.highlight}>Mantención y Cuidado</span>{' '}
                            de la Infraestructura Vial en Chile
                        </h1>

                        <p className={styles.subtitle}>
                            Garantizamos la continuidad operativa de las autopistas más importantes
                            del país mediante mantenimiento técnico de excelencia, potenciado
                            por tecnología de análisis predictivo.
                        </p>

                        <div className={styles.ctaWrapper}>
                            <a href="#nosotros" className={styles.ctaPrimary}>
                                Conoce Nuestra Experiencia
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={styles.ctaIcon}
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>
                            <a href="#experiencia" className={styles.ctaSecondary}>
                                Nuestros Proyectos
                            </a>
                        </div>

                        {/* Stats Bar */}
                        <div className={styles.statsWrapper}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>+1</span>
                                <span className={styles.statLabel}>Años de Experiencia</span>
                            </div>
                            <div className={styles.statDivider}></div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>4</span>
                                <span className={styles.statLabel}>Autopistas Principales</span>
                            </div>
                            <div className={styles.statDivider}></div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>24/7</span>
                                <span className={styles.statLabel}>Operación Continua</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default HeroSection;
