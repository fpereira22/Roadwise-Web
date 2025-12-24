'use client';

import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import {
    FaLinkedinIn,
    FaInstagram,
    FaEnvelope,
    FaArrowUp,
    FaExternalLinkAlt
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import styles from './Footer.module.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { href: '#inicio', label: 'Inicio' },
        { href: '#nosotros', label: 'Nosotros' },
        { href: '#experiencia', label: 'Experiencia' },
        { href: '#contacto', label: 'Contacto' },
    ];

    const socialLinks = [
        { icon: <FaLinkedinIn />, href: 'https://www.linkedin.com/company/soc-servicios-generales-ltda', label: 'LinkedIn' },
        { icon: <FaXTwitter />, href: 'https://x.com/roadwise', label: 'X (Twitter)' },
        { icon: <FaInstagram />, href: 'https://instagram.com/roadwise', label: 'Instagram' },
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className={styles.footer}>
            {/* Main Footer Content */}
            <div className={styles.footerMain}>
                <Container>
                    <Row className="g-4 g-lg-5">
                        {/* Column 1: Logo & Description */}
                        <Col lg={4} md={6}>
                            <div className={styles.brandSection}>
                                <Image
                                    src="/logo-roadwise.jpeg"
                                    alt="Roadwise Logo"
                                    width={160}
                                    height={55}
                                    className={styles.footerLogo}
                                />
                                <p className={styles.brandDescription}>
                                    Impulsamos la transformación digital de la infraestructura vial
                                    mediante soluciones de Inteligencia Artificial de última generación.
                                    La vía del futuro comienza hoy.
                                </p>
                                {/* <div className={styles.tagline}>
                                    <span>La Vía del Futuro</span>
                                </div> */}
                            </div>
                        </Col>

                        {/* Column 2: Quick Links */}
                        <Col lg={2} md={6}>
                            <div className={styles.linksSection}>
                                <h4 className={styles.footerTitle}>Enlaces</h4>
                                <ul className={styles.linksList}>
                                    {quickLinks.map((link) => (
                                        <li key={link.href}>
                                            <a href={link.href} className={styles.footerLink}>
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Col>

                        {/* Column 3: Contact & Social */}
                        <Col lg={3} md={6}>
                            <div className={styles.contactSection}>
                                <h4 className={styles.footerTitle}>Contacto</h4>

                                <div className={styles.contactItem}>
                                    <FaEnvelope className={styles.contactIcon} />
                                    <a href="mailto:contacto@roadwise.cl" className={styles.contactLink}>
                                        contacto@roadwise.cl
                                    </a>
                                </div>

                                <div className={styles.socialWrapper}>
                                    <p className={styles.socialLabel}>Síguenos</p>
                                    <div className={styles.socialLinks}>
                                        {socialLinks.map((social, index) => (
                                            <a
                                                key={index}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.socialLink}
                                                aria-label={social.label}
                                            >
                                                {social.icon}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* Column 4: Others */}
                        <Col lg={3} md={6}>
                            <div className={styles.othersSection}>
                                <h4 className={styles.footerTitle}>Legal</h4>
                                <ul className={styles.linksList}>
                                    <li>
                                        <a href="#" className={styles.footerLink}>
                                            Centro de Denuncias
                                            <FaExternalLinkAlt className={styles.externalIcon} />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className={styles.footerLink}>
                                            Política de Privacidad
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className={styles.footerLink}>
                                            Términos de Uso
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Bottom Bar */}
            <div className={styles.footerBottom}>
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <p className={styles.copyright}>
                                © {currentYear} Roadwise. Todos los derechos reservados.
                            </p>
                        </Col>
                        <Col md={6}>
                            <p className={styles.credits}>
                                Desarrollado por{' '}
                                <span className={styles.creditsHighlight}>Felipe Pereira</span>
                                {' '}- Departamento I+D Roadwise
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Scroll to Top Button */}
            <button
                className={styles.scrollToTop}
                onClick={scrollToTop}
                aria-label="Volver arriba"
            >
                <FaArrowUp />
            </button>
        </footer>
    );
};

export default Footer;
