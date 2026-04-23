'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { FaChartLine, FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';
import styles from './Presentation.module.css';

export default function PresentationPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const totalSlides = 14;

    const goToSlide = useCallback((index: number) => {
        if (isAnimating) return;
        if (index >= 0 && index < totalSlides) {
            setIsAnimating(true);
            setCurrentSlide(index);
            setTimeout(() => setIsAnimating(false), 500);
        }
    }, [isAnimating]);

    const nextSlide = useCallback(() => {
        goToSlide(currentSlide + 1);
    }, [currentSlide, goToSlide]);

    const prevSlide = useCallback(() => {
        goToSlide(currentSlide - 1);
    }, [currentSlide, goToSlide]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    nextSlide();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    goToSlide(totalSlides - 1);
                    break;
                case 'f':
                case 'F':
                    toggleFullscreen();
                    break;
                case 'Escape':
                    if (isFullscreen) {
                        document.exitFullscreen?.();
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide, goToSlide, isFullscreen]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen?.();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const renderSlide = () => {
        switch (currentSlide) {
            // ========== DIAPOSITIVA 1: TÍTULO ==========
            case 0:
                return (
                    <div className={styles.slideContent}>
                        <div className={styles.splitLayout}>
                            <div className={styles.leftContent}>
                                <div className={styles.logoSmall}>
                                    <Image src="/presentation/image5.png" alt="Roadwise" width={180} height={80} />
                                </div>
                                <h1 className={styles.heroTitle}>
                                    Inspección Vial Inteligente:<br />
                                    <span className={styles.highlight}>Automatización y Precisión con IA</span>
                                </h1>
                                <p className={styles.department}>Departamento de Innovación y Desarrollo - Roadwise LTDA</p>
                                <div className={styles.authorsBadge}>
                                    Martín Cortés O.
                                </div>
                            </div>
                            <div className={styles.rightImage}>
                                <Image
                                    src="/presentation/image4.png"
                                    alt="Vehículo de inspección"
                                    width={500}
                                    height={600}
                                    className={styles.heroImage}
                                />
                            </div>
                        </div>
                    </div>
                );

            // ========== DIAPOSITIVA 2: EL DESAFÍO ==========
            case 1:
                return (
                    <div className={styles.slideContent}>
                        <div className={styles.splitLayout}>
                            <div className={styles.leftContent}>
                                <span className={styles.badge}>EL DESAFÍO</span>
                                <h2 className={styles.slideTitle}>
                                    Limitaciones Críticas de la<br />Inspección Manual
                                </h2>
                                <div className={styles.challengeItems}>
                                    <div className={styles.challengeItem}>
                                        <div className={styles.challengeBox}>
                                            <span>Lentitud Operativa</span>
                                            <Image src="/presentation/image35.png" alt="" width={40} height={40} className={styles.iconWhite} />
                                        </div>
                                    </div>
                                    <div className={styles.challengeItem}>
                                        <div className={styles.challengeBox}>
                                            <span>Cobertura Limitada</span>
                                            <Image src="/presentation/image33.png" alt="" width={40} height={40} className={styles.iconWhite} />
                                        </div>
                                    </div>
                                    <div className={styles.challengeItem}>
                                        <div className={styles.challengeBox}>
                                            <span>Baja Trazabilidad</span>
                                            <Image src="/presentation/image44.png" alt="" width={40} height={40} className={styles.iconWhite} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.rightImage}>
                                <Image
                                    src="/presentation/image6.png"
                                    alt="Inspección manual"
                                    width={450}
                                    height={550}
                                    className={styles.slideImage}
                                />
                            </div>
                        </div>
                        <div className={styles.slideNumber}>1</div>
                    </div>
                );

            // ========== DIAPOSITIVA 3: TRANSFORMACIÓN DIGITAL ==========
            case 2:
                return (
                    <div className={styles.slideContent}>
                        <h2 className={styles.slideTitle}>Transformación Digital: De lo Subjetivo a lo Objetivo</h2>
                        <h3 className={styles.subtitle}>El Contraste Revolucionario</h3>
                        <div className={styles.transformationContent}>
                            <p className={styles.description}>
                                El sistema convierte horas de revisión visual humana en <span className={styles.highlightGreen}>procesamiento automatizado</span>,
                                permitiendo que los equipos técnicos se enfoquen en la toma de decisiones estratégicas en lugar de tareas repetitivas.
                            </p>
                            <div className={styles.transformationImage}>
                                <Image
                                    src="/presentation/image11.png"
                                    alt="Transformación digital"
                                    width={800}
                                    height={350}
                                    className={styles.fullImage}
                                />
                            </div>
                        </div>
                        <div className={styles.slideNumber}>2</div>
                    </div>
                );

            // ========== DIAPOSITIVA 4: NUESTRA SOLUCIÓN ==========
            case 3:
                return (
                    <div className={styles.slideContent}>
                        <div className={styles.splitLayoutSolution}>
                            <div className={styles.solutionImage}>
                                <Image
                                    src="/presentation/image12.png"
                                    alt="IA en acción"
                                    width={550}
                                    height={400}
                                    className={styles.detectionImage}
                                />
                            </div>
                            <div className={styles.solutionContent}>
                                <h2 className={styles.slideTitle}>Nuestra Solución: Visión por Computadora e IA</h2>
                                <div className={styles.stepsContainer}>
                                    <div className={styles.step}>
                                        <span className={styles.stepNumber}>1</span>
                                        <div className={styles.stepContent}>
                                            <h4>Captura en Terreno</h4>
                                        </div>
                                    </div>
                                    <div className={styles.step}>
                                        <span className={styles.stepNumber}>2</span>
                                        <div className={styles.stepContent}>
                                            <h4>Análisis Inteligente</h4>
                                        </div>
                                    </div>
                                    <div className={styles.step}>
                                        <span className={styles.stepNumber}>3</span>
                                        <div className={styles.stepContent}>
                                            <h4>Resultados Precisos</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.benefitBox}>
                                    <strong>Beneficio clave:</strong> Lo que antes requería días de inspección manual ahora se procesa en horas,
                                    con niveles de precisión superiores y documentación exhaustiva de cada hallazgo.
                                </div>
                            </div>
                        </div>
                        <div className={styles.slideNumber}>3</div>
                    </div>
                );

            // ========== DIAPOSITIVA 5: TACHAS ==========
            case 4:
                return (
                    <div className={styles.slideContent}>
                        <h2 className={styles.slideTitle}>Detección de Elementos Físicos</h2>
                        <p className={styles.description}>
                            El sistema identifica automáticamente elementos críticos de seguridad vial en tiempo real,
                            generando inventarios completos y geolocalizados de la infraestructura existente.
                        </p>
                        <h3 className={styles.elementSubtitle}>Tachas</h3>
                        <div className={styles.detectionGrid}>
                            <div className={styles.detectionCard}>
                                <Image
                                    src="/presentation/image16.png"
                                    alt="Tacha detectada"
                                    width={300}
                                    height={250}
                                    className={styles.detectionPhoto}
                                />
                            </div>
                            <div className={styles.detectionCardLarge}>
                                <Image
                                    src="/presentation/image17.gif"
                                    alt="Detección de tachas en tiempo real"
                                    width={550}
                                    height={350}
                                    className={styles.gifImage}
                                    unoptimized
                                />
                            </div>
                        </div>
                        <div className={styles.slideNumber}>4</div>
                    </div>
                );

            // ========== DIAPOSITIVA 6: CAPTAFAROS ==========
            case 5:
                return (
                    <div className={styles.slideContent}>
                        <h2 className={styles.slideTitle}>Detección de Elementos Físicos</h2>
                        <p className={styles.description}>
                            El sistema identifica automáticamente elementos críticos de seguridad vial en tiempo real,
                            generando inventarios completos y geolocalizados de la infraestructura existente.
                        </p>
                        <h3 className={styles.elementSubtitle}>Captafaros</h3>
                        <div className={styles.detectionGrid}>
                            <div className={styles.detectionCard}>
                                <Image
                                    src="/presentation/image18.png"
                                    alt="Captafaro detectado"
                                    width={300}
                                    height={250}
                                    className={styles.detectionPhoto}
                                />
                            </div>
                            <div className={styles.detectionCardLarge}>
                                <Image
                                    src="/presentation/image19.gif"
                                    alt="Detección de captafaros en tiempo real"
                                    width={550}
                                    height={350}
                                    className={styles.gifImage}
                                    unoptimized
                                />
                            </div>
                        </div>
                        <div className={styles.slideNumber}>5</div>
                    </div>
                );

            // ========== DIAPOSITIVA 7: BALIZAS PK ==========
            case 6:
                return (
                    <div className={styles.slideContent}>
                        <h2 className={styles.slideTitle}>Detección de Elementos Físicos</h2>
                        <p className={styles.description}>
                            El sistema identifica automáticamente elementos críticos de seguridad vial en tiempo real,
                            generando inventarios completos y geolocalizados de la infraestructura existente.
                        </p>
                        <h3 className={styles.elementSubtitle}>Balizas PK</h3>
                        <div className={styles.detectionGrid}>
                            <div className={styles.detectionCard}>
                                <Image
                                    src="/presentation/image20.png"
                                    alt="Baliza PK detectada"
                                    width={300}
                                    height={250}
                                    className={styles.detectionPhoto}
                                />
                            </div>
                            <div className={styles.detectionCardLarge}>
                                <Image
                                    src="/presentation/image21.gif"
                                    alt="Detección de balizas en tiempo real"
                                    width={550}
                                    height={350}
                                    className={styles.gifImage}
                                    unoptimized
                                />
                            </div>
                        </div>
                        <div className={styles.slideNumber}>6</div>
                    </div>
                );

            // ========== DIAPOSITIVA 8: INVENTARIO DE SEÑALIZACIONES ==========
            case 7:
                return (
                    <div className={styles.slideContent}>
                        <h2 className={styles.slideTitle}>Inventario Completo de Señalizaciones</h2>
                        <p className={styles.description}>
                            Nuestro modelo detecta con alta precisión las señales de tránsito más relevantes para la
                            operación y seguridad vial, creando un catálogo digital completo de la señalización existente.
                        </p>
                        <div className={styles.signalsGrid}>
                            <div className={styles.signalCard}>
                                <Image src="/presentation/image22.png" alt="Señal curva" width={150} height={150} />
                            </div>
                            <div className={styles.signalCard}>
                                <Image src="/presentation/image23.png" alt="Señal SOS" width={150} height={150} />
                            </div>
                            <div className={styles.signalCard}>
                                <Image src="/presentation/image24.png" alt="Señal 100m" width={150} height={150} />
                            </div>
                            <div className={styles.signalCard}>
                                <Image src="/presentation/image26.png" alt="Señal dirección" width={150} height={150} />
                            </div>
                            <div className={styles.signalCard}>
                                <Image src="/presentation/image27.png" alt="Señal estrechamiento" width={150} height={150} />
                            </div>
                            <div className={styles.signalCard}>
                                <Image src="/presentation/image25.png" alt="Señal salida" width={150} height={150} />
                            </div>
                        </div>
                        <div className={styles.slideNumber}>7</div>
                    </div>
                );

            // ========== DIAPOSITIVA 9: DETERIOROS ==========
            case 8:
                return (
                    <div className={styles.slideContent}>
                        <span className={styles.badgeMaintenance}>⚠ MANTENIMIENTO PREVENTIVO</span>
                        <h2 className={styles.slideTitle}>Detección Automática de Deterioros en Infraestructura</h2>
                        <div className={styles.deteriorationGrid}>
                            <div className={styles.deteriorationSection}>
                                <h4>Pavimento</h4>
                                <p>Identificación automática de <strong>fisuras y grietas</strong> para intervenir de manera preventiva y reducir costos de reparación.</p>
                                <div className={styles.deteriorationImage}>
                                    <Image
                                        src="/presentation/image31.gif"
                                        alt="Detección de fisuras en pavimento"
                                        width={350}
                                        height={200}
                                        unoptimized
                                    />
                                </div>
                            </div>
                            <div className={styles.deteriorationSection}>
                                <h4>Barreras de Contención</h4>
                                <p>Detección precisa de <strong>fisuras y daños en barreras tipo New Jersey</strong>, asegurando mantenimiento oportuno y mayor seguridad vial.</p>
                                <div className={styles.deteriorationImage}>
                                    <Image
                                        src="/presentation/image32.gif"
                                        alt="Detección de daños en barreras"
                                        width={350}
                                        height={200}
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.advantageBox}>
                            <strong>💡 Ventaja estratégica:</strong> La detección temprana reduce costos de reparación hasta en un 70% comparado con intervenciones reactivas.
                        </div>
                        <div className={styles.slideNumber}>8</div>
                    </div>
                );

            // ========== DIAPOSITIVA 10: RESULTADOS ==========
            case 9:
                return (
                    <div className={styles.slideContent}>
                        <h2 className={styles.slideTitle}>Resultados y Ventaja Competitiva</h2>
                        <div className={styles.resultsGrid}>
                            <div className={styles.resultCard}>
                                <Image src="/presentation/image36.png" alt="" width={60} height={60} className={styles.iconWhite} />
                                <span className={styles.resultLabel}>Aumento en la Cobertura</span>
                            </div>
                            <div className={styles.resultCard}>
                                <div className={styles.resultIcons}>
                                    <Image src="/presentation/image37.png" alt="" width={50} height={50} className={styles.iconWhite} />
                                    <span className={styles.crossIcon}>✕</span>
                                    <Image src="/presentation/image38.png" alt="" width={50} height={50} className={styles.iconWhite} />
                                    <Image src="/presentation/image39.png" alt="" width={50} height={50} className={styles.iconWhite} />
                                </div>
                                <span className={styles.resultLabel}>Disminución de Error Humano</span>
                            </div>
                            <div className={styles.resultCard}>
                                <span className={styles.bigNumber}>100%</span>
                                <span className={styles.resultLabel}>Datos Objetivos</span>
                            </div>
                        </div>
                        <div className={styles.quoteBox}>
                            <p>&ldquo;Transformamos la inspección vial de un proceso manual y subjetivo a un sistema automatizado, preciso y escalable que revoluciona la gestión de infraestructura.&rdquo;</p>
                        </div>
                        <div className={styles.slideNumber}>9</div>
                    </div>
                );

            // ========== DIAPOSITIVA 11: MAPEO GEORREFERENCIADO ==========
            case 10:
                return (
                    <div className={styles.slideContent}>
                        <h2 className={styles.slideTitle}>Generación de Mapeo Georreferenciado</h2>
                        <div className={styles.mappingLayout}>
                            <div className={styles.mappingText}>
                                <p>Generación de un mapa de elementos detectados y faltantes georreferenciados por tramos y global</p>
                                <p>Información de cada punto con Imagen, Ubicación y métricas restantes.</p>
                            </div>
                            <div className={styles.mappingImage}>
                                <Image
                                    src="/presentation/image41.png"
                                    alt="Mapa georreferenciado"
                                    width={700}
                                    height={450}
                                    className={styles.mapImage}
                                />
                            </div>
                        </div>
                        <div className={styles.slideNumber}>10</div>
                    </div>
                );

            // ========== DIAPOSITIVA 12: FUTURAS IMPLEMENTACIONES ==========
            case 11:
                return (
                    <div className={styles.slideContent}>
                        <span className={styles.badgeDev}>⚠ EN DESARROLLO</span>
                        <h2 className={styles.slideTitle}>Futuras Implementaciones</h2>
                        <div className={styles.futureGrid}>
                            <div className={styles.futureCard}>
                                <h4>Líneas de Demarcación</h4>
                                <Image
                                    src="/presentation/image42.png"
                                    alt="Líneas de demarcación"
                                    width={400}
                                    height={200}
                                    className={styles.futureImage}
                                />
                            </div>
                            <div className={styles.futureCard}>
                                <h4>Información en calzada</h4>
                                <Image
                                    src="/presentation/image43.png"
                                    alt="Información en calzada"
                                    width={400}
                                    height={200}
                                    className={styles.futureImage}
                                />
                            </div>
                        </div>
                        <div className={styles.slideNumber}>11</div>
                    </div>
                );

            // ========== DIAPOSITIVA 13: APOYO ESTRATÉGICO ==========
            case 12:
                return (
                    <div className={styles.slideContent}>
                        <h2 className={styles.slideTitle}>Apoyo Estratégico para la Toma de Decisiones</h2>
                        <div className={styles.strategicGrid}>
                            <div className={styles.strategicCard}>
                                <div className={styles.strategicIcon}>
                                    <FaChartLine />
                                </div>
                                <h4>Planificación Basada en Datos</h4>
                                <p>Programación de mantenciones preventivas con información objetiva sobre el estado real de la infraestructura, optimizando recursos y presupuestos.</p>
                            </div>
                            <div className={styles.strategicCard}>
                                <div className={styles.strategicIcon}>
                                    <FaExclamationTriangle />
                                </div>
                                <h4>Priorización Inteligente</h4>
                                <p>Identificación automática de tramos críticos que requieren atención inmediata, eliminando la estimación subjetiva y reduciendo riesgos operacionales.</p>
                            </div>
                            <div className={styles.strategicCard}>
                                <div className={styles.strategicIcon}>
                                    <FaShieldAlt />
                                </div>
                                <h4>Seguridad Garantizada</h4>
                                <p>Monitoreo continuo del estado de elementos de seguridad vial, asegurando el cumplimiento normativo y protección de los usuarios.</p>
                            </div>
                        </div>
                        <div className={styles.slideNumber}>12</div>
                    </div>
                );

            // ========== DIAPOSITIVA 14: CONTACTO ==========
            case 13:
                return (
                    <div className={styles.slideContent}>
                        <div className={styles.closingLayout}>
                            <div className={styles.closingImage}>
                                <Image
                                    src="/presentation/image50.png"
                                    alt="Autopista Santiago"
                                    width={500}
                                    height={280}
                                    className={styles.cityImage}
                                />
                            </div>
                            <div className={styles.closingContact}>
                                <span className={styles.contactBadge}>📧 CONTACTO</span>
                                <h3>Martín Cortés</h3>
                                <p className={styles.email}>roadwise.limitada@gmail.com</p>
                                <p className={styles.website}>https://roadwise.cl/</p>
                            </div>
                        </div>
                        <div className={styles.closingFooter}>
                            <h2 className={styles.closingTitle}>El Futuro de la Inspección Vial Está Aquí</h2>
                            <p className={styles.closingDepartment}>Departamento de Innovación y Desarrollo – Roadwise LTDA.</p>
                            <p className={styles.closingTagline}>Tecnología operativa y probada, lista para transformar su gestión de infraestructura vial.</p>
                            <div className={styles.closingLogo}>
                                <Image src="/presentation/image5.png" alt="Roadwise" width={200} height={90} />
                            </div>
                        </div>
                        <div className={styles.slideNumber}>13</div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={styles.presentationContainer}>
            {/* Background */}
            {/* Background */}
            <div className={styles.backgroundOverlay}></div>

            {/* Progress Bar */}
            <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
                />
            </div>

            {/* Slide Counter */}
            <div className={styles.slideCounter}>
                {currentSlide + 1} / {totalSlides}
            </div>

            {/* Main Slide Area */}
            <div className={styles.slideWrapper}>
                <div className={`${styles.slide} ${isAnimating ? styles.animating : ''}`} key={currentSlide}>
                    {renderSlide()}
                </div>
            </div>

            {/* Navigation Controls */}
            <div className={styles.controls}>
                <button
                    className={styles.navButton}
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    aria-label="Diapositiva anterior"
                >
                    ‹
                </button>

                <div className={styles.slideIndicators}>
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Ir a diapositiva ${index + 1}`}
                        />
                    ))}
                </div>

                <button
                    className={styles.navButton}
                    onClick={nextSlide}
                    disabled={currentSlide === totalSlides - 1}
                    aria-label="Siguiente diapositiva"
                >
                    ›
                </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
                className={styles.fullscreenButton}
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
                {isFullscreen ? '⛶' : '⛶'}
            </button>

            {/* Keyboard Hints */}
            <div className={styles.keyboardHints}>
                <span>← → Navegar</span>
                <span>F Pantalla completa</span>
            </div>
        </div>
    );
}
