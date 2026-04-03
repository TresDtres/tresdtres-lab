# TRESDTRES LAB - Calculadora Científica de Próxima Generación

![TRESDTRES LAB](https://picsum.photos/seed/calculator/1200/400)

**TRESDTRES LAB** es una plataforma de cálculo avanzado diseñada para profesionales, estudiantes e ingenieros que buscan precisión, versatilidad y una interfaz de usuario excepcional. Este proyecto no es solo una calculadora; es un ecosistema de herramientas matemáticas integradas en una aplicación web moderna y fluida.

## 🚀 El Poder de la IA: Desarrollado con Gemini

Este proyecto ha sido desarrollado íntegramente utilizando **Google Gemini**, demostrando las capacidades disruptivas de la Inteligencia Artificial en el desarrollo de software moderno.

### Bondades de desarrollar con una IA avanzada:

*   **Velocidad de Implementación:** Lo que antes tomaba semanas de arquitectura y codificación manual, se ha logrado en tiempo récord gracias a la capacidad de Gemini para generar lógica matemática compleja y estructuras de componentes robustas.
*   **Lógica Matemática de Precisión:** La implementación de algoritmos avanzados como la **Factorización LU**, análisis estadístico y resolución de ecuaciones se realizó con una precisión milimétrica, aprovechando el vasto conocimiento de la IA en ciencias exactas.
*   **Diseño UI/UX Iterativo:** La interfaz ha evolucionado constantemente. Gracias a la IA, se han podido realizar ajustes finos en el **Modo Oscuro**, la accesibilidad y la ergonomía visual de forma instantánea. Se han implementado transiciones dinámicas entre pantallas con efectos de deslizamiento horizontal que varían según la distancia entre módulos.
*   **Código Limpio y Escalable:** Gemini ha estructurado el proyecto utilizando **TypeScript** y **React 19**, asegurando que el código sea mantenible, tipado y preparado para futuras expansiones. Recientemente se ha refactorizado la arquitectura para desacoplar componentes críticos como los ajustes y el manejo de errores.
*   **Modo Tutor (Pizarra):** Implementación de un sistema de aprendizaje que explica el paso a paso de las operaciones matemáticas, renderizando fórmulas en una "pizarra" virtual con estética educativa.
*   **Seguridad y Robustez:** Implementación de un **Global Error Boundary** (Kernel Panic) que detecta errores de ejecución y desbordamientos en tiempo real, protegiendo la experiencia del usuario.
*   **Mejora Continua:** El proyecto está en "Progreso de Mejoras" constante. La IA permite identificar cuellos de botella y proponer nuevas funcionalidades de manera proactiva.

## 🛠️ Características Principales

*   **Calculadora Científica:** Funciones trigonométricas, logarítmicas y exponenciales con historial de cálculos e integración completa de **KaTeX** para visualización de fórmulas naturales.
*   **Laboratorio de Álgebra:** Nuevo módulo para trabajar con expresiones simbólicas (polinomios, binomios). Permite simplificar, expandir y evaluar expresiones asignando valores a variables (x, y, z) en tiempo real.
*   **Modo Tutor:** Una pizarra interactiva que analiza tus cálculos y te guía a través de la jerarquía de operaciones (PEMDAS) y conceptos matemáticos, ideal para el aprendizaje autodidacta.
*   **Matrices Avanzadas:** Operaciones básicas, determinantes, inversas y **Factorización LU** con verificación en tiempo real.
*   **Exportación PDF (Beta):** Capacidad de generar documentos PDF profesionales directamente desde la Hoja de Trabajo (Worksheet), ideal para que los estudiantes guarden sus desarrollos paso a paso.
*   **Estadística:** Análisis de datos con cálculo de media, mediana, desviación estándar y varianza.
*   **Resolución de Ecuaciones:** Solucionador de sistemas lineales y ecuaciones cuadráticas.
*   **Conversor de Unidades Pro:** Tres modos de conversión: Básico, Análisis Dimensional y Soluciones Químicas.
*   **Modo Programador:** Conversión instantánea entre Hexadecimal, Decimal, Octal y Binario.
*   **Constantes Físicas:** Base de datos actualizada con constantes CODATA 2022.
*   **Lab AI:** Integración directa con la API de Gemini para resolver dudas complejas y realizar análisis de datos mediante lenguaje natural.
*   **Graficador en Tiempo Real:** Visualización dinámica de funciones matemáticas.

## 💻 Stack Tecnológico

*   **Frontend:** React 19 + TypeScript
*   **Estilos:** Tailwind CSS 4 (Moderno y ultra-rápido)
*   **Motores Matemáticos:** `math.js` y `ml-matrix`
*   **Renderizado Matemático:** `KaTeX` (Para fórmulas de alta fidelidad)
*   **Visualización:** `d3` y `recharts`
*   **Exportación:** `jspdf` y `jspdf-autotable`
*   **Animaciones:** `motion` (para una experiencia de usuario fluida)
*   **IA:** `@google/genai` (Gemini API)

## 📈 Estado del Proyecto

**TRESDTRES LAB** se encuentra en una fase de mejora continua. Estamos trabajando en:
- [x] Exportación básica a PDF.
- [x] Integración completa de LaTeX (KaTeX) para fórmulas matemáticas.
- [x] Modo Tutor con explicaciones paso a paso.
- [x] Laboratorio de Álgebra Simbólica y Evaluación.
- [ ] Más tipos de gráficos avanzados.
- [ ] Integración de reconocimiento de escritura manual mediante IA.

## ⚙️ Instalación y Desarrollo

Para ejecutar este proyecto localmente:

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` y añade tu API Key de Gemini:
   ```env
   GEMINI_API_KEY=tu_api_key_aqui
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

Desarrollado con ❤️ y la potencia de **Google Gemini**.
