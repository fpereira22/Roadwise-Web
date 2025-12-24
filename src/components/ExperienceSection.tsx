'use client';

import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
    FaMapMarkerAlt,
    FaRoad,
    FaShieldAlt,
    FaHardHat,
    FaCheckCircle,
    FaArrowRight
} from 'react-icons/fa';
import styles from './ExperienceSection.module.css';

const ExperienceSection = () => {
    // Terminal animation states
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [animationPhase, setAnimationPhase] = useState<'idle' | 'typing' | 'executing' | 'complete'>('idle');
    const [typedCommand, setTypedCommand] = useState('');
    const terminalRef = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    const command = './cargar_mapa_proyectos.sh';

    // Intersection Observer para detectar cuando el terminal es visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        hasAnimated.current = true;
                        startTerminalAnimation();
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (terminalRef.current) {
            observer.observe(terminalRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Animación de escritura del comando
    const startTerminalAnimation = () => {
        setAnimationPhase('typing');
        let currentIndex = 0;

        const typeInterval = setInterval(() => {
            if (currentIndex <= command.length) {
                setTypedCommand(command.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typeInterval);
                // Pausa antes de "ejecutar"
                setTimeout(() => {
                    setAnimationPhase('executing');
                    // Simular tiempo de carga
                    setTimeout(() => {
                        setAnimationPhase('complete');
                        setIsMapVisible(true);
                    }, 800);
                }, 300);
            }
        }, 50);
    };

    // Proyectos principales en autopistas reales
    const projects = [
        {
            name: 'Costanera Norte',
            type: 'Autopista Urbana',
            description: 'Mantención integral de estructuras, túneles y viaductos en una de las arterias viales más críticas de Santiago.',
            services: ['Estructuras', 'Túneles', 'Señalización'],
            highlight: true
        },
        {
            name: 'Autopista Nororiente',
            type: 'Autopista Concesionada',
            description: 'Operaciones de mantención preventiva y correctiva en la conexión noreste de la capital.',
            services: ['Pavimentos', 'Barreras', 'Demarcaciones'],
            highlight: false
        },
        {
            name: 'Vespucio Sur',
            type: 'Autopista Urbana',
            description: 'Gestión de mantención de infraestructura y sistemas de seguridad vial en el anillo sur de Santiago.',
            services: ['Estructuras', 'Segregaciones', 'Iluminación'],
            highlight: true
        },
        {
            name: 'F90 Litoral Central',
            type: 'Ruta Interurbana',
            description: 'Mantención de la ruta costera que conecta Valparaíso con San Antonio, con énfasis en seguridad operativa.',
            services: ['Pavimentos', 'Señalización', 'Contención'],
            highlight: false
        }
    ];

    const stats = [
        {
            icon: <FaRoad />,
            value: '+200',
            label: 'Kilómetros',
            description: 'Bajo mantención activa'
        },
        {
            icon: <FaHardHat />,
            value: '4',
            label: 'Autopistas',
            description: 'Principales de Chile'
        },
        {
            icon: <FaShieldAlt />,
            value: '24/7',
            label: 'Operación',
            description: 'Respuesta continua'
        }
    ];

    const specialties = [
        {
            title: 'Mantención de Estructuras',
            description: 'Puentes, viaductos, túneles y obras de arte. Inspección, diagnóstico y reparación con los más altos estándares técnicos.',
            icon: <FaHardHat />
        },
        {
            title: 'Segregaciones y Seguridad',
            description: 'Implementación de zonas de trabajo seguras, señalización temporal y protocolos que protegen a usuarios y operarios.',
            icon: <FaShieldAlt />
        },
        {
            title: 'Monitoreo Inteligente',
            description: 'Tecnología de IA para detectar deterioros, analizar pavimentos y optimizar las intervenciones de mantención.',
            icon: <FaCheckCircle />
        }
    ];

    return (
        <section id="experiencia" className={styles.section}>
            <Container>
                {/* Section Header */}
                <Row className="justify-content-center mb-5">
                    <Col lg={8} className="text-center">
                        <span className={styles.sectionTag}>Experiencia</span>
                        <h2 className={styles.sectionTitle}>
                            Presencia en las <span className="text-gradient">Autopistas más Importantes</span> de Chile
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            Nuestra experiencia no es teórica. Se ve en las calles, en los túneles y en
                            cada kilómetro de las principales autopistas del país.
                        </p>
                    </Col>
                </Row>

                {/* Stats Row */}
                <Row className="justify-content-center mb-5">
                    <Col lg={10}>
                        <div className={styles.statsContainer}>
                            {stats.map((stat, index) => (
                                <div key={index} className={styles.statCard}>
                                    <div className={styles.statIcon}>{stat.icon}</div>
                                    <div className={styles.statValue}>{stat.value}</div>
                                    <div className={styles.statLabel}>{stat.label}</div>
                                    <div className={styles.statDescription}>{stat.description}</div>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>

                {/* Projects Grid */}
                <Row className="mb-5">
                    <Col xs={12}>
                        <h3 className={styles.projectsTitle}>Nuestros Proyectos Activos</h3>
                    </Col>
                    {projects.map((project, index) => (
                        <Col lg={6} key={index} className="mb-4">
                            <div className={`${styles.projectCard} ${project.highlight ? styles.projectHighlight : ''}`}>
                                <div className={styles.projectHeader}>
                                    <div className={styles.projectIcon}>
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <h4 className={styles.projectName}>{project.name}</h4>
                                        <span className={styles.projectType}>{project.type}</span>
                                    </div>
                                </div>
                                <p className={styles.projectDescription}>{project.description}</p>
                                <div className={styles.projectServices}>
                                    {project.services.map((service, idx) => (
                                        <span key={idx} className={styles.serviceTag}>{service}</span>
                                    ))}
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>

                {/* Folium Map Section */}
                <Row className="mt-5">
                    <Col xs={12}>
                        <div className={styles.mapSection}>
                            <h3 className={styles.mapTitle}>
                                <FaMapMarkerAlt className={styles.mapTitleIcon} />
                                Mapa de Proyectos
                            </h3>
                            <p className={styles.mapSubtitle}>
                                Visualiza nuestra presencia y proyectos activos a lo largo de Chile
                            </p>
                            <div className={styles.terminalWindow} ref={terminalRef}>
                                <div className={styles.terminalHeader}>
                                    <div className={styles.terminalButtons}>
                                        <span className={`${styles.terminalButton} ${styles.buttonClose}`}></span>
                                        <span className={`${styles.terminalButton} ${styles.buttonMinimize}`}></span>
                                        <span className={`${styles.terminalButton} ${styles.buttonMaximize}`}></span>
                                    </div>
                                    <div className={styles.terminalTitle}>roadwise@mapa:~/proyectos</div>
                                    <div className={styles.terminalHeaderSpacer}></div>
                                </div>

                                {/* Terminal Body con animación */}
                                {animationPhase !== 'complete' && (
                                    <div className={styles.terminalBody}>
                                        <div className={styles.terminalLine}>
                                            <span className={styles.terminalPrompt}>roadwise@server:~$</span>
                                            <span className={styles.terminalCommand}>{typedCommand}</span>
                                            {animationPhase === 'typing' && (
                                                <span className={styles.terminalCursor}>▌</span>
                                            )}
                                        </div>
                                        {animationPhase === 'executing' && (
                                            <div className={styles.terminalOutput}>
                                                <div className={styles.loadingText}>
                                                    <span className={styles.loadingSpinner}></span>
                                                    Cargando mapa de proyectos...
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Mapa con fade-in */}
                                <div className={`${styles.mapContainer} ${isMapVisible ? styles.mapVisible : styles.mapHidden}`}>
                                    <iframe
                                        src="/map2.html"
                                        title="Mapa de proyectos Roadwise"
                                        className={styles.mapIframe}
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Specialties */}
                <Row className="mt-5 pt-4">
                    <Col xs={12} className="mb-4">
                        <h3 className={styles.specialtiesTitle}>Áreas de Especialización</h3>
                    </Col>
                    {specialties.map((specialty, index) => (
                        <Col lg={4} key={index} className="mb-4">
                            <div className={styles.specialtyCard}>
                                <div className={styles.specialtyIcon}>{specialty.icon}</div>
                                <h4 className={styles.specialtyTitle}>{specialty.title}</h4>
                                <p className={styles.specialtyDescription}>{specialty.description}</p>
                                <a href="#contacto" className={styles.specialtyLink}>
                                    Más información <FaArrowRight />
                                </a>
                            </div>
                        </Col>
                    ))}
                </Row>

                {/* CTA */}
                <Row className="mt-5">
                    <Col className="text-center">
                        <div className={styles.ctaBox}>
                            <h3 className={styles.ctaTitle}>¿Necesitas mantención especializada?</h3>
                            <p className={styles.ctaText}>
                                Contáctanos para conocer cómo podemos apoyar tus operaciones de infraestructura vial.
                            </p>
                            <a href="#contacto" className={styles.ctaButton}>
                                Solicitar Cotización
                                <FaArrowRight className={styles.ctaIcon} />
                            </a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default ExperienceSection;
