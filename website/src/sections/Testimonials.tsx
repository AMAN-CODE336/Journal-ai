import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "I've tried Notion, Obsidian, Roam — nothing made me actually learn from my notes. JournalAI is the first tool that reads what I write and teaches me back.",
    name: "Arjun Mehta",
    role: "Self-taught developer",
    avatar: "AM",
    size: "large",
  },
  {
    quote: "The mood tracking alone is worth it. I realized I learn best on Tuesday mornings. Wild.",
    name: "Sofia Reyes",
    role: "CS student, UNAM",
    avatar: "SR",
    size: "small",
  },
  {
    quote: "Chatting with my own journal is insane. Asked it what I struggled with last month — it knew exactly.",
    name: "James Okafor",
    role: "Lifelong learner",
    avatar: "JO",
    size: "medium",
  },
  {
    quote: "Free forever? I kept waiting for the paywall. It never came. Donated because I wanted to.",
    name: "Priya Nair",
    role: "UX designer & journaler",
    avatar: "PN",
    size: "small",
  },
  {
    quote: "The quizzes generated from my own entries are genuinely hard. Gemini actually reads what you write — it's not generic.",
    name: "Lucas Becker",
    role: "Backend engineer",
    avatar: "LB",
    size: "medium",
  },
  {
    quote: "I write every morning now. 67-day streak. The AI summary takes 2 seconds and I already know what I need to review.",
    name: "Yuki Tanaka",
    role: "Medical student",
    avatar: "YT",
    size: "large",
  },
  {
    quote: "Never journaled before. The AI insight on day 1 told me I was anxious about my job search. I hadn't even realized.",
    name: "Mia Christensen",
    role: "Recent grad",
    avatar: "MC",
    size: "small",
  },
  {
    quote: "Streak tracking + the 'what to learn next' feature is addictive in the best way.",
    name: "Ravi Shankar",
    role: "indie hacker",
    avatar: "RS",
    size: "small",
  },
  {
    quote: "The writing streak feature combined with AI summaries turned journaling from a chore into something I genuinely look forward to every morning.",
    name: "Elena Volkov",
    role: "Product manager",
    avatar: "EV",
    size: "medium",
  },
];

// ─── Column split ─────────────────────────────────────────────────────────────
const col1 = [testimonials[0], testimonials[3], testimonials[6]];
const col2 = [testimonials[1], testimonials[4], testimonials[7]];
const col3 = [testimonials[2], testimonials[5], testimonials[8]];

// ─── Single quote card ────────────────────────────────────────────────────────
function QuoteCard({
  item,
  index,
}: {
  item: (typeof testimonials)[0];
  index: number;
}) {
  const isLarge = item.size === "large";
  const isSmall = item.size === "small";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay: index * 0.1,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      style={{
        position: "relative",
        borderRadius: "20px",
        padding: isLarge ? "2rem" : isSmall ? "1.25rem 1.5rem" : "1.6rem",
        background: "linear-gradient(145deg, #1c1b19 0%, #141312 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        marginBottom: "16px",
        cursor: "default",
        overflow: "hidden",
      }}
    >
      {/* Ambient top-left glow on large cards */}
      {isLarge && (
        <div
          style={{
            position: "absolute",
            top: -40,
            left: -40,
            width: 180,
            height: 180,
            background: "radial-gradient(circle, rgba(232,184,109,0.08) 0%, transparent 70%)",
            filter: "blur(20px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Quote mark */}
      <div
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: isLarge ? "4rem" : "2.5rem",
          lineHeight: 0.8,
          color: "rgba(232,184,109,0.2)",
          marginBottom: "0.5rem",
          userSelect: "none",
        }}
      >
        "
      </div>

      {/* Quote text */}
      <p
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: isLarge ? "1.15rem" : isSmall ? "0.9rem" : "1rem",
          lineHeight: 1.65,
          color: isLarge ? "#f5f0e8" : "#c8bfb0",
          marginBottom: "1.2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {item.quote}
      </p>

      {/* Author row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: isSmall ? 28 : 34,
            height: isSmall ? 28 : 34,
            borderRadius: "50%",
            background: "rgba(232,184,109,0.12)",
            border: "1px solid rgba(232,184,109,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.6rem",
              color: "#e8b86d",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            {item.avatar}
          </span>
        </div>

        <div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8rem",
              color: "#f5f0e8",
              fontWeight: 500,
              lineHeight: 1.2,
            }}
          >
            {item.name}
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.72rem",
              color: "#8a8070",
              lineHeight: 1.2,
            }}
          >
            {item.role}
          </p>
        </div>

        {/* Stars */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "2px" }}>
          {[...Array(5)].map((_, i) => (
            <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M5 1l1.12 2.27L9 3.63 7 5.57l.47 2.74L5 7l-2.47 1.31L3 5.57 1 3.63l2.88-.36L5 1z"
                fill="#e8b86d"
                opacity={isSmall ? "0.5" : "0.75"}
              />
            </svg>
          ))}
        </div>
      </div>

      {/* Bottom accent line — only on large */}
      {isLarge && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(232,184,109,0.25), transparent)",
          }}
        />
      )}
    </motion.div>
  );
}

