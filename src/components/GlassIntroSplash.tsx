"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function GlassIntroSplash() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const ensureImageAlts = () => {
      const images = document.querySelectorAll("img");
      for (const img of images) {
        const currentAlt = img.getAttribute("alt");
        if (!currentAlt || currentAlt.trim().length === 0) {
          img.setAttribute("alt", "Catálogo OSSIL Envases y Home Córdoba");
        }
      }
    };

    ensureImageAlts();
    const observer = new MutationObserver(() => {
      ensureImageAlts();
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["alt", "src"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setMounted(true);
    if (prefersReducedMotion) {
      setVisible(false);
      return;
    }

    const alreadySeen = sessionStorage.getItem("ossil_intro_crystal_v1");
    if (alreadySeen === "1") {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(() => {
      sessionStorage.setItem("ossil_intro_crystal_v1", "1");
      setVisible(false);
    }, 1350);

    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);

  const dismissNow = () => {
    sessionStorage.setItem("ossil_intro_crystal_v1", "1");
    setVisible(false);
  };

  if (!mounted && prefersReducedMotion) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="ossil-liquid-glass-intro"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: "blur(14px)",
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
          }}
          onClick={dismissNow}
          role="status"
          aria-live="polite"
          aria-label="Bienvenido a OSSIL Envases y Home"
          className="fixed inset-0 z-100 flex flex-col items-center justify-center p-6 select-none cursor-pointer overflow-hidden bg-[#FAF8F5]/88 backdrop-blur-2xl"
        >
          {/* Esferas cáusticas sutiles de vidrio cristal y ámbar UV */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#9E734E]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#B45309]/12 blur-3xl" />

          {/* Medallón Central en Liquid Glass Óptico */}
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", bounce: 0, duration: 0.55 },
            }}
            className="relative liquid-glass-strong rounded-3xl px-10 py-9 max-w-sm w-full text-center space-y-5 overflow-hidden"
          >
            {/* Reflejo especular oblicuo simulando luz sobre vidrio cristal */}
            <div className="pointer-events-none absolute inset-y-0 w-24 bg-linear-to-r from-transparent via-white/70 to-transparent animate-crystal-sheen" />

            <div className="mx-auto w-20 h-20 rounded-2xl frosted-well flex items-center justify-center relative">
              <Image
                src="/images/brand/logo-ossil.png"
                alt="Logo oficial de OSSIL Envases y Home Córdoba"
                width={54}
                height={64}
                priority
                className="object-contain drop-shadow-xs"
              />
            </div>

            <div className="space-y-1.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#9E734E] block">
                Córdoba Capital • Oncativo 69.
              </span>
              <h2 className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-[#141413]">
                OSSIL.
              </h2>
              <p className="text-xs font-medium text-[#57534E]">
                Envases de vidrio, bazar, velas y diseño.
              </p>
            </div>

            {/* Filamento de carga de cristal bronce */}
            <div className="w-full h-1 rounded-full bg-[#EBE7DF] overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-linear-to-r from-[#9E734E] via-[#B45309] to-[#141413]"
              />
            </div>

            <span className="text-[10px] text-[#8C827A] block">
              Cargando catálogo y precios por mayor.
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
