# Supabase Migrations

## Setup rápido

### 1. Crear proyecto Supabase
Ve a [supabase.com](https://supabase.com) y crea un proyecto.

### 2. Configurar variables de entorno
```bash
cp .env.local.example .env.local
```
Rellena las variables con los datos de tu proyecto Supabase.

### 3. Ejecutar migraciones (en orden)
En el **SQL Editor** de Supabase, ejecuta cada archivo:

1. `001_create_applications.sql` — Tabla de aplicaciones/citas
2. `002_create_admin_users.sql` — Tabla de administradores
3. `003_create_verify_admin_function.sql` — Función de verificación de login

### 4. Crear tu usuario administrador
En el **SQL Editor**, ejecuta:

```sql
INSERT INTO public.admin_users (email, password_hash)
VALUES (
  'tu-email@ejemplo.com',
  crypt('tu-contraseña-segura', gen_salt('bf'))
);
```

O usa el script `scripts/setup-admin.sql` editando los valores.

### 5. Verificar
Accede a `/checkout/login` y entra con tus credenciales.

## Desarrollo local (sin Supabase)
Si no tienes Supabase configurado, el login usa las variables `ADMIN_EMAIL` y `ADMIN_PASSWORD` de `.env.local` como fallback.

## Migraciones

| Archivo | Descripción |
|---|---|
| `001_create_applications.sql` | Tabla `applications` con RLS |
| `002_create_admin_users.sql` | Tabla `admin_users` con bcrypt |
| `003_create_verify_admin_function.sql` | Función RPC `verify_admin` |
