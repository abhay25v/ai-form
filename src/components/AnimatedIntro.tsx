"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navbarLogoId } from "@/components/ui/header"; // import the id
import Image from "next/image";

const TYPING_TEXT = "AI Form Builder";

export default function AnimatedIntro({ onFinish }: { onFinish: () => void }) {
  const [typed, setTyped] = useState("");
  const [step, setStep] = useState<"center" | "slide" | "typing" | "shrink" | "done">("center");
  const [target, setTarget] = useState<{ x: number; y: number; scale: number } | null>(null);
  const introRef = useRef<HTMLDivElement>(null);

  // Typing effect
  useEffect(() => {
    if (step === "typing" && typed.length < TYPING_TEXT.length) {
      const timeout = setTimeout(() => {
        setTyped(TYPING_TEXT.slice(0, typed.length + 1));
      }, 60);
      return () => clearTimeout(timeout);
    }
    if (step === "typing" && typed.length === TYPING_TEXT.length) {
      setTimeout(() => setStep("shrink"), 600);
    }
  }, [step, typed]);

  // Animation sequence
  useEffect(() => {
    if (step === "center") {
      setTimeout(() => setStep("slide"), 700);
    }
    if (step === "slide") {
      setTimeout(() => setStep("typing"), 700);
    }
    if (step === "shrink") {
      // Calculate navbar logo position
      const navbarLogo = document.getElementById(navbarLogoId);
      const intro = introRef.current;
      if (navbarLogo && intro) {
        const logoRect = navbarLogo.getBoundingClientRect();
        const introRect = intro.getBoundingClientRect();
        // Calculate the difference
        const x = logoRect.left - introRect.left;
        const y = logoRect.top - introRect.top;
        const scale = 40 / introRect.width; // 40px is approx navbar logo size
        setTarget({ x, y, scale });
        setTimeout(() => setStep("done"), 900);
      } else {
        setTimeout(() => setStep("done"), 900);
      }
    }
    if (step === "done") {
      setTimeout(() => onFinish(), 200);
    }
  }, [step, onFinish]);

  return (
    <AnimatePresence>
      {step !== "done" && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          {/* Animated logo and text */}
          <motion.div
            ref={introRef}
            className="flex items-center"
            initial={{ x: 0, y: 0, scale: 1 }}
            animate={
              step === "shrink" && target
                ? { x: target.x, y: target.y, scale: 0.4 }
                : step === "slide"
                  ? { x: -120 }
                  : { x: 0, y: 0, scale: 1 }
            }
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
          >
            <Image
              src="/fav.png"
              alt="Logo"
              width={112} // or the actual width in pixels
              height={112} // or the actual height in pixels
              className="h-20 w-20 md:h-28 md:w-28 drop-shadow-xl"
              style={{ filter: "drop-shadow(0 4px 16px rgba(16,185,129,0.15))" }}
              priority
            />
            <motion.span
              className="ml-4 text-3xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: step === "typing" || step === "shrink" ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <span>{typed}</span>
              <span className="inline-block w-2 h-8 bg-emerald-600 animate-pulse align-middle ml-1" style={{ visibility: step === "typing" && typed.length < TYPING_TEXT.length ? "visible" : "hidden" }} />
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}