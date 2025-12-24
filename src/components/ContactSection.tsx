'use client';

import { Container, Row, Col, Form } from 'react-bootstrap';
import { FaEnvelope, FaUser, FaTag, FaComment, FaPaperPlane } from 'react-icons/fa';
import styles from './ContactSection.module.css';

const ContactSection = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Backend logic will be implemented here
        console.log('Form submitted');
    };

    return (
        <section id="contacto" className={styles.section}>
            <Container>
                <Row className="justify-content-center">
                    <Col lg={10} xl={8}>
                        {/* Section Header */}
                        <div className="text-center mb-5">
                            <span className={styles.sectionTag}>Contacto</span>
                            <h2 className={styles.sectionTitle}>
                                Hablemos de tu <span className="text-gradient">Proyecto</span>
                            </h2>
                            <p className={styles.sectionSubtitle}>
                                ¿Interesado en nuestras soluciones de IA para infraestructura vial?
                                Estamos aquí para ayudarte a transformar tu gestión de carreteras.
                            </p>
                        </div>

                        {/* Contact Form Card */}
                        <div className={styles.formCard}>
                            <div className={styles.formDecoration}></div>

                            <Form onSubmit={handleSubmit} className={styles.form}>
                                <Row className="g-4">
                                    {/* Name Field */}
                                    <Col md={6}>
                                        <div className={styles.inputGroup}>
                                            <label htmlFor="contact-name" className={styles.label}>
                                                Nombre Completo
                                            </label>
                                            <div className={styles.inputWrapper}>
                                                <FaUser className={styles.inputIcon} />
                                                <input
                                                    type="text"
                                                    id="contact-name"
                                                    name="name"
                                                    placeholder="Tu nombre"
                                                    className={styles.input}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </Col>

                                    {/* Email Field */}
                                    <Col md={6}>
                                        <div className={styles.inputGroup}>
                                            <label htmlFor="contact-email" className={styles.label}>
                                                Correo Electrónico
                                            </label>
                                            <div className={styles.inputWrapper}>
                                                <FaEnvelope className={styles.inputIcon} />
                                                <input
                                                    type="email"
                                                    id="contact-email"
                                                    name="email"
                                                    placeholder="tu@email.com"
                                                    className={styles.input}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </Col>

                                    {/* Subject Field */}
                                    <Col xs={12}>
                                        <div className={styles.inputGroup}>
                                            <label htmlFor="contact-subject" className={styles.label}>
                                                Asunto
                                            </label>
                                            <div className={styles.inputWrapper}>
                                                <FaTag className={styles.inputIcon} />
                                                <input
                                                    type="text"
                                                    id="contact-subject"
                                                    name="subject"
                                                    placeholder="¿En qué podemos ayudarte?"
                                                    className={styles.input}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </Col>

                                    {/* Message Field */}
                                    <Col xs={12}>
                                        <div className={styles.inputGroup}>
                                            <label htmlFor="contact-message" className={styles.label}>
                                                Mensaje
                                            </label>
                                            <div className={styles.textareaWrapper}>
                                                <FaComment className={styles.textareaIcon} />
                                                <textarea
                                                    id="contact-message"
                                                    name="message"
                                                    placeholder="Cuéntanos más sobre tu proyecto o consulta..."
                                                    className={styles.textarea}
                                                    rows={5}
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>
                                    </Col>

                                    {/* Submit Button */}
                                    <Col xs={12} className="text-center">
                                        <button type="submit" className={styles.submitButton}>
                                            <FaPaperPlane className={styles.submitIcon} />
                                            Enviar Mensaje
                                        </button>
                                        <p className={styles.formNote}>
                                            Responderemos a tu consulta en un plazo máximo de 24 horas.
                                        </p>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default ContactSection;
