'use client';

import { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Image from 'next/image';
import styles from './Header.module.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setExpanded(false);
  };

  const navLinks = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#nosotros', label: 'Nosotros' },
    { href: '#experiencia', label: 'Experiencia' },
    { href: '#contacto', label: 'Contacto' },
  ];

  return (
    <Navbar
      expand="lg"
      fixed="top"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
    >
      <Container>
        <Navbar.Brand href="#inicio" className={styles.brand}>
          <Image
            src="/logo-roadwise.jpeg"
            alt="Roadwise Logo"
            width={150}
            height={50}
            className={styles.logo}
            priority
          />
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="main-navbar" 
          className={styles.toggler}
        >
          <span className={styles.togglerIcon}></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            {navLinks.map((link) => (
              <Nav.Link
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className={styles.navLink}
              >
                {link.label}
              </Nav.Link>
            ))}
            <Nav.Link 
              href="#contacto" 
              onClick={handleNavClick}
              className={styles.ctaButton}
            >
              Contáctanos
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
