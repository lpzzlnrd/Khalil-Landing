import { z } from "zod";

export const applicationSchema = z.object({
  name: z.string().min(2, "Nombre mínimo 2 caracteres").max(100, "Nombre muy largo"),
  email: z.string().email("Email inválido").max(255, "Email muy largo"),
  phone: z
    .string()
    .min(6, "Teléfono inválido")
    .max(20, "Teléfono muy largo")
    .regex(/^[+\d\s()-]+$/, "Formato de teléfono inválido"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Formato de hora inválido (HH:MM)"),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
