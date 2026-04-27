import { z } from "zod";

export const applicationSchema = z.object({
  name: z.string().min(2, "El nombre es demasiado corto"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(6, "Teléfono inválido"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  answers: z.record(z.string(), z.string()).optional(), //error en estos parametros
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña es demasiado corta"),
});
