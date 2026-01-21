'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    FaCheck,
    FaExclamationTriangle,
    FaArrowLeft,
    FaArrowRight,
    FaTimes,
    FaShieldAlt,
    FaLock,
    FaPaperclip,
    FaSpinner,
    FaHome
} from 'react-icons/fa';
import styles from './denuncias.module.css';

// ==========================================
// VALIDACIÓN FUNCTIONS
// ==========================================

const validatePhone = (phone: string): boolean => {
    if (!phone) return false;
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('56')) {
        cleanPhone = cleanPhone.substring(2);
    }
    const length = cleanPhone.length;
    return length >= 8 && length <= 9;
};

const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

const validateRut = (rut: string): boolean => {
    if (!rut) return false;
    const cleanRut = rut.replace(/[^0-9kK]/g, "").toUpperCase();
    if (cleanRut.length < 2) return false;

    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    if (body.length < 7) return false;

    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body.charAt(i), 10) * multiplier;
        multiplier++;
        if (multiplier > 7) multiplier = 2;
    }

    const remainder = sum % 11;
    let dvExpected = (11 - remainder).toString();

    if (dvExpected === '10') dvExpected = 'K';
    else if (dvExpected === '11') dvExpected = '0';

    return dv === dvExpected;
};

const formatRut = (rut: string): string => {
    if (!rut) return '';
    const cleanRut = rut.replace(/[^0-9kK]/g, "").toUpperCase();
    if (cleanRut.length < 2) return cleanRut;

    let body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    body = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${body}-${dv}`;
};

// ==========================================
// OPTIONS & INITIAL STATE
// ==========================================

const denunciaOptions = [
    { value: '', label: 'Seleccione un tipo de denuncia' },
    { value: 'infraestructura', label: 'Deficiencias en Infraestructura Vial' },
    { value: 'seguridad', label: 'Incumplimiento de Seguridad Vial' },
    { value: 'corrupcion', label: 'Fraude, Corrupción o Irregularidades' },
    { value: 'medioambiente', label: 'Impacto Medioambiental' },
    { value: 'acoso_laboral', label: 'Acoso Laboral' },
    { value: 'otro', label: 'Otro tipo de denuncia' },
];

const initialFormData = {
    nombre: '',
    rut: '',
    email: '',
    telefono: '',
    anonimo: false,
    tipoDenuncia: '',
    denunciaDetalle: '',
    fechaIncidente: '',
    ubicacion: '',
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function DenunciasPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(initialFormData);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [trackingId, setTrackingId] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    // Block scroll when modals are open
    useEffect(() => {
        if (isConfirmOpen || isSubmitting || isSuccessModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isConfirmOpen, isSubmitting, isSuccessModalOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked,
                ...(name === 'anonimo' && checked ? { nombre: '', rut: '', email: '', telefono: '' } : {})
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'rut' ? value.replace(/[^0-9kK]/g, '') : value
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setFiles(prev => [...prev, ...filesArray].slice(0, 5));
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleRutBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.name === 'rut' && !formData.anonimo) {
            const cleanedRut = e.target.value.replace(/[^0-9kK]/g, '');
            if (cleanedRut.length > 1) {
                const formattedRut = formatRut(cleanedRut);
                setFormData(prev => ({ ...prev, rut: formattedRut }));
            }
        }
    };

    const nextStep = useCallback(() => setStep(prev => prev + 1), []);
    const prevStep = useCallback(() => setStep(prev => prev - 1), []);

    const handleOpenConfirm = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (step === 3 && formData.denunciaDetalle.length >= 10) {
            setIsConfirmOpen(true);
        }
    }, [step, formData.denunciaDetalle.length]);

    const isRutValid = useMemo(() => validateRut(formData.rut), [formData.rut]);
    const isEmailValid = useMemo(() => validateEmail(formData.email), [formData.email]);
    const isPhoneValid = useMemo(() => validatePhone(formData.telefono), [formData.telefono]);

    const isContactValid = useMemo(() => {
        const hasName = formData.nombre.trim().length > 0;
        const hasValidRut = isRutValid;
        const hasValidEmail = isEmailValid;
        const hasValidPhone = isPhoneValid;
        return (hasName && hasValidRut) || (hasValidEmail && hasValidPhone);
    }, [formData, isRutValid, isEmailValid, isPhoneValid]);

    const isStep1Valid = useMemo(() => {
        return formData.anonimo || isContactValid;
    }, [formData.anonimo, isContactValid]);

    const isStep2Valid = useMemo(() => {
        return formData.tipoDenuncia !== '';
    }, [formData.tipoDenuncia]);

    // FINAL SUBMIT
    const handleFinalSubmit = async () => {
        if (isSubmitting) return;

        setIsConfirmOpen(false);
        setIsSubmitting(true);

        const submitFormData = new FormData();
        submitFormData.append('data', JSON.stringify(formData));

        files.forEach(file => {
            submitFormData.append('archivos', file);
        });

        try {
            const response = await fetch('/api/submit-denuncia', {
                method: 'POST',
                body: submitFormData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: response.statusText }));
                throw new Error(errorData.detail || response.statusText);
            }

            const result = await response.json();
            setTrackingId(result.trackingId);
            setIsSuccessModalOpen(true);
            setStep(1);
            setFormData(initialFormData);
            setFiles([]);

        } catch (error: unknown) {
            console.error("Error al enviar la denuncia:", error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            alert(`❌ Fallo el envío de la denuncia: ${errorMessage}. Por favor, inténtelo más tarde.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoHome = () => {
        setIsSuccessModalOpen(false);
        router.push('/');
    };

    // ==========================================
    // RENDER STEPS
    // ==========================================

    const renderStep = () => {
        const showEmailError = !formData.anonimo && formData.email && !isEmailValid;
        const showPhoneError = !formData.anonimo && formData.telefono && !isPhoneValid;

        switch (step) {
            case 1:
                return (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepTitle}>Información de Contacto</h2>
                        <p className={styles.stepDescription}>
                            Ingrese al menos dos datos de contacto válidos o seleccione denuncia anónima.
                        </p>

                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    disabled={formData.anonimo}
                                    className={`${styles.input} ${formData.anonimo ? styles.disabled : ''}`}
                                    placeholder="Tu nombre completo"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>RUT / DNI</label>
                                <input
                                    type="text"
                                    name="rut"
                                    value={formData.rut}
                                    onChange={handleChange}
                                    onBlur={handleRutBlur}
                                    disabled={formData.anonimo}
                                    placeholder="Ej: 12.345.678-9"
                                    className={`${styles.input} ${formData.anonimo ? styles.disabled : ''} ${!formData.anonimo && formData.rut && !isRutValid ? styles.inputError : ''}`}
                                />
                                {!formData.anonimo && formData.rut && !isRutValid && (
                                    <p className={styles.errorText}>
                                        <FaExclamationTriangle /> RUT inválido
                                    </p>
                                )}
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={formData.anonimo}
                                    placeholder="tu@email.com"
                                    className={`${styles.input} ${formData.anonimo ? styles.disabled : ''} ${showEmailError ? styles.inputError : ''}`}
                                />
                                {showEmailError && (
                                    <p className={styles.errorText}>
                                        <FaExclamationTriangle /> Email inválido
                                    </p>
                                )}
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Teléfono</label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    disabled={formData.anonimo}
                                    placeholder="+56 9 1234 5678"
                                    className={`${styles.input} ${formData.anonimo ? styles.disabled : ''} ${showPhoneError ? styles.inputError : ''}`}
                                />
                                {showPhoneError && (
                                    <p className={styles.errorText}>
                                        <FaExclamationTriangle /> Teléfono inválido
                                    </p>
                                )}
                            </div>
                        </div>

                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="anonimo"
                                checked={formData.anonimo}
                                onChange={handleChange}
                                className={styles.checkbox}
                            />
                            <span className={styles.checkboxCustom}></span>
                            <span><FaLock /> Deseo que mi denuncia sea anónima</span>
                        </label>

                        <div className={styles.warningBox}>
                            <FaExclamationTriangle />
                            <div>
                                <p className={styles.warningTitle}>Importante</p>
                                <p>Para ciertas denuncias (acoso laboral, etc.) es necesario contar con sus datos para realizar la investigación. Su identidad está protegida por garantía de indemnidad.</p>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepTitle}>Tipo de Denuncia</h2>
                        <p className={styles.stepDescription}>
                            Seleccione la categoría que mejor describa su denuncia.
                        </p>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Tipo de Falta a Reportar</label>
                            <select
                                name="tipoDenuncia"
                                value={formData.tipoDenuncia}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                {denunciaOptions.map(option => (
                                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {formData.tipoDenuncia && (
                            <div className={styles.infoBox}>
                                <FaCheck />
                                <div>
                                    <p>Ha seleccionado: <strong>{denunciaOptions.find(o => o.value === formData.tipoDenuncia)?.label}</strong></p>
                                    <p>El siguiente paso le pedirá los detalles del incidente.</p>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 3:
                return (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepTitle}>Detalle de la Denuncia</h2>
                        <p className={styles.stepDescription}>
                            Proporcione toda la información relevante para investigar el caso.
                        </p>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Descripción Detallada <span className={styles.required}>*</span></label>
                            <textarea
                                name="denunciaDetalle"
                                value={formData.denunciaDetalle}
                                onChange={handleChange}
                                rows={5}
                                required
                                className={styles.textarea}
                                placeholder="Describa los hechos, fechas, lugares, personas involucradas y testigos..."
                            />
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Fecha del Incidente</label>
                                <input
                                    type="date"
                                    name="fechaIncidente"
                                    value={formData.fechaIncidente}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Ubicación</label>
                                <input
                                    type="text"
                                    name="ubicacion"
                                    value={formData.ubicacion}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Ruta, Km, Ciudad..."
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                <FaPaperclip /> Archivos Adjuntos (Evidencia)
                            </label>
                            <div
                                className={styles.dropZone}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <FaPaperclip className={styles.dropIcon} />
                                <p>Haz clic para adjuntar archivos</p>
                                <span>PDF, JPG, PNG, Videos (máx. 5 archivos)</span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*,video/*,.pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            {files.length > 0 && (
                                <div className={styles.fileList}>
                                    {files.map((file, index) => (
                                        <div key={index} className={styles.fileItem}>
                                            <span>{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className={styles.removeFile}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles.successBox}>
                            <FaCheck />
                            <div>
                                <p className={styles.successTitle}>Listo para Enviar</p>
                                <p>Al hacer clic en Enviar Denuncia, su reporte será registrado de forma segura.</p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // ==========================================
    // MODALS
    // ==========================================

    const SuccessModal = () => (
        <div className={styles.modalOverlay} onClick={() => setIsSuccessModalOpen(false)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeaderSuccess}>
                    <h3><FaCheck /> Denuncia Registrada</h3>
                    <button onClick={() => setIsSuccessModalOpen(false)} className={styles.modalClose}>
                        <FaTimes />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <p>Su denuncia ha sido enviada exitosamente.</p>
                    {trackingId && (
                        <div className={styles.trackingBox}>
                            <span className={styles.trackingLabel}>Código de Seguimiento:</span>
                            <code className={styles.trackingCode}>{trackingId}</code>
                            <p className={styles.trackingNote}>
                                Guarde este código para consultar el estado de su denuncia.
                            </p>
                        </div>
                    )}
                </div>
                <div className={styles.modalFooter}>
                    <button onClick={() => setIsSuccessModalOpen(false)} className={styles.btnSecondary}>
                        Entendido
                    </button>
                    <button onClick={handleGoHome} className={styles.btnPrimary}>
                        <FaHome /> Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    );

    const ConfirmModal = () => (
        <div className={styles.modalOverlay} onClick={() => setIsConfirmOpen(false)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>Confirmar Envío</h3>
                    <button onClick={() => setIsConfirmOpen(false)} className={styles.modalClose}>
                        <FaTimes />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <p className={styles.confirmText}>
                        <FaExclamationTriangle /> ¿Está seguro de que desea enviar la denuncia?
                    </p>
                    <p className={styles.confirmNote}>
                        Una vez enviada, la denuncia será procesada y no podrá ser editada.
                    </p>
                </div>
                <div className={styles.modalFooter}>
                    <button onClick={() => setIsConfirmOpen(false)} className={styles.btnSecondary}>
                        Seguir Editando
                    </button>
                    <button onClick={handleFinalSubmit} className={styles.btnSuccess} disabled={isSubmitting}>
                        <FaCheck /> Enviar y Finalizar
                    </button>
                </div>
            </div>
        </div>
    );

    const LoadingModal = () => (
        <div className={styles.modalOverlay}>
            <div className={styles.loadingContent}>
                <FaSpinner className={styles.spinner} />
                <p>Enviando denuncia, por favor espere...</p>
            </div>
        </div>
    );

    // ==========================================
    // MAIN RENDER
    // ==========================================

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <Container>
                    <div className={styles.headerContent}>
                        <a href="/" className={styles.logoLink}>
                            <Image
                                src="/logo-roadwise.jpeg"
                                alt="Roadwise"
                                width={140}
                                height={48}
                                className={styles.logo}
                            />
                        </a>
                        <div className={styles.headerRight}>
                            <div className={styles.headerBadge}>
                                <FaShieldAlt /> Canal Seguro
                            </div>
                            <a href="/denuncias/admin" className={styles.adminLink}>
                                <FaLock /> Ingreso
                            </a>
                        </div>
                    </div>
                </Container>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8} xl={7}>
                            <form onSubmit={handleOpenConfirm} className={styles.formContainer}>
                                {/* Title */}
                                <div className={styles.formHeader}>
                                    <h1 className={styles.formTitle}>Centro de Denuncias</h1>
                                    <span className={styles.stepIndicator}>Paso {step} de 3</span>
                                </div>

                                {/* Progress Bar */}
                                <div className={styles.progressBar}>
                                    {[1, 2, 3].map((s) => (
                                        <div key={s} className={styles.progressStep}>
                                            <div className={`${styles.progressCircle} ${s <= step ? styles.active : ''}`}>
                                                {s < step ? <FaCheck /> : s}
                                            </div>
                                            <span className={`${styles.progressLabel} ${s <= step ? styles.active : ''}`}>
                                                {s === 1 ? 'Contacto' : s === 2 ? 'Tipo' : 'Detalle'}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Form Card */}
                                <div className={styles.formCard}>
                                    {renderStep()}

                                    {/* Navigation */}
                                    <div className={styles.formNav}>
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            disabled={step === 1 || isSubmitting}
                                            className={styles.btnBack}
                                        >
                                            <FaArrowLeft /> Anterior
                                        </button>

                                        {step < 3 && (
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                disabled={(!isStep1Valid && step === 1) || (!isStep2Valid && step === 2)}
                                                className={styles.btnNext}
                                            >
                                                Siguiente <FaArrowRight />
                                            </button>
                                        )}

                                        {step === 3 && (
                                            <button
                                                type="submit"
                                                disabled={formData.denunciaDetalle.length < 10 || isSubmitting}
                                                className={styles.btnSubmit}
                                            >
                                                <FaCheck /> Enviar Denuncia
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Trust Badges */}
                                <div className={styles.trustBadges}>
                                    <div className={styles.badge}>
                                        <FaLock /> 100% Confidencial
                                    </div>
                                    <div className={styles.badge}>
                                        <FaShieldAlt /> Datos Encriptados
                                    </div>
                                </div>
                            </form>
                        </Col>
                    </Row>
                </Container>
            </main>

            {/* Modals */}
            {isConfirmOpen && <ConfirmModal />}
            {isSuccessModalOpen && <SuccessModal />}
            {isSubmitting && <LoadingModal />}
        </div>
    );
}
