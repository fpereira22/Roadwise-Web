# Roadwise Web

## 📋 Descripción del Proyecto
Roadwise Web es una plataforma moderna y tecnológica diseñada para presentar las soluciones innovadoras de Roadwise en el ámbito de la infraestructura vial. La aplicación ofrece una experiencia de usuario inmersiva mediante el uso de tecnologías web avanzadas, visualizaciones 3D y una navegación fluida, reflejando el compromiso de la empresa con la vanguardia y la eficiencia.

## 🚀 Características Principales

*   **Diseño Moderno y Responsivo**: Interfaz adaptada a todos los dispositivos, con un enfoque en la estética "Glassmorphism" y la usabilidad.
*   **Experiencia 3D Interactiva**: Sección de Investigación y Desarrollo (I+D) potenciada por `React Three Fiber`, mostrando elementos viales en 3D (conos, barreras, señales, tachas) con animaciones dinámicas y efectos de iluminación.
*   **Mapa Interactivo**: Sección de Experiencia que integra mapas dinámicos para visualizar la presencia y proyectos de la compañía.
*   **Navegación Fluida**: Sistema de navegación intuitivo que guía al usuario a través de las diferentes secciones (Inicio, Nosotros, Experiencia, I+D, Contacto).
*   **Animaciones Avanzadas**: Uso de `Framer Motion` para transiciones suaves, efectos de aparición y micro-interacciones que enriquecen la experiencia del usuario.

## 🛠️ Stack Tecnológico

Este proyecto está construido con las tecnologías más modernas del ecosistema React:

*   **Core**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/).
*   **Estilos**: [Bootstrap 5](https://getbootstrap.com/), CSS Modules para estilos encapsulados y personalizables.
*   **3D y Gráficos**: [Three.js](https://threejs.org/), [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), [React Three Drei](https://github.com/pmndrs/drei) para la renderización de escenas 3D en la web.
*   **Animaciones**: [Framer Motion](https://www.framer.com/motion/) para animaciones declarativas y gestos.
*   **Iconos**: [React Icons](https://react-icons.github.io/react-icons/).

## 📂 Estructura del Proyecto

La estructura del código está organizada para facilitar la escalabilidad y el mantenimiento:

```
roadwise-web/
├── public/              # Archivos estáticos (imágenes, iconos, modelos 3D)
├── src/
│   ├── app/             # Rutas, layout principal y configuración global de Next.js
│   ├── components/      # Componentes reutilizables de la interfaz
│   │   ├── 3d/          # Componentes y escenas 3D (RoadElements3D, etc.)
│   │   ├── Header       # Barra de navegación
│   │   ├── HeroSection  # Portada principal
│   │   ├── AboutSection # Sección "Nosotros"
│   │   ├── Experience   # Sección de trayectoria y mapas
│   │   ├── Research     # Sección de I+D con visualizaciones 3D
│   │   ├── Contact      # Formulario e información de contacto
│   │   └── Footer       # Pie de página
│   └── ...
└── ...
```

## 🔧 Instalación y Despliegue

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1.  **Clonar el repositorio:**
    ```bash
    git clone <[(https://github.com/fpereira22/Roadwise-Web)]>
    cd roadwise-web
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    # o
    yarn install
    ```

3.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Ver el resultado:**
    Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación en funcionamiento.

## 📦 Scripts Disponibles

*   `npm run dev`: Inicia el servidor de desarrollo.
*   `npm run build`: Compila la aplicación para producción.
*   `npm run start`: Inicia el servidor de producción (luego de hacer build).
*   `npm run lint`: Ejecuta el linter para encontrar problemas en el código.

---

Desarrollado para **Roadwise**.
