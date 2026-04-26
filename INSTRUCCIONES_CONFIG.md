# Guía de Configuración: Supabase, Resend y Vercel

Este documento detalla los pasos necesarios para conectar los servicios y desplegar el proyecto.

---

## 1. Supabase (Base de Datos y Auth)

1.  **Crear Proyecto:** Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto.
2.  **Configurar Tablas:**
    *   Ve a la sección **SQL Editor**.
    *   Copia y ejecuta el contenido de los archivos en la carpeta `migrations/` en este orden:
        1.  `001_create_applications.sql` (Crea la tabla de citas).
        2.  `002_create_admin_users.sql` (Crea la tabla de administradores).
        3.  `003_create_verify_admin_function.sql` (Crea la lógica de login).
3.  **Crear Usuario Administrador:**
    *   En el SQL Editor, usa el script `scripts/setup-admin.sql` (cambia el email y la contraseña en el script antes de ejecutarlo).
4.  **Obtener Credenciales:**
    *   Ve a **Project Settings -> API**.
    *   Copia `URL` y `anon public` key.
    *   Copia la `service_role` key (necesaria para que el servidor gestione las citas).

---

## 2. Resend (Emails)

1.  **Crear Cuenta:** Ve a [resend.com](https://resend.com).
2.  **Verificar Dominio (Obligatorio):**
    *   Ve a **Domains -> Add New Domain**.
    *   **Importante:** Debes usar un dominio propio (comprado en GoDaddy, Namecheap, etc.). No puedes usar `.vercel.app`.
    *   Configura los registros DNS que te proporcione Resend en tu proveedor de dominio.
3.  **Obtener API Key:**
    *   Ve a **API Keys -> Create API Key**. Asegúrate de darle permisos de "Full Access".
4.  **Configurar Remitente:**
    *   En tu `.env.local`, el `RESEND_FROM_EMAIL` debe ser una dirección con el dominio que verificaste (ej: `noreply@tudominio.com`).

---

## 3. Vercel (Despliegue)

1.  **Subir a GitHub:** Sube tu código a un repositorio privado de GitHub.
2.  **Importar en Vercel:**
    *   Conecta tu cuenta de GitHub a Vercel e importa el proyecto.
3.  **Configurar Variables de Entorno:**
    *   En Vercel, ve a **Settings -> Environment Variables**.
    *   Añade todas las variables que tienes en tu `.env.local`:
        *   `NEXT_PUBLIC_SUPABASE_URL`
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
        *   `SUPABASE_SERVICE_ROLE_KEY`
        *   `RESEND_API_KEY`
        *   `RESEND_FROM_EMAIL`
        *   `ADMIN_EMAIL` (Tu email para notificaciones)
        *   `SESSION_SECRET` (Genera uno con `openssl rand -hex 32`)
        *   `NEXT_PUBLIC_APP_URL` (La URL final de tu proyecto en Vercel)
4.  **Deploy:** Vercel detectará que es un proyecto de Next.js y hará el despliegue automáticamente.

---

## Resumen de Flujo de Datos
- **Registro:** El usuario elige fecha/hora -> Se guarda en **Supabase** -> **Resend** envía confirmación al usuario y aviso al admin.
- **Gestión:** Entras a `/checkout/login` -> Se verifica en **Supabase** (vía RPC) -> Tienes acceso al panel de control.
