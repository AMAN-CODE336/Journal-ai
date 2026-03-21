import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";

// ─── Grain texture overlay ────────────────────────────────────────────────────
const GrainOverlay = () => (
  <svg
    className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-overlay"
    style={{ width: "100vw", height: "100vh" }}
  >
    <filter id="grain">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.65"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
);

// ─── Custom amber glow cursor ─────────────────────────────────────────────────
const GlowCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 280, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  const trailX = useSpring(cursorX, { damping: 45, stiffness: 150, mass: 1 });
  const trailY = useSpring(cursorY, { damping: 45, stiffness: 150, mass: 1 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* Glow trail */}
      <motion.div
        className="pointer-events-none fixed z-[9998] rounded-full"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          width: 80,
          height: 80,
          background:
            "radial-gradient(circle, rgba(232,184,109,0.18) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
      {/* Cursor dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: 10,
          height: 10,
          backgroundColor: "#e8b86d",
          boxShadow: "0 0 12px 3px rgba(232,184,109,0.6)",
        }}
      />
    </>
  );
};

// ─── Ambient amber orbs ───────────────────────────────────────────────────────
const AmbientOrbs = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {/* Left orb */}
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 520,
        height: 520,
        left: -160,
        top: "5%",
        background:
          "radial-gradient(circle, rgba(232,184,109,0.13) 0%, rgba(232,184,109,0.04) 50%, transparent 70%)",
        filter: "blur(40px)",
      }}
      animate={{ y: [0, -24, 0], scale: [1, 1.04, 1] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Right orb */}
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 600,
        height: 600,
        right: -200,
        top: "10%",
        background:
          "radial-gradient(circle, rgba(232,184,109,0.10) 0%, rgba(232,184,109,0.03) 50%, transparent 70%)",
        filter: "blur(50px)",
      }}
      animate={{ y: [0, 30, 0], scale: [1, 0.97, 1] }}
      transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
    />
    {/* Bottom center glow */}
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 800,
        height: 300,
        left: "50%",
        bottom: 0,
        translateX: "-50%",
        background:
          "radial-gradient(ellipse, rgba(232,184,109,0.09) 0%, transparent 65%)",
        filter: "blur(60px)",
      }}
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

// ─── Floating badge ───────────────────────────────────────────────────────────
const FloatingBadge = () => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm"
    style={{
      borderColor: "rgba(232,184,109,0.3)",
      background: "rgba(232,184,109,0.07)",
      color: "#e8b86d",
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: "0.02em",
    }}
  >
    <span
      className="inline-block h-1.5 w-1.5 rounded-full"
      style={{ backgroundColor: "#e8b86d", boxShadow: "0 0 6px 2px rgba(232,184,109,0.5)" }}
    />
    Free forever · No paywall · Powered by Gemini AI
  </motion.div>
);

// ─── Headline word animation ──────────────────────────────────────────────────
const words = ["Journal.", "Learn.", "Grow."];

const AnimatedHeadline = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % words.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: "1.15em", display: "inline-block" }}
    >
      {words.map((w, i) => (
        <motion.span
          key={w}
          className="absolute left-0"
          style={{ color: "#e8b86d" }}
          initial={{ y: "100%", opacity: 0 }}
          animate={
            i === current
              ? { y: "0%", opacity: 1 }
              : i === (current - 1 + words.length) % words.length
              ? { y: "-100%", opacity: 0 }
              : { y: "100%", opacity: 0 }
          }
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}
        </motion.span>
      ))}
    </div>
  );
};

