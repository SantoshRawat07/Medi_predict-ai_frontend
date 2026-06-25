import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useScroll, useSpring } from "framer-motion";
import {
  Activity,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Brain,
  ChevronDown,
  ClipboardList,
  FileHeart,
  HeartPulse,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plus,
  Search,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  X,
  Zap,
  Github,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react";
import heroImg from "@/assets/hero-medical.jpg";
import t1 from "@/assets/testimonial-1.jpg";
import t2 from "@/assets/testimonial-2.jpg";
import t3 from "@/assets/testimonial-3.jpg";
import { SUGGESTED_SYMPTOMS, predictDiseases, DISEASES, type Severity } from "@/data/diseases";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediPredict AI — Instant AI Disease Prediction from Symptoms" },
      {
        name: "description",
        content:
          "AI-powered disease prediction from your symptoms. Get top probable conditions, confidence scores, severity and prevention tips in seconds.",
      },
      { property: "og:title", content: "MediPredict AI — AI-Powered Disease Prediction" },
      {
        property: "og:description",
        content: "Instant AI symptom analysis with educational health insights.",
      },
    ],
  }),
  component: LandingPage,
});

/* ───────────────────────── Layout helpers ───────────────────────── */

const NAV = [
  { id: "home", label: "Home" },
  { id: "predict", label: "Predict" },
  { id: "services", label: "Services" },
  { id: "how", label: "How it works" },
  { id: "diseases", label: "Diseases" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function Section({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-24 py-20 md:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl px-5 md:px-8">{children}</div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-auto mb-14 max-w-2xl text-center"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <Sparkles className="size-3.5 text-accent" /> {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl md:text-5xl font-bold text-foreground">{title}</h2>
      {sub && <p className="mt-4 text-base md:text-lg text-muted-foreground">{sub}</p>}
    </motion.div>
  );
}

/* ───────────────────────── Page ───────────────────────── */

function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <LoadingOverlay />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <PredictionTool />
        <Services />
        <HowItWorks />
        <DiseaseInfo />
        <Stats />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

/* ───────────────────────── Loading + scroll ───────────────────────── */

function LoadingOverlay() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 700);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-background"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
            className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-elevated"
          >
            <HeartPulse className="size-7" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      style={{ scaleX: x, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-accent"
    />
  );
}

function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-elevated transition-transform hover:scale-110"
        >
          <ArrowUp className="size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── Navbar ───────────────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 md:px-6 py-3 transition-all ${
            scrolled ? "glass-card shadow-soft" : "bg-transparent"
          }`}
        >
          <button onClick={() => go("home")} className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
              <Stethoscope className="size-5" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              MediPredict<span className="text-accent">.AI</span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active === n.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active === n.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-secondary"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {n.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:block">
            <button
              onClick={() => go("predict")}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:scale-105"
            >
              Try Now <ArrowRight className="size-4" />
            </button>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden grid size-10 place-items-center rounded-xl bg-card shadow-soft"
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden mt-2 rounded-2xl glass-card p-3"
            >
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => go(n.id)}
                  className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium ${
                    active === n.id ? "bg-secondary text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

function Blobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-32 -left-24 size-[28rem] rounded-full bg-accent/20 blur-3xl animate-blob" />
      <div
        className="absolute top-40 -right-24 size-[26rem] rounded-full bg-primary/15 blur-3xl animate-blob"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 size-[22rem] rounded-full bg-accent/15 blur-3xl animate-blob"
        style={{ animationDelay: "6s" }}
      />
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="relative pt-32 md:pt-40 pb-16">
      <Blobs />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-3 py-1.5 text-xs font-medium text-muted-foreground"
            >
              <span className="relative grid size-2 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
                <span className="size-2 rounded-full bg-accent" />
              </span>
              AI Health Intelligence · v2.4
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="mt-5 text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight"
            >
              AI-Powered <br />
              <span className="gradient-text">Disease Prediction</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              Enter your symptoms and receive possible health condition predictions within seconds —
              with confidence scores, severity and prevention guidance.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  document.getElementById("predict")?.scrollIntoView({ behavior: "smooth" })
                }
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-elevated transition-transform hover:scale-[1.03]"
              >
                Start Prediction
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() =>
                  document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Learn More
              </button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-10 grid grid-cols-3 gap-4 max-w-md"
            >
              {[
                { icon: Brain, label: "Neural Engine" },
                { icon: HeartPulse, label: "Real-time" },
                { icon: ShieldCheck, label: "Private" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col items-start gap-2 rounded-2xl bg-card/60 backdrop-blur border border-border p-3"
                >
                  <div className="grid size-9 place-items-center rounded-lg bg-primary/5 text-primary">
                    <f.icon className="size-4.5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{f.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-square w-full max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-accent/30 via-primary/20 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-elevated">
                <img
                  src={heroImg}
                  alt="AI medical illustration with neural network overlay"
                  width={1024}
                  height={1024}
                  className="size-full object-cover"
                />
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -left-4 md:-left-10 top-12 glass-card rounded-2xl p-3 pr-4 flex items-center gap-3"
              >
                <div className="grid size-9 place-items-center rounded-xl bg-success/15 text-success">
                  <HeartPulse className="size-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Heart Rate</div>
                  <div className="text-sm font-bold">72 bpm</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.6 }}
                className="absolute -right-3 md:-right-8 bottom-16 glass-card rounded-2xl p-3 pr-4 flex items-center gap-3"
              >
                <div className="grid size-9 place-items-center rounded-xl bg-accent/15 text-accent">
                  <Brain className="size-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Analyzing</div>
                  <div className="text-sm font-bold">93% Match</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1.2 }}
                className="absolute right-8 -top-4 glass-card rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium"
              >
                <ShieldCheck className="size-3.5 text-success" /> HIPAA-grade
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Prediction Tool ───────────────────────── */

const sevTone: Record<Severity, { dot: string; bg: string; text: string; label: string }> = {
  Low: { dot: "bg-success", bg: "bg-success/10", text: "text-success", label: "Low" },
  Moderate: { dot: "bg-warning", bg: "bg-warning/10", text: "text-warning", label: "Moderate" },
  High: { dot: "bg-danger", bg: "bg-danger/10", text: "text-danger", label: "High" },
};

function PredictionTool() {
  const [selected, setSelected] = useState<string[]>(["Fever", "Headache"]);
  const [query, setQuery] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<ReturnType<typeof predictDiseases>>([]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return SUGGESTED_SYMPTOMS.filter(
      (s) => s.toLowerCase().includes(q) && !selected.includes(s),
    ).slice(0, 6);
  }, [query, selected]);

  const add = (s: string) => {
    const v = s.trim();
    if (!v) return;
    if (!selected.find((x) => x.toLowerCase() === v.toLowerCase())) {
      setSelected([...selected, v]);
    }
    setQuery("");
  };

  const remove = (s: string) => setSelected(selected.filter((x) => x !== s));

  const analyze = () => {
    if (selected.length === 0) return;
    setAnalyzing(true);
    setResults([]);
    setTimeout(() => {
      setResults(predictDiseases(selected));
      setAnalyzing(false);
    }, 900);
  };

  return (
    <Section id="predict" className="relative">
      <SectionHeading
        eyebrow="Symptom Analyzer"
        title="Disease Prediction Tool"
        sub="Add the symptoms you're experiencing — our model will suggest the most probable conditions."
      />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-4xl rounded-3xl glass-card p-6 md:p-10 shadow-elevated"
      >
        <label className="block text-sm font-semibold text-foreground">Search symptoms</label>
        <div className="relative mt-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add(query);
              }
            }}
            placeholder="e.g. Fever, Cough, Headache…"
            className="w-full rounded-2xl border border-border bg-background/70 pl-12 pr-28 py-3.5 text-sm font-medium outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15"
          />
          <button
            onClick={() => add(query)}
            disabled={!query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-40"
          >
            <Plus className="size-3.5" /> Add
          </button>
        </div>

        <AnimatePresence>
          {filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-2 rounded-2xl border border-border bg-card p-2 shadow-soft"
            >
              {filtered.map((s) => (
                <button
                  key={s}
                  onClick={() => add(s)}
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Quick add
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {SUGGESTED_SYMPTOMS.slice(0, 9).map((s) => {
              const isSel = selected.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => (isSel ? remove(s) : add(s))}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    isSel
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:bg-secondary"
                  }`}
                >
                  {isSel ? <X className="size-3" /> : <Plus className="size-3" />} {s}
                </button>
              );
            })}
          </div>
        </div>

        {selected.length > 0 && (
          <div className="mt-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Selected ({selected.length})
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <AnimatePresence>
                {selected.map((s) => (
                  <motion.span
                    layout
                    key={s}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-2 rounded-full bg-accent/10 text-accent border border-accent/20 px-3 py-1.5 text-xs font-semibold"
                  >
                    {s}
                    <button onClick={() => remove(s)} aria-label={`Remove ${s}`}>
                      <X className="size-3" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        <button
          onClick={analyze}
          disabled={selected.length === 0 || analyzing}
          className="mt-8 inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-elevated transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
        >
          {analyzing ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="inline-block size-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
              />
              Analyzing…
            </>
          ) : (
            <>
              <Brain className="size-4" /> Analyze Symptoms
            </>
          )}
        </button>

        <p className="mt-5 text-xs text-muted-foreground">
          <ShieldCheck className="inline size-3.5 -mt-0.5 mr-1 text-accent" />
          This AI tool is for educational purposes only and does not replace professional medical
          advice.
        </p>
      </motion.div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mx-auto mt-10 max-w-4xl"
          >
            <h3 className="text-lg font-semibold mb-4">Top possible conditions</h3>
            <div className="grid gap-4">
              {results.map((r, i) => {
                const tone = sevTone[r.disease.severity];
                return (
                  <motion.div
                    key={r.disease.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl border border-border bg-card p-6 shadow-soft"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          #{i + 1} match
                          <span className={`inline-flex items-center gap-1.5 rounded-full ${tone.bg} ${tone.text} px-2 py-0.5`}>
                            <span className={`size-1.5 rounded-full ${tone.dot}`} />
                            {tone.label} severity
                          </span>
                        </div>
                        <h4 className="mt-1 text-xl font-bold">{r.disease.name}</h4>
                        <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                          {r.disease.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold gradient-text">{r.confidence}%</div>
                        <div className="text-xs text-muted-foreground">confidence</div>
                      </div>
                    </div>

                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${r.confidence}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>

                    <div className="mt-5 grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Common symptoms
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {r.disease.symptoms.map((s) => (
                            <span
                              key={s}
                              className="rounded-full bg-secondary px-2.5 py-1 text-xs capitalize"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Prevention tips
                        </div>
                        <ul className="mt-2 space-y-1.5">
                          {r.disease.prevention.map((p) => (
                            <li key={p} className="flex items-start gap-2 text-sm">
                              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" /> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

/* ───────────────────────── Services ───────────────────────── */

const SERVICES = [
  {
    icon: Activity,
    title: "AI Symptom Analysis",
    desc: "Multi-symptom pattern recognition powered by curated medical datasets.",
  },
  {
    icon: Shield,
    title: "Health Risk Assessment",
    desc: "Severity scoring with low / moderate / high categorization for each match.",
  },
  {
    icon: Zap,
    title: "Instant Predictions",
    desc: "Top 3 probable conditions returned in under a second with confidence scores.",
  },
  {
    icon: BookOpen,
    title: "Medical Information",
    desc: "Plain-language descriptions, common symptoms and prevention guidance.",
  },
];

function Services() {
  return (
    <Section id="services" className="bg-[color:var(--whitesmoke)]">
      <SectionHeading
        eyebrow="What we offer"
        title="Services built for clarity"
        sub="A focused toolkit for understanding what your symptoms might mean."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className="group rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-elevated"
          >
            <div className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground transition-transform group-hover:scale-110 group-hover:rotate-3">
              <s.icon className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ───────────────────────── How it works ───────────────────────── */

const STEPS = [
  {
    icon: ClipboardList,
    title: "Enter Symptoms",
    desc: "Pick from our library or type your own — add as many as you like.",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    desc: "Our model scores each symptom pattern against known disease profiles.",
  },
  {
    icon: FileHeart,
    title: "Receive Predictions",
    desc: "Get the top 3 possible conditions with confidence and prevention tips.",
  },
];

function HowItWorks() {
  return (
    <Section id="how">
      <SectionHeading
        eyebrow="Process"
        title="How it works"
        sub="Three simple steps from symptoms to insights."
      />
      <div className="relative grid md:grid-cols-3 gap-6">
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        {STEPS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="relative text-center"
          >
            <div className="relative mx-auto grid size-24 place-items-center rounded-3xl bg-card border border-border shadow-soft">
              <s.icon className="size-9 text-primary" />
              <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-accent text-white text-xs font-bold shadow-soft">
                {i + 1}
              </span>
            </div>
            <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ───────────────────────── Disease Info ───────────────────────── */

const FEATURED = ["Diabetes", "Dengue", "Malaria", "Typhoid", "Tuberculosis", "Asthma"];

function DiseaseInfo() {
  return (
    <Section id="diseases" className="bg-[color:var(--whitesmoke)]">
      <SectionHeading
        eyebrow="Knowledge base"
        title="Common diseases at a glance"
        sub="Quick reference cards with key symptoms and prevention."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURED.map((name, i) => {
          const d = DISEASES.find((x) => x.name === name)!;
          const tone = sevTone[d.severity];
          return (
            <motion.article
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl bg-card border border-border p-6 shadow-soft transition-shadow hover:shadow-elevated"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold">{d.name}</h3>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full ${tone.bg} ${tone.text} px-2.5 py-1 text-xs font-semibold`}
                >
                  <span className={`size-1.5 rounded-full ${tone.dot}`} /> {tone.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{d.description}</p>

              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Symptoms
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {d.symptoms.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-secondary px-2.5 py-0.5 text-xs capitalize"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Prevention
                </div>
                <ul className="mt-1.5 space-y-1">
                  {d.prevention.slice(0, 2).map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" /> {p}
                    </li>
                  ))}
                </ul>
              </div>

              <button className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                Learn more
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}

/* ───────────────────────── Stats ───────────────────────── */

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

const STATS = [
  { value: 1000, suffix: "+", label: "Symptom Patterns" },
  { value: 50, suffix: "+", label: "Disease Categories" },
  { value: 99, suffix: "%", label: "Uptime, Real-Time" },
  { value: 800, suffix: "ms", label: "Avg Prediction Time" },
];

function Stats() {
  return (
    <Section id="stats" className="relative">
      <div className="relative rounded-[2rem] bg-primary text-primary-foreground p-8 md:p-14 overflow-hidden shadow-elevated">
        <div className="absolute -top-20 -right-20 size-80 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 size-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative grid md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-4xl md:text-5xl font-bold tracking-tight">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm text-primary-foreground/70">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ───────────────────────── Testimonials ───────────────────────── */

const TESTIMONIALS = [
  {
    img: t1,
    name: "Dr. Amara Khan",
    role: "Family Physician",
    rating: 5,
    text: "A genuinely useful triage companion. The confidence scoring helps patients ask better questions before visiting the clinic.",
  },
  {
    img: t2,
    name: "Marcus Reilly",
    role: "Health Educator",
    rating: 5,
    text: "Clean, calm interface — exactly what people need when they're feeling unwell. The prevention tips are a thoughtful touch.",
  },
  {
    img: t3,
    name: "Sofia Tanaka",
    role: "Wellness Coach",
    rating: 5,
    text: "I recommend MediPredict to clients as a starting point. Fast, clear, and respectful of medical complexity.",
  },
];

function Testimonials() {
  const [i, setI] = useState(0);
  const len = TESTIMONIALS.length;
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % len), 5500);
    return () => clearInterval(t);
  }, [len]);

  const t = TESTIMONIALS[i];
  return (
    <Section id="testimonials">
      <SectionHeading
        eyebrow="Testimonials"
        title="Trusted by health-minded people"
        sub="What clinicians, educators and users say about MediPredict."
      />
      <div className="mx-auto max-w-3xl">
        <div className="relative rounded-3xl glass-card p-8 md:p-12 shadow-elevated">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex gap-0.5 text-warning">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star key={k} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-5 text-lg md:text-2xl font-medium leading-relaxed text-foreground">
                "{t.text}"
              </p>
              <div className="mt-7 flex items-center gap-4">
                <img
                  src={t.img}
                  alt={t.name}
                  width={56}
                  height={56}
                  loading="lazy"
                  className="size-14 rounded-full object-cover border border-border"
                />
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-2">
            {TESTIMONIALS.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Show testimonial ${k + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  k === i ? "w-8 bg-primary" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ───────────────────────── FAQ ───────────────────────── */

const FAQS = [
  {
    q: "Is this medically accurate?",
    a: "MediPredict provides educational suggestions based on symptom patterns. It is not a diagnostic tool and should not replace consultation with a qualified medical professional.",
  },
  {
    q: "Can AI replace doctors?",
    a: "No. AI can help organize information and surface possibilities, but diagnosis and treatment require clinical judgement, examination and testing by a licensed clinician.",
  },
  {
    q: "How many symptoms can I enter?",
    a: "There is no hard limit — add as many relevant symptoms as you want. More precise input typically yields more focused predictions.",
  },
  {
    q: "Is my data stored?",
    a: "Symptom input runs locally in your browser for the demo. We do not persist personal health information without explicit consent.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" className="bg-[color:var(--whitesmoke)]">
      <SectionHeading
        eyebrow="FAQ"
        title="Questions, answered"
        sub="The most common things people ask before trying MediPredict."
      />
      <div className="mx-auto max-w-3xl space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 md:px-6 py-4 text-left"
              >
                <span className="font-semibold">{f.q}</span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-muted-foreground">
                  <ChevronDown className="size-5" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 md:px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ───────────────────────── Contact ───────────────────────── */

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <Section id="contact">
      <SectionHeading
        eyebrow="Contact"
        title="Get in touch"
        sub="Have a question or want to partner? We'd love to hear from you."
      />
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[
            { icon: Phone, label: "Phone", value: "+1 (415) 555-0188" },
            { icon: Mail, label: "Email", value: "hello@medipredict.ai" },
            { icon: MapPin, label: "Location", value: "San Francisco, CA" },
          ].map((c) => (
            <div
              key={c.label}
              className="flex items-start gap-4 rounded-2xl bg-card border border-border p-5 shadow-soft"
            >
              <div className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                <c.icon className="size-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {c.label}
                </div>
                <div className="mt-0.5 font-semibold">{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            setTimeout(() => setSent(false), 3000);
            (e.target as HTMLFormElement).reset();
          }}
          className="lg:col-span-3 rounded-3xl glass-card p-6 md:p-8 shadow-elevated space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Name">
              <input
                required
                maxLength={100}
                className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                required
                maxLength={255}
                className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
              />
            </Field>
          </div>
          <Field label="Message">
            <textarea
              required
              maxLength={1000}
              rows={5}
              className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 resize-none"
            />
          </Field>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.03]"
          >
            <Send className="size-4" />
            {sent ? "Message sent ✓" : "Send message"}
          </button>
        </form>
      </div>
    </Section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

/* ───────────────────────── Footer ───────────────────────── */

function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-10">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-xl bg-white/10">
                <Stethoscope className="size-5" />
              </div>
              <span className="font-display text-lg font-bold">
                MediPredict<span className="text-accent">.AI</span>
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm text-primary-foreground/70 leading-relaxed">
              AI-powered disease prediction for everyday health curiosity. Educational only — always
              consult a clinician for diagnosis.
            </p>
            <div className="mt-5 flex gap-2">
              {[Twitter, Linkedin, Facebook, Github].map((Ic, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid size-10 place-items-center rounded-xl bg-white/10 transition-colors hover:bg-white/20"
                >
                  <Ic className="size-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-3">Quick links</div>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="hover:text-primary-foreground transition-colors">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Legal</div>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground">Privacy</a></li>
              <li><a href="#" className="hover:text-primary-foreground">Terms</a></li>
              <li><a href="#" className="hover:text-primary-foreground">Disclaimer</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-primary-foreground/60">
          <div>© {new Date().getFullYear()} MediPredict AI. All rights reserved.</div>
          <div>Educational use only · Not a medical device.</div>
        </div>
      </div>
    </footer>
  );
}
