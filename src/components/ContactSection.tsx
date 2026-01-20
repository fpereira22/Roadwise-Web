'use client';

import { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { FaEnvelope, FaUser, FaTag, FaComment, FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import styles from './ContactSection.module.css';

const ContactSection = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('idle');
        setStatusMessage('');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
        };

        const form = e.currentTarget;

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus('success');
                setStatusMessage('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
                // Limpiar el formulario
                form.reset();
            } else {
                setStatus('error');
                setStatusMessage(result.error || 'Hubo un problema al enviar el mensaje. Inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error en el envío:', error);
            setStatus('error');
            setStatusMessage('Error de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
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
                                        <button
                                            type="submit"
                                            className={styles.submitButton}
                                            disabled={isLoading}
                                            style={{ opacity: isLoading ? 0.7 : 1 }}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <FaSpinner className={`${styles.submitIcon} ${styles.spinning}`} />
                                                    Enviando...
                                                </>
                                            ) : (
                                                <>
                                                    <FaPaperPlane className={styles.submitIcon} />
                                                    Enviar Mensaje
                                                </>
                                            )}
                                        </button>

                                        {/* Status Messages */}
                                        {status === 'success' && (
                                            <div className={styles.statusSuccess}>
                                                <FaCheckCircle />
                                                <span>{statusMessage}</span>
                                            </div>
                                        )}
                                        {status === 'error' && (
                                            <div className={styles.statusError}>
                                                <FaExclamationCircle />
                                                <span>{statusMessage}</span>
                                            </div>
                                        )}

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
