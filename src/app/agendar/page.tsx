import { Metadata } from "next";
import AgendarClient from "./agendar-client";

export const metadata: Metadata = {
  title: "Agendar Llamada Estratégica — KLEY STUDIO",
  description: "Reserva tu sesión de consultoría estratégica para escalar tu negocio de servicios al siguiente nivel.",
  openGraph: {
    title: "Agendar Llamada Estratégica — KLEY STUDIO",
    description: "Reserva tu sesión de consultoría estratégica para escalar tu negocio de servicios al siguiente nivel.",
    images: ["/og-image.png"], // Assuming there is one or it will use the global one
  }
};

export default function AgendarPage() {
  return <AgendarClient />;
}
