# Enfoque B: Migrar a UTC como fuente de verdad

> Este documento es un prompt listo para usar con un agente de IA (Claude, GPT, etc.)
> para implementar el enfoque alternativo de timezone basado en UTC.
> Ejecutar en una rama separada desde `develop`.

---

## Prompt

```
Necesito migrar el sistema de agendado de citas de este proyecto de "timezone fija del negocio"
a "UTC como fuente de verdad". Actualmente el sistema usa el Enfoque A (slots fijos en
America/Caracas, conversión visual en el cliente). Necesito el Enfoque B donde todo se
almacena en UTC.

### Contexto del sistema actual

- Stack: Next.js 15 + Supabase + Tailwind + Framer Motion
- La timezone del negocio está definida en `src/lib/timezone.ts` (BUSINESS_TZ = "America/Caracas")
- Los slots horarios están hardcodeados en `src/components/scheduling-modal/time-step.tsx`
  como strings: "09:00", "09:30", "10:00", etc. (hora del negocio)
- La BD (Supabase) tiene tabla `applications` con columnas `date` (tipo DATE) y `time` (tipo TIME)
  que guardan fecha y hora en la timezone del negocio
- La validación de 24h dead range está en:
  - `calendar-step.tsx` (cliente)
  - `time-step.tsx` (cliente)
  - `src/app/api/applications/route.ts` (servidor)
- El ICS se genera en `src/lib/email.ts` con `ical-generator`, actualmente usando
  timezone del negocio en el evento
- La disponibilidad se consulta via GET /api/applications?availability=1&date=YYYY-MM-DD
  y retorna `bookedTimes` como array de strings "HH:MM"

### Lo que necesito que hagas

1. **Migración de BD (Supabase)**
   - Crear una nueva migration SQL que:
     - Cambie la columna `date` + `time` por una sola columna `scheduled_at` de tipo `timestamptz`
     - Migre los datos existentes: combinar date + time asumiendo America/Caracas, convertir a UTC
     - Actualizar el índice UNIQUE para que use `scheduled_at` en vez de `(date, time)`
     - Actualizar las políticas RLS si es necesario

2. **API Route (`src/app/api/applications/route.ts`)**
   - POST: recibir `date` + `time` + `userTimezone` (string IANA, ej: "Europe/Madrid")
     - Convertir la fecha/hora del usuario a UTC antes de guardar
     - Guardar en `scheduled_at` como timestamptz
     - Validar 24h dead range comparando contra UTC now
     - Double booking: comparar contra `scheduled_at` en UTC
   - GET availability:
     - Para `?date=YYYY-MM-DD`: convertir a rango UTC del día en business TZ,
       filtrar appointments en ese rango, retornar bookedTimes en business TZ
     - Para `?month=YYYY-MM`: mismo approach con rango mensual

3. **Componentes de UI**
   - `time-step.tsx`: los slots siguen siendo horarios del negocio (09:00-19:00 VET),
     pero al seleccionar, se envía al API junto con la timezone del usuario
     (Intl.DateTimeFormat().resolvedOptions().timeZone)
   - `calendar-step.tsx`: la lógica de 24h dead range debe funcionar en UTC
   - `modal.tsx`: agregar detección de timezone del usuario y pasarla al POST
   - `form-step.tsx` y `success-step.tsx`: mostrar la hora en la timezone del usuario
     si es diferente a la del negocio

4. **Email e ICS (`src/lib/email.ts`)**
   - El ICS debe usar la hora UTC (`scheduled_at`) y dejar que el formato ICS
     con VTIMEZONE maneje la conversión al calendario del destinatario
   - El email HTML debe mostrar la hora en business TZ (para el negocio) con nota
     de la hora UTC

5. **Schema Zod (`src/lib/schemas.ts`)**
   - Agregar campo `userTimezone` como string opcional al applicationSchema
   - Validar que sea un timezone IANA válido si se proporciona

6. **Panel admin (`src/app/checkout/page.tsx`)**
   - Las citas deben mostrarse en la timezone del negocio
   - Actualizar queries para usar `scheduled_at` en vez de `date` + `time`

### Restricciones

- NO cambiar la experiencia visual del usuario: los slots siempre se muestran
  como horarios del negocio (09:00-19:00 VET), con la hora local del visitante al lado
- NO instalar librerías de timezone (date-fns-tz, luxon, moment-timezone).
  Usar Intl API nativa del browser y Date del servidor
- Mantener backward compatibility: si `userTimezone` no se envía, asumir BUSINESS_TZ
- La migration debe ser reversible (incluir DOWN migration)
- Mantener todas las validaciones existentes: rate limit, CSRF, Zod, 24h dead range
- No romper el panel admin

### Archivos clave a modificar

- `src/lib/timezone.ts` — puede necesitar helpers de conversión UTC
- `src/lib/schemas.ts` — agregar userTimezone
- `src/lib/email.ts` — ICS con UTC
- `src/app/api/applications/route.ts` — POST y GET
- `src/app/api/applications/[id]/route.ts` — PATCH (si usa date/time)
- `src/components/scheduling-modal/modal.tsx`
- `src/components/scheduling-modal/time-step.tsx`
- `src/components/scheduling-modal/calendar-step.tsx`
- `src/components/scheduling-modal/form-step.tsx`
- `src/components/scheduling-modal/success-step.tsx`
- `src/app/checkout/page.tsx` — panel admin
- `migrations/` — nueva migration SQL

### Output esperado

- Todos los archivos modificados con los cambios completos
- Nueva migration SQL lista para ejecutar
- Explicación breve de la estrategia de conversión UTC usada
```

---

## Notas adicionales

- Este prompt asume que el Enfoque A (timezone fija) ya está implementado
- Crear la rama desde `develop`: `git checkout -b feat/timezone-utc develop`
- Testear con usuarios en al menos 3 timezones distintas (VET, CET, PST)
- Verificar que el ICS se importa correctamente en Google Calendar, Outlook y Apple Calendar
