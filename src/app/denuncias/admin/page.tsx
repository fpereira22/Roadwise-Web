'use client';

import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    FaShieldAlt,
    FaSignOutAlt,
    FaEye,
    FaDownload,
    FaTimes,
    FaSpinner,
    FaSearch,
    FaFilter,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaCalendar,
    FaUserSecret,
    FaPaperclip,
    FaArrowLeft,
    FaExclamationTriangle,
    FaLock
} from 'react-icons/fa';
import styles from './admin.module.css';

// Tipos
interface Attachment {
    name: string;
    size: number;
    type: string;
    blobPath: string;
    downloadUrl?: string;
}

interface Denuncia {
    nombre: string;
    rut: string;
    email: string;
    telefono: string;
    anonimo: boolean;
    tipoDenuncia: string;
    denunciaDetalle: string;
    fechaIncidente: string;
    ubicacion: string;
    trackingId: string;
    receivedAt: string;
    attachments: Attachment[];
}

interface User {
    username: string;
    nombre: string;
    apellido: string;
    rol: string;
}

// Mapeo de tipos de denuncia
const denunciaLabels: Record<string, string> = {
    'infraestructura': 'Deficiencias en Infraestructura Vial',
    'seguridad': 'Incumplimiento de Seguridad Vial',
    'corrupcion': 'Fraude, Corrupción o Irregularidades',
    'medioambiente': 'Impacto Medioambiental',
    'acoso_laboral': 'Acoso Laboral',
    'otro': 'Otro tipo de denuncia',
};

// Componente de Login
const LoginForm = ({ onLogin, isLoading, error }: {
    onLogin: (username: string, password: string) => void;
    isLoading: boolean;
    error: string | null;
}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.loginHeader}>
                    <FaLock className={styles.loginIcon} />
                    <h2>Acceso Administrativo</h2>
                    <p>Panel de Gestión de Denuncias</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Usuario</label>
                        <div className={styles.inputWrapper}>
                            <FaUser className={styles.inputIcon} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Ingrese su usuario"
                                className={styles.input}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Contraseña</label>
                        <div className={styles.inputWrapper}>
                            <FaLock className={styles.inputIcon} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ingrese su contraseña"
                                className={styles.input}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className={styles.errorBox}>
                            <FaExclamationTriangle />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.loginBtn}
                        disabled={isLoading || !username || !password}
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className={styles.spinner} />
                                Verificando...
                            </>
                        ) : (
                            <>
                                <FaShieldAlt />
                                Ingresar
                            </>
                        )}
                    </button>
                </form>

                <div className={styles.loginFooter}>
                    <FaShieldAlt />
                    <span>Acceso restringido a personal autorizado</span>
                </div>
            </div>
        </div>
    );
};

