import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Feature {
  number: string;
  title: string;
  description: string;
  tag: string;
  icon: string;
  depth: number; // parallax depth multiplier
  initialX: number; // entry offset
}

// ─── Feature data ─────────────────────────────────────────────────────────────
const features: Feature[] = [
  {
    number: "01",
    title: "AI Summary & Topics",
    description:
      "Every entry is automatically distilled into a crisp summary with key topics extracted — so you always know what you learned.",
    tag: "Gemini AI",
    icon: "✦",
    depth: 1.2,
    initialX: -60,
  },
  {
    number: "02",
    title: "Mood Detection",
    description:
      "Your writing reveals how you feel. JournalAI reads emotional tone across entries and maps your mood journey over time.",
    tag: "Emotional Intelligence",
    icon: "◈",
    depth: 0.8,
    initialX: 60,
  },
  {
    number: "03",
    title: "Chat With Your Journal",
    description:
      "Ask anything — \"What did I learn about React last month?\" — and get answers grounded in your own writing. Like ChatGPT, but it knows you.",
    tag: "RAG Memory",
    icon: "⬡",
    depth: 1.5,
    initialX: -40,
  },
  {
    number: "04",
    title: "Quizzes & Recall",
    description:
      "AI generates quizzes from your entries using spaced repetition logic. Turn passive journaling into active learning that sticks.",
    tag: "Active Recall",
    icon: "◎",
    depth: 0.6,
    initialX: 50,
  },
  {
    number: "05",
    title: "What To Learn Next",
    description:
      "Based on your writing patterns, JournalAI suggests the next topic to explore — a personalized learning path built from your own words.",
    tag: "Learning Coach",
    icon: "▲",
    depth: 1.0,
    initialX: -50,
  },
  {
    number: "06",
    title: "Progress Analytics",
    description:
      "Streaks, topics mastered, mood trends, writing volume — beautiful charts that make your growth visible and addictive.",
    tag: "Visual Analytics",
    icon: "◐",
    depth: 0.9,
    initialX: 40,
  },
];

