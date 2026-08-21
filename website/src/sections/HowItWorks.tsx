import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────
const steps = [
  {
    number: "01",
    label: "WRITE",
    title: "Write freely and openly..",
    body: "Open the editor. Write what you learned, felt, or wondered. No format. No pressure. Auto-save keeps every word.",
    chips: ["Rich text", "Auto-save", "Streaks"],
    flip: false,
  },
  {
    number: "02",
    label: "ANALYSE",
    title: "Gemini reads it.",
    body: "The moment you save, AI processes your entry — mood, topics, summary, quiz questions. All generated instantly.",
    chips: ["Mood AI", "Topics", "Summary"],
    flip: true,
  },
  {
    number: "03",
    label: "LEARN",
    title: "Insights that stick.",
    body: "Review your summary, take spaced quizzes, chat with your journal like ChatGPT — except it knows everything you wrote.",
    chips: ["Quizzes", "AI chat", "Insights"],
    flip: false,
  },
  {
    number: "04",
    label: "GROW",
    title: "Watch yourself level up.",
    body: "Streak charts, topic mastery, mood trends, and AI-suggested next steps — a living roadmap built from your own words.",
    chips: ["Streaks", "Charts", "Next steps"],
    flip: true,
  },
];

// ─── Single diagonal step ─────────────────────────────────────────────────────
function DiagonalStep({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "70vh" }}
    >
      {/* ── Diagonal slash divider ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: step.flip
            ? "linear-gradient(170deg, transparent 48%, rgba(232,184,109,0.04) 48%)"
            : "linear-gradient(10deg,  transparent 48%, rgba(232,184,109,0.04) 48%)",
        }}
      />

      {/* ── Giant ghost number — bleeds off screen ── */}
      <motion.div
        className="absolute pointer-events-none select-none"
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(16rem, 32vw, 40rem)",
          lineHeight: 1,
          color: "rgba(232,184,109,0.045)",
          letterSpacing: "-0.06em",
          top: "50%",
          left: step.flip ? "auto" : "-4%",
          right: step.flip ? "-4%" : "auto",
          transform: "translateY(-50%)",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
        initial={{ opacity: 0, x: step.flip ? 60 : -60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {step.number}
      </motion.div>

      {/* ── Amber slash line ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          height: "110%",
          width: "1px",
          top: "-5%",
          left: step.flip ? "42%" : "58%",
          background:
            "linear-gradient(to bottom, transparent, rgba(232,184,109,0.25), transparent)",
          transform: step.flip ? "rotate(-8deg)" : "rotate(8deg)",
          transformOrigin: "top",
        }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={isInView ? { scaleY: 1, opacity: 1 } : {}}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* ── Content ── */}
      <div
        className="relative z-10 flex items-center"
        style={{
          minHeight: "70vh",
          padding: "5rem clamp(1.5rem, 6vw, 6rem)",
          flexDirection: step.flip ? "row-reverse" : "row",
          gap: "clamp(2rem, 8vw, 8rem)",
          display: "flex",
        }}
      >
        {/* LEFT / RIGHT: Step label + number pill */}
        <motion.div
          style={{ flexShrink: 0 }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Vertical label */}
          <div
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              color: "rgba(232,184,109,0.5)",
              marginBottom: "1.5rem",
              textTransform: "uppercase",
            }}
          >
            {step.label}
          </div>

          {/* Number pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "rgba(232,184,109,0.08)",
              border: "1px solid rgba(232,184,109,0.2)",
              boxShadow: "0 0 30px rgba(232,184,109,0.08)",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.4rem",
                color: "#e8b86d",
              }}
            >
              {step.number}
            </span>
          </div>
        </motion.div>

        {/* TITLE — massive, takes up space */}
        <motion.div
          style={{ flex: "0 0 auto", maxWidth: "clamp(280px, 38vw, 520px)" }}
          initial={{ opacity: 0, x: step.flip ? 60 : -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(2.4rem, 5vw, 4.8rem)",
              lineHeight: 1.05,
              color: "#f5f0e8",
              letterSpacing: "-0.02em",
            }}
          >
            {step.title}
          </h3>

          {/* Amber underline sweep */}
          <motion.div
            style={{
              marginTop: "1.2rem",
              height: "2px",
              background: "linear-gradient(90deg, #e8b86d, transparent)",
              transformOrigin: step.flip ? "right" : "left",
              borderRadius: "2px",
              width: "45%",
            }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        {/* BODY + CHIPS */}
        <motion.div
          style={{ flex: 1, maxWidth: 600 }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "1rem",
              color: "#8a8070",
              lineHeight: 1.8,
              marginBottom: "1.8rem",
            }}
          >
            {step.body}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {step.chips.map((c, i) => (
              <motion.span
                key={c}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.35 }}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.78rem",
                  padding: "5px 14px",
                  borderRadius: "999px",
                  background: "rgba(232,184,109,0.07)",
                  border: "1px solid rgba(232,184,109,0.16)",
                  color: "rgba(232,184,109,0.65)",
                  letterSpacing: "0.02em",
                }}
              >
                {c}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Horizontal rule between steps ── */}
      {index < steps.length - 1 && (
        <motion.div
          className="absolute bottom-0 inset-x-0"
          style={{
            height: "1px",
            background: step.flip
              ? "linear-gradient(90deg, rgba(232,184,109,0.12), transparent)"
              : "linear-gradient(90deg, transparent, rgba(232,184,109,0.12))",
          }}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </div>
  );
}