// ─── Parallax column ──────────────────────────────────────────────────────────
function ParallaxColumn({
  items,
  speed,
  delay,
}: {
  items: (typeof testimonials)[0][];
  speed: number;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -1}px`, `${speed}px`]);

  return (
    <motion.div
      ref={ref}
      style={{ y, flex: 1, minWidth: 0 }}
    >
      {items.map((item, i) => (
        <QuoteCard key={item.name} item={item} index={i + delay} />
      ))}
    </motion.div>
  );
}

// ─── Scrolling stat strip ─────────────────────────────────────────────────────
function StatStrip() {
  const stats = [
    { value: "2,400+", label: "Learners" },
    { value: "67 days", label: "Avg streak" },
    { value: "180k+", label: "Entries written" },
    { value: "100%", label: "Free forever" },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "0",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(232,184,109,0.02)",
        marginBottom: "5rem",
      }}
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
          style={{
            padding: "2rem 3rem",
            textAlign: "center",
            borderRight:
              i < stats.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
            flex: "1 1 140px",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "2.2rem",
              color: "#e8b86d",
              lineHeight: 1,
              marginBottom: "0.3rem",
            }}
          >
            {s.value}
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem",
              color: "#8a8070",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {s.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Testimonials() {
  return (
    <section
      style={{
        background: "#0f0e0d",
        position: "relative",
        overflow: "hidden",
        paddingBottom: "6rem",
      }}
    >
      {/* Top border */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(232,184,109,0.2), transparent)",
          pointerEvents: "none",
        }}
      />

      {/* Bg glow */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 40% at 50% 20%, rgba(232,184,109,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "relative", zIndex: 10,
          padding: "6rem clamp(1.5rem, 6vw, 6rem) 4rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
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
            marginBottom: "1.2rem",
          }}
        >
          ✦ What learners say
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2.6rem, 6vw, 5rem)",
            lineHeight: 1.05,
            color: "#f5f0e8",
            letterSpacing: "-0.02em",
            maxWidth: "700px",
          }}
        >
          People who write here{" "}
          <span style={{ color: "#e8b86d" }}>don't stop.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "1rem",
            color: "#8a8070",
            marginTop: "1rem",
            maxWidth: "440px",
            lineHeight: 1.7,
          }}
        >
          Real words from real learners. No incentives, no filters.
        </motion.p>
      </div>

      {/* Stat strip */}
      <StatStrip />

      {/* Floating masonry columns */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "0 clamp(1.5rem, 4vw, 4rem)",
          display: "flex",
          gap: "16px",
          alignItems: "flex-start",
        }}
      >
        <ParallaxColumn items={col1} speed={40} delay={0} />
        <ParallaxColumn items={col2} speed={-30} delay={3} />
        <ParallaxColumn items={col3} speed={50} delay={6} />
      </div>

      {/* Bottom CTA nudge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.7 }}
        style={{
          position: "relative", zIndex: 10,
          marginTop: "5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.2rem",
        }}
      >
        <div
          style={{
            height: "1px", width: "60px",
            background: "linear-gradient(90deg, transparent, rgba(232,184,109,0.4), transparent)",
          }}
        />
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.9rem",
            color: "#8a8070",
            textAlign: "center",
          }}
        >
          Join them. It takes 30 seconds to start.
        </p>
      </motion.div>

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