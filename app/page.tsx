"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <div className="relative mx-auto max-w-5xl border-x-0 sm:border-x sm:border-dashed border-border">
      <Navbar loginModalOpen={loginModalOpen} setLoginModalOpen={setLoginModalOpen} />
      <Hero onOpenLogin={() => setLoginModalOpen(true)} />
      <Footer />
    </div>
  );
}