// ─── Scrolling ticker ─────────────────────────────────────────────────────────
function Ticker() {
  const items = ["Write", "·", "Analyse", "·", "Learn", "·", "Grow", "·"];
  const repeated = [...items, ...items, ...items];

  return (
    <div
      className="relative overflow-hidden py-5"
      style={{
        borderTop: "1px solid rgba(232,184,109,0.08)",
        borderBottom: "1px solid rgba(232,184,109,0.08)",
        background: "rgba(232,184,109,0.02)",
      }}
    >
      <motion.div
        style={{ display: "flex", gap: "2rem", width: "max-content" }}
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: item === "·" ? "'DM Sans', sans-serif" : "'DM Serif Display', serif",
              fontSize: item === "·" ? "1rem" : "1.1rem",
              color: item === "·" ? "rgba(232,184,109,0.25)" : "rgba(232,184,109,0.45)",
              letterSpacing: item === "·" ? "0" : "0.05em",
              whiteSpace: "nowrap",
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      ref={sectionRef}
      style={{ background: "#0f0e0d", position: "relative", overflow: "hidden" }}
    >
      {/* Top border */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(232,184,109,0.2), transparent)",
          pointerEvents: "none",
        }}
      />

      {/* Parallax bg glow */}
      <motion.div
        style={{ y: bgY, position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <div style={{
          position: "absolute", left: "25%", top: "30%",
          width: 700, height: 700,
          background: "radial-gradient(circle, rgba(232,184,109,0.04) 0%, transparent 65%)",
          filter: "blur(100px)",
        }} />
      </motion.div>

      {/* Header */}
      <div
        style={{
          position: "relative", zIndex: 10,
          padding: "6rem clamp(1.5rem, 6vw, 6rem) 3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#e8b86d",
            marginBottom: "1.5rem",
          }}
        >
          ✦ How it works
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", flexWrap: "wrap" }}
        >
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              lineHeight: 1,
              color: "#f5f0e8",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Four steps.
          </h2>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              lineHeight: 1,
              color: "#e8b86d",
              letterSpacing: "-0.03em",
              margin: 0,
              opacity: 0.85,
            }}
          >
            Infinite growth.
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.22, duration: 0.7 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "1rem",
            color: "#8a8070",
            marginTop: "1.2rem",
            maxWidth: "420px",
            lineHeight: 1.7,
          }}
        >
          Write once. Let AI do the heavy lifting. Come back smarter every day.
        </motion.p>
      </div>

      {/* Ticker */}
      <Ticker />

      {/* Steps */}
      <div style={{ position: "relative", zIndex: 10 }}>
        {steps.map((step, i) => (
          <DiagonalStep key={step.number} step={step} index={i} />
        ))}
      </div>

      {/* Bottom strip */}
      <div
        style={{
          position: "relative", zIndex: 10,
          padding: "3rem clamp(1.5rem, 6vw, 6rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "#8a8070" }}>
          The whole loop takes{" "}
          <span style={{ color: "rgba(232,184,109,0.8)" }}>under 2 minutes</span> a day.
        </p>
        <div style={{ display: "flex", gap: "8px" }}>
          {steps.map((s, i) => (
            <motion.div
              key={s.number}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                background: "rgba(232,184,109,0.06)",
                border: "1px solid rgba(232,184,109,0.13)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.78rem",
                color: "rgba(232,184,109,0.55)",
              }}
            >
              {s.label}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom border */}
      <div
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(232,184,109,0.2), transparent)",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}