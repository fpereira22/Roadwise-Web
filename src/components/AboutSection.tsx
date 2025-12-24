'use client';

import { Container, Row, Col } from 'react-bootstrap';
import {
    FaHardHat,
    FaShieldAlt,
    FaChartLine,
    FaRoad,
    FaBrain,
    FaCogs,
    FaCheckCircle,
    FaEye
} from 'react-icons/fa';
import styles from './AboutSection.module.css';

const AboutSection = () => {
    const missionPoints = [
        {
            icon: <FaHardHat />,
            title: 'Mantenimiento de Excelencia',
            description: 'Intervenciones técnicas de alto estándar en estructuras, pavimentos y señalización.'
        },
        {
            icon: <FaShieldAlt />,
            title: 'Seguridad Operativa',
            description: 'Segregaciones y protocolos que priorizan la seguridad de usuarios y trabajadores.'
        },
        {
            icon: <FaBrain />,
            title: 'Análisis Predictivo',
            description: 'IA que detecta fallas estructurales antes de que se conviertan en problemas críticos.'
        }
    ];

    const visionPoints = [
        {
            icon: <FaRoad />,
            title: 'Infraestructura Inteligente',
            description: 'Transformar el mantenimiento tradicional en operaciones automatizadas y eficientes.'
        },
        {
            icon: <FaChartLine />,
            title: 'Datos para Decisiones',
            description: 'Convertir información de terreno en estrategias de intervención óptimas.'
        },
        {
            icon: <FaCogs />,
            title: 'Optimización Continua',
            description: 'Mejorar constantemente la eficiencia operativa y la vida útil de las estructuras.'
        }
    ];

    const capabilities = [
        ' Mantención de estructuras viales',
        ' Inspección y diagnóstico de pavimentos',
        ' Segregaciones y demarcaciones',
        ' Señalización horizontal y vertical',
        ' Barreras de contención',
        ' Monitoreo con tecnología IA'
    ];

    return (
        <section id="nosotros" className={styles.section}>
            <Container className={styles.content}>
                {/* Section Header */}
                <Row className="justify-content-center mb-5">
                    <Col lg={8} className="text-center">
                        <span className={styles.sectionTag}>Quiénes Somos</span>
                        <h2 className={styles.sectionTitle}>
                            Expertos en <span className="text-gradient">Infraestructura Vial</span> con Tecnología de Vanguardia
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            Somos especialistas en mantención de autopistas con más de 15 años de experiencia.
                            Utilizamos inteligencia artificial como herramienta para hacer lo que mejor sabemos:
                            mantener las carreteras seguras y operativas.
                        </p>
                    </Col>
                </Row>

                {/* Mission & Vision Cards */}
                <Row className="g-4 g-lg-5">
                    {/* Mission Card */}
                    <Col lg={6}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" className={styles.iconSvg}>
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                                    </svg>
                                </div>
                                <h3 className={styles.cardTitle}>Nuestra Misión</h3>
                            </div>

                            <p className={styles.cardDescription}>
                                Garantizar la <strong>continuidad operativa</strong> y la <strong>seguridad</strong> de
                                las autopistas más importantes de Chile mediante un mantenimiento técnico de
                                excelencia, potenciado por análisis predictivo e inteligencia artificial.
                            </p>

                            <div className={styles.pointsList}>
                                {missionPoints.map((point, index) => (
                                    <div key={index} className={styles.point}>
                                        <div className={styles.pointIcon}>{point.icon}</div>
                                        <div className={styles.pointContent}>
                                            <h4 className={styles.pointTitle}>{point.title}</h4>
                                            <p className={styles.pointDescription}>{point.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>

                    {/* Vision Card */}
                    <Col lg={6}>
                        <div className={`${styles.card} ${styles.cardDark}`}>
                            <div className={styles.cardHeader}>
                                <div className={`${styles.cardIcon} ${styles.cardIconLight}`}>
                                    <FaEye size={28} />
                                </div>
                                <h3 className={`${styles.cardTitle} ${styles.cardTitleLight}`}>Nuestra Visión</h3>
                            </div>

                            <p className={`${styles.cardDescription} ${styles.cardDescriptionLight}`}>
                                Ser el <strong>referente regional</strong> en gestión de infraestructura vial,
                                transformando el mantenimiento tradicional en una operación <strong>inteligente,
                                    eficiente y automatizada</strong> que establezca nuevos estándares en la industria.
                            </p>

                            <div className={styles.pointsList}>
                                {visionPoints.map((point, index) => (
                                    <div key={index} className={`${styles.point} ${styles.pointLight}`}>
                                        <div className={`${styles.pointIcon} ${styles.pointIconLight}`}>{point.icon}</div>
                                        <div className={styles.pointContent}>
                                            <h4 className={`${styles.pointTitle} ${styles.pointTitleLight}`}>{point.title}</h4>
                                            <p className={`${styles.pointDescription} ${styles.pointDescriptionLight}`}>{point.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.cardDecoration}></div>
                        </div>
                    </Col>
                </Row>

                {/* Capabilities */}
                <Row className="mt-5 pt-4">
                    <Col className="text-center">
                        <p className={styles.techLabel}>Nuestras Capacidades</p>
                        <div className={styles.techTags}>
                            {capabilities.map((cap, index) => (
                                <span key={index} className={styles.techTag}>
                                    <FaCheckCircle className={styles.tagIcon} />
                                    {cap}
                                </span>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default AboutSection;