// ─── Portal Ring (ambient 3D centerpiece) ─────────────────────────────────────
const PortalRing = ({ scrollY }: { scrollY: ReturnType<typeof useMotionValue<number>> }) => {
  const rotate = useTransform(scrollY, [0, 1000], [0, 120]);
  const scale = useTransform(scrollY, [0, 600], [0.85, 1.15]);
  const opacity = useTransform(scrollY, [0, 200, 600, 900], [0, 1, 1, 0]);

  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{
        translateX: "-50%",
        translateY: "-50%",
        opacity,
        scale,
        width: 520,
        height: 520,
      }}
    >
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          rotate,
          border: "1px solid rgba(232,184,109,0.12)",
          boxShadow:
            "0 0 80px 20px rgba(232,184,109,0.05), inset 0 0 80px 20px rgba(232,184,109,0.03)",
        }}
      />
      {/* Middle ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: 50,
          rotate: useTransform(scrollY, [0, 1000], [0, -80]),
          border: "1px solid rgba(232,184,109,0.18)",
          boxShadow: "0 0 40px 8px rgba(232,184,109,0.07)",
        }}
      />
      {/* Inner glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: 120,
          background:
            "radial-gradient(circle, rgba(232,184,109,0.1) 0%, rgba(232,184,109,0.02) 60%, transparent 80%)",
          filter: "blur(20px)",
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Orbiting dot */}
      <motion.div
        className="absolute"
        style={{
          width: 6,
          height: 6,
          top: "50%",
          left: "50%",
          marginTop: -3,
          marginLeft: -3,
          rotate,
          transformOrigin: "3px 3px",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#e8b86d",
            top: -257,
            left: 0,
            boxShadow: "0 0 12px 4px rgba(232,184,109,0.6)",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

// ─── 3D Feature Card ──────────────────────────────────────────────────────────
const FeatureCard = ({
  feature,
  index,
  sectionScrollY,
}: {
  feature: Feature;
  index: number;
  sectionScrollY: ReturnType<typeof useMotionValue<number>>;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    damping: 30,
    stiffness: 200,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    damping: 30,
    stiffness: 200,
  });

  // Parallax vertical drift on scroll
  const y = useTransform(
    sectionScrollY,
    [0, 800],
    [0, -feature.depth * 40]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      style={{ y, perspective: 1000 }}
      initial={{ opacity: 0, x: feature.initialX, y: 40 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        delay: index * 0.08,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative rounded-2xl p-6 h-full cursor-default"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Card background with glassmorphism */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(34,33,32,0.9) 0%, rgba(26,25,23,0.95) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)",
          }}
        />

        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(232,184,109,0.07) 0%, transparent 60%)",
          }}
          whileHover={{ opacity: 1 }}
        />

        {/* 3D floating number (translateZ lifts it above card surface) */}
        <div
          className="relative z-10"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="flex items-start justify-between mb-5">
            <span
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "3rem",
                lineHeight: 1,
                color: "rgba(232,184,109,0.15)",
                letterSpacing: "-0.02em",
              }}
            >
              {feature.number}
            </span>
            <span
              className="text-xl"
              style={{ color: "rgba(232,184,109,0.6)" }}
            >
              {feature.icon}
            </span>
          </div>

          {/* Tag */}
          <div className="mb-3">
            <span
              className="text-xs rounded-full px-2.5 py-1"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: "rgba(232,184,109,0.08)",
                color: "rgba(232,184,109,0.7)",
                border: "1px solid rgba(232,184,109,0.15)",
                letterSpacing: "0.04em",
              }}
            >
              {feature.tag}
            </span>
          </div>

          {/* Title */}
          <h3
            className="mb-3 text-xl leading-tight"
            style={{
              fontFamily: "'DM Serif Display', serif",
              color: "#f5f0e8",
            }}
          >
            {feature.title}
          </h3>

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "#8a8070",
            }}
          >
            {feature.description}
          </p>

          {/* Bottom accent line */}
          <motion.div
            className="mt-5 h-px w-0"
            style={{ background: "rgba(232,184,109,0.3)" }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Floating depth particles ─────────────────────────────────────────────────
const DepthParticles = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {[
      { x: "15%", y: "20%", size: 2, opacity: 0.4, dur: 6 },
      { x: "80%", y: "15%", size: 3, opacity: 0.25, dur: 8 },
      { x: "60%", y: "70%", size: 1.5, opacity: 0.35, dur: 5 },
      { x: "25%", y: "75%", size: 2.5, opacity: 0.2, dur: 9 },
      { x: "90%", y: "50%", size: 2, opacity: 0.3, dur: 7 },
      { x: "10%", y: "55%", size: 1.5, opacity: 0.25, dur: 11 },
      { x: "50%", y: "35%", size: 3, opacity: 0.15, dur: 10 },
      { x: "70%", y: "85%", size: 2, opacity: 0.3, dur: 6.5 },
    ].map((p, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          left: p.x,
          top: p.y,
          width: p.size,
          height: p.size,
          background: "#e8b86d",
          opacity: p.opacity,
          boxShadow: `0 0 ${p.size * 4}px ${p.size}px rgba(232,184,109,0.4)`,
        }}
        animate={{ y: [0, -20, 0], opacity: [p.opacity, p.opacity * 1.5, p.opacity] }}
        transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
      />
    ))}
  </div>
);

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeader = () => (
  <div className="relative z-10 flex flex-col items-center text-center mb-20">
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-4 text-xs tracking-[0.2em] uppercase"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        color: "#e8b86d",
      }}
    >
      ✦ What's inside
    </motion.span>

    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="leading-[1.05] tracking-tight"
      style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
        color: "#f5f0e8",
      }}
    >
      Everything your learning
      <br />
      <span style={{ color: "#e8b86d" }}>needs to level up</span>
    </motion.h2>

    <motion.p
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.7 }}
      className="mt-5 max-w-lg text-base leading-relaxed"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        color: "#8a8070",
      }}
    >
      Six AI-powered tools that transform your daily journal into a
      full personal learning system — free, forever.
    </motion.p>

    {/* Decorative line */}
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8 h-px w-24"
      style={{
        background: "linear-gradient(90deg, transparent, #e8b86d, transparent)",
        transformOrigin: "center",
      }}
    />
  </div>
);

// ─── Main Features Section ────────────────────────────────────────────────────
export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Raw scrollY for portal ring rotation (absolute pixels)
  const { scrollY } = useScroll();

  // Background parallax layers
  const bgY1 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-32"
      style={{ background: "#0f0e0d" }}
    >
      {/* ── Parallax background layer 1 — left amber smear */}
      <motion.div
        className="pointer-events-none absolute"
        style={{
          y: bgY1,
          left: -200,
          top: "10%",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(232,184,109,0.07) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Parallax background layer 2 — right orb */}
      <motion.div
        className="pointer-events-none absolute"
        style={{
          y: bgY2,
          right: -150,
          top: "30%",
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(232,184,109,0.05) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />

      {/* ── Portal ring (absolute center of section) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <PortalRing scrollY={scrollY} />
      </div>

      {/* ── Depth particles */}
      <DepthParticles />

      {/* ── Top border */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(232,184,109,0.2), transparent)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <SectionHeader />

        {/* 3D Card Grid */}
        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            perspective: "1200px",
          }}
        >
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.number}
              feature={feature}
              index={i}
              sectionScrollY={scrollY}
            />
          ))}
        </div>

        {/* Bottom CTA nudge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-20 flex flex-col items-center gap-3"
        >
          <p
            className="text-sm"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "#8a8070",
            }}
          >
            All features included — no tiers, no upgrades, no paywall.
          </p>
          <div className="flex items-center gap-2">
            {["AI Summary", "Mood Tracking", "Quizzes", "Chat AI", "Analytics"].map(
              (tag, i) => (
                <span
                  key={tag}
                  className="text-xs rounded-full px-3 py-1 hidden sm:inline-block"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    background: "rgba(245,240,232,0.04)",
                    color: "#8a8070",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom border */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(232,184,109,0.2), transparent)",
        }}
      />
    </section>
  );
} 