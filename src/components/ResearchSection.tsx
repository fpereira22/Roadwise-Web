'use client';

import { useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion, useInView } from 'framer-motion';
import {
    FaBrain,
    FaCubes,
    FaShieldAlt,
    FaChartLine,
    FaEye,
    FaExclamationTriangle
} from 'react-icons/fa';
import styles from './ResearchSection.module.css';

// Componente de barra de progreso animada
const AnimatedProgressBar = ({
    value,
    label,
    description,
    delay = 0,
    color = 'orange'
}: {
    value: number;
    label: string;
    description: string;
    delay?: number;
    color?: 'orange' | 'blue' | 'green';
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div ref={ref} className={styles.progressCard}>
            <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>{label}</span>
                <span className={`${styles.progressValue} ${styles[color]}`}>{value}%</span>
            </div>
            <div className={styles.progressBar}>
                <motion.div
                    className={`${styles.progressFill} ${styles[color]}`}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${value}%` } : { width: 0 }}
                    transition={{ duration: 1.5, delay, ease: "easeOut" }}
                />
            </div>
            <p className={styles.progressDescription}>{description}</p>
        </div>
    );
};

// Componente de métrica con animación
const MetricCard = ({
    icon,
    value,
    suffix,
    label,
    description,
    delay = 0
}: {
    icon: React.ReactNode;
    value: string;
    suffix?: string;
    label: string;
    description: string;
    delay?: number;
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            className={styles.metricCard}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay }}
        >
            <div className={styles.metricIcon}>{icon}</div>
            <div className={styles.metricValue}>
                {value}<span className={styles.metricSuffix}>{suffix}</span>
            </div>
            <div className={styles.metricLabel}>{label}</div>
            <p className={styles.metricDescription}>{description}</p>
        </motion.div>
    );
};

const ResearchSection = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const pillars = [
        {
            icon: <FaBrain />,
            title: 'Deep Learning Vial',
            description: 'Procesamiento de imágenes en alta resolución mediante redes neuronales para auditorías automáticas de pavimentos y estructuras.',
            features: ['Detección de grietas', 'Análisis de texturas', 'Clasificación de daños']
        },
        {
            icon: <FaCubes />,
            title: 'Digital Twins',
            description: 'Creación de modelos virtuales de estructuras en la F90 Litoral y Nororiente para simulaciones de carga y deformación.',
            features: ['Modelos 3D precisos', 'Simulación de estrés', 'Predicción de vida útil']
        },
        {
            icon: <FaShieldAlt />,
            title: 'Seguridad Automatizada',
            description: 'Software propietario para la gestión inteligente de segregaciones y protección de cuadrillas en tiempo real.',
            features: ['Alertas automáticas', 'Optimización de rutas', 'Monitoreo 24/7']
        }
    ];

    return (
        <section id="innovacion" className={styles.section} ref={sectionRef}>
            {/* Background decoration */}
            <div className={styles.bgDecoration}></div>

            <Container>
                {/* Section Header */}
                <Row className="justify-content-center mb-5">
                    <Col lg={8} className="text-center">
                        <motion.span
                            className={styles.sectionTag}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5 }}
                        >
                            I+D
                        </motion.span>
                        <motion.h2
                            className={styles.sectionTitle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            Innovación y Desarrollo:{' '}
                            <span className={styles.highlight}>Ingeniería Predictiva</span>
                        </motion.h2>
                        <motion.p
                            className={styles.sectionSubtitle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Transformamos datos de infraestructura en decisiones operativas de alta precisión.
                            Nuestra tecnología mejora significativamente los resultados frente al mantenimiento tradicional.
                        </motion.p>
                    </Col>
                </Row>

                {/* Key Metrics */}
                <Row className="justify-content-center mb-5">
                    <Col lg={10}>
                        <div className={styles.metricsGrid}>
                            <MetricCard
                                icon={<FaEye />}
                                value="+85"
                                suffix="%"
                                label="Velocidad de Detección"
                                description="Incremento en la identificación de grietas y baches vs. inspección manual"
                                delay={0.1}
                            />
                            <MetricCard
                                icon={<FaChartLine />}
                                value="99.2"
                                suffix="%"
                                label="Precisión Predictiva"
                                description="Exactitud en la identificación de fatiga de materiales estructurales"
                                delay={0.2}
                            />
                            <MetricCard
                                icon={<FaExclamationTriangle />}
                                value="-40"
                                suffix="%"
                                label="Reducción de Riesgos"
                                description="Disminución de incidentes en zonas de segregación con nuestras simulaciones"
                                delay={0.3}
                            />
                        </div>
                    </Col>
                </Row>

                {/* Comparison Chart */}
                <Row className="justify-content-center mb-5">
                    <Col lg={10}>
                        <div className={styles.comparisonCard}>
                            <h3 className={styles.comparisonTitle}>
                                Eficiencia Roadwise vs Mantenimiento Tradicional
                            </h3>
                            <div className={styles.comparisonContent}>
                                <div className={styles.comparisonLabels}>
                                    <span className={styles.labelRoadwise}>Roadwise IA</span>
                                    <span className={styles.labelTraditional}>Tradicional</span>
                                </div>

                                <div className={styles.comparisonBars}>
                                    <div className={styles.barGroup}>
                                        <span className={styles.barLabel}>Detección de Patologías</span>
                                        <div className={styles.barContainer}>
                                            <AnimatedProgressBar
                                                value={95}
                                                label=""
                                                description=""
                                                delay={0.2}
                                                color="orange"
                                            />
                                            <div className={styles.traditionalBar} style={{ width: '52%' }}></div>
                                        </div>
                                    </div>

                                    <div className={styles.barGroup}>
                                        <span className={styles.barLabel}>Tiempo de Respuesta</span>
                                        <div className={styles.barContainer}>
                                            <AnimatedProgressBar
                                                value={88}
                                                label=""
                                                description=""
                                                delay={0.4}
                                                color="orange"
                                            />
                                            <div className={styles.traditionalBar} style={{ width: '35%' }}></div>
                                        </div>
                                    </div>

                                    <div className={styles.barGroup}>
                                        <span className={styles.barLabel}>Precisión Diagnóstica</span>
                                        <div className={styles.barContainer}>
                                            <AnimatedProgressBar
                                                value={99}
                                                label=""
                                                description=""
                                                delay={0.6}
                                                color="orange"
                                            />
                                            <div className={styles.traditionalBar} style={{ width: '68%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Technology Pillars */}
                <Row className="mt-5 pt-4">
                    <Col xs={12} className="text-center mb-4">
                        <h3 className={styles.pillarsTitle}>Pilares Tecnológicos</h3>
                        <p className={styles.pillarsSubtitle}>
                            Nuestras áreas de investigación que impulsan la innovación en infraestructura vial
                        </p>
                    </Col>
                    {pillars.map((pillar, index) => (
                        <Col lg={4} key={index} className="mb-4">
                            <motion.div
                                className={styles.pillarCard}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                            >
                                <div className={styles.pillarIcon}>{pillar.icon}</div>
                                <h4 className={styles.pillarTitle}>{pillar.title}</h4>
                                <p className={styles.pillarDescription}>{pillar.description}</p>
                                <ul className={styles.pillarFeatures}>
                                    {pillar.features.map((feature, idx) => (
                                        <li key={idx}>{feature}</li>
                                    ))}
                                </ul>
                            </motion.div>
                        </Col>
                    ))}
                </Row>

                {/* CTA */}
                <Row className="mt-5">
                    <Col className="text-center">
                        <motion.div
                            className={styles.ctaBox}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <h3 className={styles.ctaTitle}>¿Interesado en nuestra tecnología?</h3>
                            <p className={styles.ctaText}>
                                Colaboramos con concesionarias y organismos públicos para implementar
                                soluciones de mantenimiento predictivo.
                            </p>
                            <a href="#contacto" className={styles.ctaButton}>
                                Solicitar Demo Técnica
                            </a>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default ResearchSection;
