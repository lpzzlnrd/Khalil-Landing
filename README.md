# Kley Studio - Landing Page

Bienvenido al repositorio de la Landing Page de Kley Studio (Khalil). Esta es una aplicación web moderna, rápida y altamente interactiva diseñada para presentar servicios, casos de éxito y facilitar la captación de leads mediante un sistema de agendamiento integrado.

## 🏗️ Arquitectura del Proyecto

El proyecto está construido utilizando el paradigma de **App Router** de Next.js, apoyándose fuertemente en el ecosistema de React para el cliente y Serverless Functions para el backend.

### Stack Tecnológico Principal

*   **Framework:** [Next.js](https://nextjs.org/) (App Router, versión 16+)
*   **Librería UI:** [React](https://react.dev/) (versión 19)
*   **Estilado:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Animaciones:** [Framer Motion](https://www.framer.com/motion/) para transiciones fluidas y efectos visuales de alta calidad.
*   **Gestión de Estado & Formularios:** `react-hook-form` junto con `zod` para la validación de esquemas y tipos estrictos.
*   **Base de Datos & Backend-as-a-Service:** [Supabase](https://supabase.com/) para el almacenamiento de datos, leads y autenticación (roles de servicio).
*   **Emails Transaccionales:** [Resend](https://resend.com/) para el envío automatizado de correos (notificaciones de nuevos leads).
*   **Integraciones:** API de Google (Google Calendar) para la gestión de citas de forma automatizada mediante una cuenta de servicio (`googleapis`).

### Estructura de Directorios

```text
c:\Users\leoco\Khalil-Landing\
├── src/
│   ├── app/                 # Next.js App Router (Rutas y Páginas)
│   │   ├── api/             # Endpoints del Backend (Serverless functions)
│   │   │   ├── applications/ # Gestión de nuevas solicitudes/leads
│   │   │   ├── auth/         # Autenticación y sesiones
│   │   │   └── cron/         # Tareas programadas (cron jobs)
│   │   ├── checkout/        # Flujo de pagos/agendamiento
│   │   ├── layout.tsx       # Layout principal de la aplicación
│   │   └── page.tsx         # Componente principal (Home/Landing)
│   ├── components/          # Componentes de React reutilizables
│   │   ├── ui/              # Componentes base de UI (botones, inputs, modales)
│   │   ├── scheduling-modal/# Lógica e interfaz para agendar reuniones (Google Calendar)
│   │   └── [secciones]      # Componentes de las secciones de la landing (Hero, Pillars, Team, FAQ, etc.)
│   ├── lib/                 # Utilidades, configuración de clientes (Supabase, Google Calendar, etc.)
│   └── content/             # Contenido estático (textos, datos de casos de estudio, etc.)
├── public/                  # Assets estáticos (imágenes, fuentes, iconos)
├── .env                     # Variables de entorno (Supabase, Resend, Google, etc.)
└── package.json             # Dependencias y scripts del proyecto
```

### Flujo de Datos

1.  **Interacción del Usuario:** El usuario navega por la página, viendo las animaciones (Framer Motion) y el contenido estructurado en los componentes (Hero, Case Studies, etc.).
2.  **Captación de Leads / Agendamiento:** A través del `SchedulingModal` o formularios de aplicación, el usuario envía sus datos.
3.  **Procesamiento Backend:** Las peticiones llegan a `src/app/api/applications/[id]/route.ts`.
4.  **Base de Datos & Notificación:** Se guarda el registro del lead en Supabase y se dispara un correo electrónico utilizando Resend para notificar a los administradores. En el caso del agendamiento, se interactúa con Google Calendar vía Service Account.

---

## 🚀 Guía de Usuario (Desarrollo y Despliegue)

### Requisitos Previos

*   Node.js (v20 o superior recomendado)
*   NPM o Yarn / pnpm

### 1. Instalación de Dependencias

Clona el repositorio y ejecuta el comando de instalación en la raíz del proyecto:

```bash
npm install
```

### 2. Configuración de Variables de Entorno

El proyecto requiere varias claves de servicios externos para funcionar correctamente. Asegúrate de configurar un archivo `.env` o `.env.local` en la raíz con las siguientes variables (puedes guiarte por el `.env.example` si existe, o usar los valores de tu entorno de desarrollo):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Configuración de Admin
ADMIN_EMAIL=contacto.kleystudio@gmail.com
ADMIN_PASSWORD=tu_password

# Resend (Emails)
RESEND_API_KEY=tu_resend_api_key
RESEND_FROM_EMAIL="Kley Studio <contacto@kleystudio.com>"

# Google Calendar (Agendamiento)
GOOGLE_SERVICE_ACCOUNT_JSON=tu_json_codificado_en_base64
GOOGLE_CALENDAR_ID=contacto.kleystudio@gmail.com

# Entorno de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000/
SESSION_SECRET=un_secreto_para_sesiones
CRON_SECRET=un_secreto_para_cron_jobs
```

> **Nota de Seguridad:** Las variables que comienzan con `NEXT_PUBLIC_` son accesibles desde el frontend. El resto (como `SUPABASE_SERVICE_ROLE_KEY` o las credenciales de Google) son estrictamente para el entorno de servidor (API Routes) y nunca deben exponerse al cliente.

### 3. Entorno de Desarrollo Local

Una vez instaladas las dependencias y configuradas las variables, levanta el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 4. Construcción y Producción

Para compilar la aplicación para producción (optimización de recursos, renderizado estático donde aplique):

```bash
npm run build
```

Para iniciar el servidor en modo de producción luego del build:

```bash
npm run start
```

### 5. Edición de Contenido

Si deseas modificar el contenido de la landing page (textos de la sección "Hero", preguntas frecuentes, miembros del equipo, etc.), deberás buscar en:
- Directorio `src/components/`: Busca el componente correspondiente (ej. `hero.tsx`, `faq.tsx`, `team.tsx`).
- Directorio `src/content/`: Si hay archivos `.ts` o `.json` con datos estructurados para no ensuciar los componentes.

### 6. Sistema de Agendamiento (Google Calendar)

El sistema de citas utiliza un modal de interfaz (`src/components/scheduling-modal/`) que se conecta al API interno. Este API a su vez se autentica en Google mediante una Cuenta de Servicio (`GOOGLE_SERVICE_ACCOUNT_JSON`).
*   Para modificar la disponibilidad de horarios, debes modificar la lógica en los archivos de la API o la configuración de Google Calendar.
*   Si falla el agendamiento, asegúrate de que el Service Account tenga permisos de escritura en el calendario de destino (`GOOGLE_CALENDAR_ID`).