// Componente Principal
export default function DenunciasAdminPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
    const [filteredDenuncias, setFilteredDenuncias] = useState<Denuncia[]>([]);
    const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null);
    const [isLoadingDenuncias, setIsLoadingDenuncias] = useState(false);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');

    // Verificar si hay una sesión guardada
    useEffect(() => {
        const savedUser = localStorage.getItem('denuncias_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Cargar denuncias cuando el usuario está autenticado
    useEffect(() => {
        if (user) {
            loadDenuncias();
        }
    }, [user]);

    // Filtrar denuncias
    useEffect(() => {
        let filtered = [...denuncias];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(d =>
                d.trackingId.toLowerCase().includes(term) ||
                d.nombre.toLowerCase().includes(term) ||
                d.email.toLowerCase().includes(term) ||
                d.ubicacion.toLowerCase().includes(term) ||
                d.denunciaDetalle.toLowerCase().includes(term)
            );
        }

        if (filterType) {
            filtered = filtered.filter(d => d.tipoDenuncia === filterType);
        }

        setFilteredDenuncias(filtered);
    }, [denuncias, searchTerm, filterType]);

    // Login
    const handleLogin = async (username: string, password: string) => {
        setIsLoading(true);
        setLoginError(null);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al iniciar sesión');
            }

            setUser(data.user);
            localStorage.setItem('denuncias_user', JSON.stringify(data.user));
        } catch (error) {
            setLoginError(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    // Logout
    const handleLogout = () => {
        setUser(null);
        setDenuncias([]);
        setSelectedDenuncia(null);
        localStorage.removeItem('denuncias_user');
    };

    // Cargar lista de denuncias
    const loadDenuncias = async () => {
        setIsLoadingDenuncias(true);
        try {
            const response = await fetch('/api/denuncias/list');
            const data = await response.json();

            if (data.success) {
                setDenuncias(data.denuncias);
            }
        } catch (error) {
            console.error('Error al cargar denuncias:', error);
        } finally {
            setIsLoadingDenuncias(false);
        }
    };

    // Ver detalle de denuncia
    const viewDenuncia = async (trackingId: string) => {
        setIsLoadingDetail(true);
        try {
            const response = await fetch(`/api/denuncias/${trackingId}`);
            const data = await response.json();

            if (data.success) {
                setSelectedDenuncia(data.denuncia);
            }
        } catch (error) {
            console.error('Error al cargar denuncia:', error);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    // Formatear fecha
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr.replace(/-/g, ':').replace('T', ' ').replace('Z', ''));
            return date.toLocaleDateString('es-CL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateStr;
        }
    };

    // Formatear tamaño de archivo
    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Si no hay usuario, mostrar login
    if (!user) {
        return (
            <div className={styles.page}>
                <header className={styles.header}>
                    <Container>
                        <div className={styles.headerContent}>
                            <a href="/denuncias" className={styles.logoLink}>
                                <Image
                                    src="/logo-roadwise.jpeg"
                                    alt="Roadwise"
                                    width={140}
                                    height={48}
                                    className={styles.logo}
                                />
                            </a>
                            <div className={styles.headerBadge}>
                                <FaShieldAlt /> Panel Administrativo
                            </div>
                        </div>
                    </Container>
                </header>
                <main className={styles.main}>
                    <LoginForm
                        onLogin={handleLogin}
                        isLoading={isLoading}
                        error={loginError}
                    />
                </main>
            </div>
        );
    }

    // Vista del detalle de denuncia
    if (selectedDenuncia) {
        return (
            <div className={styles.page}>
                <header className={styles.header}>
                    <Container>
                        <div className={styles.headerContent}>
                            <a href="/denuncias" className={styles.logoLink}>
                                <Image
                                    src="/logo-roadwise.jpeg"
                                    alt="Roadwise"
                                    width={140}
                                    height={48}
                                    className={styles.logo}
                                />
                            </a>
                            <div className={styles.headerActions}>
                                <div className={styles.userInfo}>
                                    <FaUser />
                                    <span>{user.nombre} {user.apellido}</span>
                                </div>
                                <button onClick={handleLogout} className={styles.logoutBtn}>
                                    <FaSignOutAlt /> Salir
                                </button>
                            </div>
                        </div>
                    </Container>
                </header>

                <main className={styles.main}>
                    <Container>
                        <button
                            onClick={() => setSelectedDenuncia(null)}
                            className={styles.backBtn}
                        >
                            <FaArrowLeft /> Volver a la lista
                        </button>

                        <div className={styles.detailCard}>
                            <div className={styles.detailHeader}>
                                <div>
                                    <h1 className={styles.detailTitle}>
                                        Denuncia #{selectedDenuncia.trackingId}
                                    </h1>
                                    <span className={`${styles.badge} ${styles[selectedDenuncia.tipoDenuncia]}`}>
                                        {denunciaLabels[selectedDenuncia.tipoDenuncia] || selectedDenuncia.tipoDenuncia}
                                    </span>
                                </div>
                                <div className={styles.detailMeta}>
                                    <FaCalendar />
                                    <span>{formatDate(selectedDenuncia.receivedAt)}</span>
                                </div>
                            </div>

                            <div className={styles.detailGrid}>
                                {/* Información del Denunciante */}
                                <div className={styles.detailSection}>
                                    <h3 className={styles.sectionTitle}>
                                        {selectedDenuncia.anonimo ? (
                                            <><FaUserSecret /> Denuncia Anónima</>
                                        ) : (
                                            <><FaUser /> Datos del Denunciante</>
                                        )}
                                    </h3>

                                    {selectedDenuncia.anonimo ? (
                                        <div className={styles.anonymousBox}>
                                            <FaUserSecret />
                                            <p>Esta denuncia fue realizada de forma anónima</p>
                                        </div>
                                    ) : (
                                        <div className={styles.infoGrid}>
                                            <div className={styles.infoItem}>
                                                <FaUser />
                                                <div>
                                                    <label>Nombre</label>
                                                    <span>{selectedDenuncia.nombre || 'No proporcionado'}</span>
                                                </div>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <FaShieldAlt />
                                                <div>
                                                    <label>RUT</label>
                                                    <span>{selectedDenuncia.rut || 'No proporcionado'}</span>
                                                </div>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <FaEnvelope />
                                                <div>
                                                    <label>Email</label>
                                                    <span>{selectedDenuncia.email || 'No proporcionado'}</span>
                                                </div>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <FaPhone />
                                                <div>
                                                    <label>Teléfono</label>
                                                    <span>{selectedDenuncia.telefono || 'No proporcionado'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Información del Incidente */}
                                <div className={styles.detailSection}>
                                    <h3 className={styles.sectionTitle}>
                                        <FaMapMarkerAlt /> Información del Incidente
                                    </h3>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoItem}>
                                            <FaCalendar />
                                            <div>
                                                <label>Fecha del Incidente</label>
                                                <span>{selectedDenuncia.fechaIncidente || 'No especificada'}</span>
                                            </div>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <FaMapMarkerAlt />
                                            <div>
                                                <label>Ubicación</label>
                                                <span>{selectedDenuncia.ubicacion || 'No especificada'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className={styles.detailSection}>
                                <h3 className={styles.sectionTitle}>
                                    <FaExclamationTriangle /> Descripción de la Denuncia
                                </h3>
                                <div className={styles.descriptionBox}>
                                    {selectedDenuncia.denunciaDetalle}
                                </div>
                            </div>

                            {/* Archivos Adjuntos */}
                            {selectedDenuncia.attachments && selectedDenuncia.attachments.length > 0 && (
                                <div className={styles.detailSection}>
                                    <h3 className={styles.sectionTitle}>
                                        <FaPaperclip /> Archivos Adjuntos ({selectedDenuncia.attachments.length})
                                    </h3>
                                    <div className={styles.attachmentsList}>
                                        {selectedDenuncia.attachments.map((file, index) => (
                                            <div key={index} className={styles.attachmentItem}>
                                                <div className={styles.attachmentInfo}>
                                                    <FaPaperclip />
                                                    <div>
                                                        <span className={styles.attachmentName}>{file.name}</span>
                                                        <span className={styles.attachmentMeta}>
                                                            {file.type} • {formatFileSize(file.size)}
                                                        </span>
                                                    </div>
                                                </div>
                                                {file.downloadUrl && (
                                                    <a
                                                        href={file.downloadUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.downloadBtn}
                                                    >
                                                        <FaDownload /> Descargar
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Container>
                </main>
            </div>
        );
    }

    // Vista de lista de denuncias
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <Container>
                    <div className={styles.headerContent}>
                        <a href="/denuncias" className={styles.logoLink}>
                            <Image
                                src="/logo-roadwise.jpeg"
                                alt="Roadwise"
                                width={140}
                                height={48}
                                className={styles.logo}
                            />
                        </a>
                        <div className={styles.headerActions}>
                            <div className={styles.userInfo}>
                                <FaUser />
                                <span>{user.nombre} {user.apellido}</span>
                            </div>
                            <button onClick={handleLogout} className={styles.logoutBtn}>
                                <FaSignOutAlt /> Salir
                            </button>
                        </div>
                    </div>
                </Container>
            </header>

            <main className={styles.main}>
                <Container>
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>Panel de Denuncias</h1>
                        <p className={styles.pageSubtitle}>
                            Gestión y revisión de denuncias registradas
                        </p>
                    </div>

                    {/* Filtros */}
                    <div className={styles.filtersBar}>
                        <div className={styles.searchBox}>
                            <FaSearch />
                            <input
                                type="text"
                                placeholder="Buscar por código, nombre, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                        <div className={styles.filterBox}>
                            <FaFilter />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">Todos los tipos</option>
                                {Object.entries(denunciaLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={loadDenuncias} className={styles.refreshBtn}>
                            {isLoadingDenuncias ? <FaSpinner className={styles.spinner} /> : 'Actualizar'}
                        </button>
                    </div>

                    {/* Stats */}
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>{denuncias.length}</span>
                            <span className={styles.statLabel}>Total Denuncias</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>
                                {denuncias.filter(d => d.anonimo).length}
                            </span>
                            <span className={styles.statLabel}>Anónimas</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statNumber}>
                                {denuncias.filter(d => d.attachments?.length > 0).length}
                            </span>
                            <span className={styles.statLabel}>Con Adjuntos</span>
                        </div>
                    </div>

                    {/* Lista de Denuncias */}
                    {isLoadingDenuncias ? (
                        <div className={styles.loadingBox}>
                            <FaSpinner className={styles.spinner} />
                            <p>Cargando denuncias...</p>
                        </div>
                    ) : filteredDenuncias.length === 0 ? (
                        <div className={styles.emptyBox}>
                            <FaExclamationTriangle />
                            <p>No se encontraron denuncias</p>
                        </div>
                    ) : (
                        <div className={styles.denunciasList}>
                            {filteredDenuncias.map((denuncia) => (
                                <div key={denuncia.trackingId} className={styles.denunciaCard}>
                                    <div className={styles.denunciaHeader}>
                                        <div className={styles.denunciaId}>
                                            <code>#{denuncia.trackingId}</code>
                                            <span className={`${styles.typeBadge} ${styles[denuncia.tipoDenuncia]}`}>
                                                {denunciaLabels[denuncia.tipoDenuncia] || denuncia.tipoDenuncia}
                                            </span>
                                        </div>
                                        <span className={styles.denunciaDate}>
                                            {formatDate(denuncia.receivedAt)}
                                        </span>
                                    </div>

                                    <div className={styles.denunciaBody}>
                                        <div className={styles.denunciaInfo}>
                                            {denuncia.anonimo ? (
                                                <span className={styles.anonymous}>
                                                    <FaUserSecret /> Anónimo
                                                </span>
                                            ) : (
                                                <span>
                                                    <FaUser /> {denuncia.nombre || 'Sin nombre'}
                                                </span>
                                            )}
                                            {denuncia.ubicacion && (
                                                <span>
                                                    <FaMapMarkerAlt /> {denuncia.ubicacion}
                                                </span>
                                            )}
                                            {denuncia.attachments?.length > 0 && (
                                                <span>
                                                    <FaPaperclip /> {denuncia.attachments.length} archivo(s)
                                                </span>
                                            )}
                                        </div>
                                        <p className={styles.denunciaPreview}>
                                            {denuncia.denunciaDetalle.substring(0, 150)}
                                            {denuncia.denunciaDetalle.length > 150 ? '...' : ''}
                                        </p>
                                    </div>

                                    <div className={styles.denunciaActions}>
                                        <button
                                            onClick={() => viewDenuncia(denuncia.trackingId)}
                                            className={styles.viewBtn}
                                            disabled={isLoadingDetail}
                                        >
                                            <FaEye /> Ver Detalle
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Container>
            </main>
        </div>
    );
}
