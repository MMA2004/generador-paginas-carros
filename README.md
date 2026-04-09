# 🏎️ Generador de Páginas Premium (GIBRA)

Una plataforma SaaS moderna y modular tipo "Page Builder" diseñada para visualizar y detallar vehículos de distintas marcas de manera interactiva. Permite a los usuarios crear landing pages excepcionales sin tocar una sola línea de código, usando una interfaz muy intuitiva.

## 🚀 Características Principales

- **Constructores Modulares:** Interfaz visual para añadir bloques (Hero de Vehículo, Galería, Especificaciones).
- **Subida a la Nube (AWS/Firebase):** El usuario sube las fotos desde su PC e instantáneamente son almacenadas en Firebase Storage y previsualizadas en el lienzo.
- **Renderizado Dinámico:** Cada página creada se guarda como un esquema JSON en MongoDB y es parseada bajo la URL orientada a SEO: `/[marca]/[slug]`.
- **Panel de Autenticación Premium:** Protegido con Clerk, los usuarios tienen un Dashboard personal donde listan, publican o re-editan sus vehículos.

## 🛠️ Stack Tecnológico

- **Framework Front/Back:** [Next.js 16](https://nextjs.org/) (App Router & Server Actions)
- **Base de Datos:** [MongoDB](https://www.mongodb.com/) gestionada con `mongoose`.
- **Almacenamiento de Fotos:** [Firebase Storage](https://firebase.google.com/).
- **Autenticación:** [Clerk](https://clerk.com/) Middleware / Autenticación de Múltiples factores.
- **Diseños y Estilos:** Vanilla Tailwind + Extensiones (`clsx`, `tailwind-merge`), Lucide React Icons.

## 💻 Instalación Local

1. Clona este repositorio o ubícate en la carpeta del proyecto.
2. Instala todas las dependencias del proyecto ejecutando:

```bash
npm install
```

3. Cerciórate de tener el archivo `.env` configurado.
4. Levanta el servidor de desarrollo:

```bash
npm run dev
```

5. Visita `http://localhost:3000` en tu navegador para ver la magia y logueate para acceder al Dashboard privado.

## 📁 Estructura del Código

- **`app/`**: Enrutador principal.
  - `(auth)`: Manejo de login y registro.
  - `builder/[id]`: Entorno visual para armar las páginas modulares arrastrando bloques.
  - `dashboard/`: Panel del usuario e interfaz de "Nueva Página".
  - `api/`: Controladores backend de páginas con llamadas seguras y JSON estructurado.
- **`components/page-modules/`**: Componentes visuales "Bloques", como el *HeroSection*. Todo bloque que se cree aquí, podrá ser interpretado por el `ModuleRenderer.tsx`.
- **`lib/`**: Archivos de infraestructura (MongoDB singleton, UI helpers y utilidades de Firebase).
- **`models/`**: Esquemas de Mongoose para normalizar la data de la DB.

---
_Creado con visión modular y estética UI/UX premium._