// ─── Simulated app preview card ───────────────────────────────────────────────
const AppPreview = () => (
  <div
    className="relative w-full rounded-2xl overflow-hidden"
    style={{
      background: "#1a1917",
      border: "1px solid rgba(232,184,109,0.12)",
      boxShadow:
        "0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.6), 0 0 120px rgba(232,184,109,0.06)",
    }}
  >
    {/* Window chrome */}
    <div
      className="flex items-center gap-2 px-4 py-3"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#141312" }}
    >
      <span className="h-3 w-3 rounded-full" style={{ background: "#ff5f56" }} />
      <span className="h-3 w-3 rounded-full" style={{ background: "#ffbd2e" }} />
      <span className="h-3 w-3 rounded-full" style={{ background: "#27c93f" }} />
      <span
        className="ml-3 text-xs"
        style={{ color: "#8a8070", fontFamily: "'DM Sans', sans-serif" }}
      >
        journalai.app — Today's Entry
      </span>
    </div>

    {/* App content mockup */}
    <div className="flex" style={{ minHeight: 320 }}>
      {/* Sidebar */}
      <div
        className="hidden sm:flex flex-col gap-2 p-4"
        style={{ width: 200, borderRight: "1px solid rgba(255,255,255,0.05)", background: "#141312" }}
      >
        {["📓 Today", "📊 Progress", "💬 Chat AI", "🧠 Quizzes", "📈 Insights"].map(
          (item, i) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: i === 0 ? "rgba(232,184,109,0.1)" : "transparent",
                color: i === 0 ? "#e8b86d" : "#8a8070",
                border: i === 0 ? "1px solid rgba(232,184,109,0.2)" : "1px solid transparent",
              }}
            >
              {item}
            </div>
          )
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 flex flex-col gap-4">
        {/* Entry header */}
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-xs mb-1"
              style={{ color: "#8a8070", fontFamily: "'DM Sans', sans-serif" }}
            >
              March 20, 2026 · Day 42 🔥
            </p>
            <h3
              className="text-lg font-medium"
              style={{ color: "#f5f0e8", fontFamily: "'DM Serif Display', serif" }}
            >
              Learned about closures in JavaScript
            </h3>
          </div>
          <div
            className="text-xs px-2 py-1 rounded-full"
            style={{
              background: "rgba(232,184,109,0.1)",
              color: "#e8b86d",
              border: "1px solid rgba(232,184,109,0.2)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            😊 Curious
          </div>
        </div>

        {/* Entry text lines */}
        <div className="flex flex-col gap-2">
          {[
            { w: "95%" },
            { w: "88%" },
            { w: "76%" },
            { w: "92%" },
            { w: "60%" },
          ].map((line, i) => (
            <div
              key={i}
              className="h-2.5 rounded-full"
              style={{
                width: line.w,
                background: "rgba(245,240,232,0.08)",
              }}
            />
          ))}
        </div>

        {/* AI insight card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-auto rounded-xl p-4"
          style={{
            background: "rgba(232,184,109,0.06)",
            border: "1px solid rgba(232,184,109,0.15)",
          }}
        >
          <p
            className="text-xs font-medium mb-1"
            style={{ color: "#e8b86d", fontFamily: "'DM Sans', sans-serif" }}
          >
            ✦ AI Insight
          </p>
          <p
            className="text-xs leading-relaxed"
            style={{ color: "#8a8070", fontFamily: "'DM Sans', sans-serif" }}
          >
            You've mentioned closures 3 times this week — ready for a quiz on lexical scope?
          </p>
        </motion.div>
      </div>
    </div>
  </div>
);

// ─── Main Hero ────────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <>
      <GrainOverlay />
      <GlowCursor />

      <section
        className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden pt-32 pb-0"
        style={{ background: "#0f0e0d" }}
      >
        <AmbientOrbs />

        {/* Subtle grid lines */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,240,232,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,0.025) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full">
          {/* Badge */}
          <FloatingBadge />

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 leading-[1.05] tracking-tight"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(3.2rem, 8vw, 6.5rem)",
              color: "#f5f0e8",
            }}
          >
            Your journal that
            <br />
            makes you{" "}
            <AnimatedHeadline />
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-lg leading-relaxed"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "#8a8070",
            }}
          >
            Write daily. Let Gemini AI turn your entries into summaries, quizzes,
            and insights — your personal learning coach, free forever.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              to="/register"
              className="group relative inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium transition-all duration-300"
              style={{
                background: "#e8b86d",
                color: "#0f0e0d",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 0 40px rgba(232,184,109,0.25)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 60px rgba(232,184,109,0.45)";
                (e.currentTarget as HTMLElement).style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 40px rgba(232,184,109,0.25)";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              Start journaling free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium transition-all duration-200"
              style={{
                background: "transparent",
                color: "#8a8070",
                fontFamily: "'DM Sans', sans-serif",
                border: "1px solid rgba(138,128,112,0.3)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#f5f0e8";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,240,232,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#8a8070";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(138,128,112,0.3)";
              }}
            >
              Sign in
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="mt-6 text-xs"
            style={{ color: "#8a8070", fontFamily: "'DM Sans', sans-serif" }}
          >
            Join 2,400+ learners · No credit card · No paywall · Ever
          </motion.p>

          {/* App Preview — peeks from bottom */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 w-full max-w-4xl mx-auto"
            style={{
              maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
            }}
          >
            <AppPreview />
          </motion.div>
        </div>

        {/* Bottom border glow */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(232,184,109,0.3), transparent)",
          }}
        />
      </section>
    </>
  );
}