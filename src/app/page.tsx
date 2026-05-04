"use client";

import { useState } from "react";
import { NoiseOverlay } from "@/components/ui/noise-overlay";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { ServiceTitle } from "@/components/service-title";
import { Pillars } from "@/components/pillars";
import { Deliverables } from "@/components/deliverables";
import { Venom } from "@/components/venom";
import { Team } from "@/components/team";
import { CaseStudies } from "@/components/case-studies";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { SchedulingModal } from "@/components/scheduling-modal/modal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <NoiseOverlay />
      <Nav onOpenModal={openModal} />
      <Hero onOpenModal={openModal} />
      <ServiceTitle />
      <Pillars onOpenModal={openModal} />
      <Deliverables onOpenModal={openModal} />
      <Venom />
      <Team />
      {/* CtaBand removed — "Aplicar" button is now below deliverables */}
      <CaseStudies onOpenModal={openModal} />
      <Faq />
      <FinalCta onOpenModal={openModal} />
      <Footer />
      <SchedulingModal open={modalOpen} onClose={closeModal} />
    </>
  );
}
