# Guía de Configuración Actualizada

## 1. Base de Datos (Supabase)
Es **CRÍTICO** que ejecutes este SQL en tu editor de Supabase para añadir las nuevas columnas necesarias para los links de Meet y las respuestas detalladas:

```sql
-- Ejecutar en el SQL Editor
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS meeting_link text;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS answers jsonb DEFAULT '{}'::jsonb;
```

## 2. Nuevas Funcionalidades
- **Margen de 24h:** El sistema bloquea automáticamente cualquier cita que no tenga al menos 24h de antelación.
- **Bloqueo de Horarios:** Si alguien agenda a las 10:00, esa hora desaparece para los demás.
- **Google Meet:** Se genera un link automático para cada cita.
- **Invitaciones de Calendario:** El usuario recibe un archivo `.ics` adjunto. Si usa Gmail, Google le preguntará automáticamente si quiere añadirlo a su calendario.

## 3. Recordatorios
Para los recordatorios (2h antes, 30m antes), en un entorno real necesitarías un "Cron Job". Como sugerencia técnica:
1. Puedes usar **Vercel Cron Jobs** (configurado en `vercel.json`).
2. O una herramienta como **Trigger.dev** o **Upstash QStash** para programar los emails en el momento de la creación.

## 4. Admin Panel
- Ahora puedes hacer click en cualquier fila para abrir un panel lateral con todas las respuestas del cliente (Facturación, Instagram, Cuello de botella).
- Tienes filtros por nombre/email y por estado de la cita.
