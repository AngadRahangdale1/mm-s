import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Menu, X } from "lucide-react";
import { EstimateDialog } from "@/components/site/estimate-dialog";

const NAV = [
  { href: "#practice", label: "Practice" },
  { href: "#values", label: "Core Values" },
  { href: "#work", label: "Work" },
  { href: "#studio", label: "Studio & Team" },
  { href: "#contact", label: "Contact" },
];

const CORE_VALUES = [
  {
    index: "01",
    title: "People First",
    copy: "We design around the people who live or work in the space.",
  },
  {
    index: "02",
    title: "Creativity with Purpose",
    copy: "Fresh ideas that are both beautiful and practical.",
  },
  {
    index: "03",
    title: "Attention to Detail",
    copy: "Every element matters, from the big picture to the finer details.",
  },
  {
    index: "04",
    title: "Material Authenticity",
    copy: "Thoughtful selection of materials that add character and longevity.",
  },
  {
    index: "05",
    title: "Integrated Approach",
    copy: "A seamless balance of design, technical planning and execution.",
  },
];

const TEAM = [
  {
    name: "Monalisa Saha",
    role: "CO-FOUNDER & CREATIVE DIRECTOR",
    copy: "Leading spatial conceptualization, aesthetic direction, and bespoke interior identity.",
  },
  {
    name: "Shazaib Akram",
    role: "CO-FOUNDER & TECHNICAL DIRECTOR",
    copy: "Directing architectural detailing, technical workflows, and turnkey on-site execution.",
  },
];

const SERVICES = [
  {
    index: "01",
    title: "Interior design",
    copy: "Planning, proportion, and the last textile. Rooms shaped around how you live — light first, then the materials you will actually touch.",
    image: "/media/window-seat.jpg",
    alt: "Linen sofa beside a tall garden window with oak frames and sheer curtains",
  },
  {
    index: "02",
    title: "Turnkey renovation",
    copy: "One point of contact from demolition to handover. Trades, timing, and the budget stay with the studio. You receive a room that is ready.",
    image: "/media/kitchen.jpg",
    alt: "Walnut kitchen with a pale stone island and morning light",
  },
  {
    index: "03",
    title: "Material selection",
    copy: "Stone, timber, textile, metal. Every surface is chosen to age with the light you have, and to feel right under the hand.",
    image: "/media/walnut-stone.jpg",
    alt: "Vertical walnut slats meeting a floating limestone bench",
  },
];

const WORK = [
  {
    index: "01",
    title: "The Window Room",
    kind: "Daylight living",
    meta: "Garden house · 11 weeks",
    image: "/media/window-seat.jpg",
    alt: "A quiet living room with a linen sofa, oak floor, and a wall of garden windows",
  },
  {
    index: "02",
    title: "Evening Hall",
    kind: "Gathering room",
    meta: "Wood and stone · 14 weeks",
    image: "/media/evening-room.jpg",
    alt: "Evening living room with a walnut feature wall, cream sofa, and stone coffee table",
  },
  {
    index: "03",
    title: "Walnut Bench",
    kind: "Entry study",
    meta: "Materials · 6 weeks",
    image: "/media/walnut-stone.jpg",
    alt: "Close view of walnut slat wall and a thick limestone floating bench",
  },
  {
    index: "04",
    title: "Morning Kitchen",
    kind: "Turnkey kitchen",
    meta: "Apartment · 9 weeks",
    image: "/media/kitchen.jpg",
    alt: "Quiet kitchen in walnut and limestone with sculptural oak stools",
  },
  {
    index: "05",
    title: "Limewash Bath",
    kind: "Bathing room",
    meta: "House · 8 weeks",
    image: "/media/bath.jpg",
    alt: "Freestanding limestone tub in a limewashed bathing room with a walnut vanity",
  },
];

export function Landing() {
  const [phase, setPhase] = useState<"intro" | "leaving" | "done">("intro");
  const [pct, setPct] = useState(0);
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const [estimate, setEstimate] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const workRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const skipped = useRef(false);

  function dismissIntro() {
    skipped.current = true;
    setPhase("done");
  }

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("done");
      setPct(100);
      return;
    }
    let frame = 0;
    let timer = 0;
    const start = performance.now();
    const duration = 1100;
    const tick = (now: number) => {
      if (skipped.current) return;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setPct(Math.round(eased * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else timer = window.setTimeout(() => {
        if (!skipped.current) setPhase("leaving");
      }, 180);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (phase === "done") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || phase !== "done") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      video.pause();
      return;
    }
    video.play().catch(() => { });
  }, [phase]);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.82);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <div className="bg-paper text-ink">
      {phase !== "done" && (
        <div
          className={
            phase === "leaving"
              ? "intro-out fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper px-6 text-ink"
              : "fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper px-6 text-ink"
          }
          onAnimationEnd={(event) => {
            if (event.animationName === "iris") setPhase("done");
          }}
        >
          <p className="eyebrow text-muted">Mishaye Studio</p>
          <p className="mt-6 text-7xl font-medium tabular-nums tracking-tight md:text-8xl">{pct}%</p>
          <div className="mt-6 h-px w-40 bg-line" />
          <p className="eyebrow mt-5 text-muted">Composing the room</p>
          <button
            type="button"
            onClick={dismissIntro}
            className="absolute bottom-10 eyebrow text-muted"
          >
            Skip
          </button>
        </div>
      )}

      <header
        className={
          solid || menu
            ? "fixed inset-x-0 top-0 z-40 border-b border-line bg-paper text-ink"
            : "fixed inset-x-0 top-0 z-40 text-cream"
        }
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="#top" className="text-base font-semibold tracking-wider uppercase">
            Mishaye Studio
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-sm">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEstimate(true)}
              className={
                solid
                  ? "hidden rounded-full bg-ink px-4 py-2 text-sm text-cream md:inline-flex"
                  : "hidden rounded-full bg-cream px-4 py-2 text-sm text-ink md:inline-flex"
              }
            >
              Estimate
            </button>
            <button
              type="button"
              className={
                solid || menu
                  ? "grid size-11 place-items-center rounded-full border border-line md:hidden"
                  : "grid size-11 place-items-center rounded-full border border-cream/50 md:hidden"
              }
              aria-label={menu ? "Close menu" : "Open menu"}
              onClick={() => setMenu((value) => !value)}
            >
              {menu ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-30 flex flex-col bg-paper px-6 pt-24 text-ink md:hidden">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenu(false)}
              className="border-b border-line py-4 text-3xl tracking-tight"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMenu(false);
              setEstimate(true);
            }}
            className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-cream"
          >
            <span className="eyebrow">Calculate the estimate</span>
            <span className="grid size-11 place-items-center rounded-full bg-cream text-ink">
              <ArrowRight className="size-4" />
            </span>
          </button>
        </div>
      )}

      <main id="top">
        <section className="relative flex min-h-dvh items-end overflow-hidden bg-ink text-cream md:items-center">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src="/media/room.mp4"
            poster="/media/poster.jpg"
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
          />
          <div className="hero-veil absolute inset-0" />
          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-20 pt-28 text-center md:pb-16">
            <p className="eyebrow">Interior design & turnkey renovation</p>
            <h1 className="wordmark mt-6">
              <span className="block">Mishaye</span>
              <span className="block">Studio</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-cream/90">Creating interiors that settle.</p>
            <button
              type="button"
              onClick={() => setEstimate(true)}
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-cream py-2 pl-5 pr-2 text-ink"
            >
              <span className="eyebrow">Calculate the estimate</span>
              <span className="grid size-11 place-items-center rounded-full bg-ink text-cream">
                <ArrowRight className="size-4" aria-hidden />
              </span>
            </button>
            <a href="#practice" className="mt-14 inline-flex flex-col items-center gap-3">
              <span className="eyebrow text-cream/80">Scroll</span>
              <span className="block h-10 w-px bg-cream/70" />
            </a>
          </div>
        </section>

        <section id="practice" className="scroll-mt-20 mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-32">
          <Reveal>
            <p className="eyebrow text-muted">01 — 03 · What we do</p>
            <h2 className="chapter mt-5 max-w-3xl">
              Three disciplines. One studio holds them, from the first measured drawing to the last
              oil on the walnut.
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-20 md:mt-24">
            {SERVICES.map((service, index) => (
              <Reveal key={service.index}>
                <article
                  className={
                    index % 2 === 1
                      ? "grid items-center gap-8 md:grid-cols-2 md:gap-16"
                      : "grid items-center gap-8 md:grid-cols-2 md:gap-16"
                  }
                >
                  <div className={index % 2 === 1 ? "md:order-2" : ""}>
                    <p className="eyebrow text-muted">№ {service.index}</p>
                    <h3 className="mt-3 text-4xl tracking-tight">{service.title}</h3>
                    <p className="mt-4 max-w-md text-ink-soft">{service.copy}</p>
                  </div>
                  <img
                    src={service.image}
                    alt={service.alt}
                    className={
                      index % 2 === 1
                        ? "aspect-[4/3] w-full object-cover md:order-1"
                        : "aspect-[4/3] w-full object-cover"
                    }
                  />
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="values" className="scroll-mt-20 border-t border-line bg-paper py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <Reveal>
              <p className="eyebrow text-muted">02 · Principles</p>
              <h2 className="chapter mt-4 max-w-2xl">Our Core Values</h2>
              <p className="mt-4 max-w-xl text-ink-soft">
                Principles that guide every proportion, joint, and surface we shape.
              </p>
            </Reveal>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-20">
              {CORE_VALUES.map((val) => (
                <Reveal key={val.index}>
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-line bg-cream/70 p-8 transition-colors hover:border-walnut/40">
                    <div>
                      <p className="eyebrow text-muted">№ {val.index}</p>
                      <h3 className="mt-4 text-xl font-medium tracking-tight uppercase text-ink">{val.title}</h3>
                      <p className="mt-3 text-ink-soft leading-relaxed">{val.copy}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="scroll-mt-20 py-24 md:py-32">
          <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-6 md:px-8">
            <Reveal>
              <p className="eyebrow text-muted">Selected work</p>
              <h2 className="chapter mt-4 max-w-xl">Recent rooms</h2>
            </Reveal>
            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                aria-label="Previous rooms"
                onClick={() =>
                  workRef.current?.scrollBy({
                    left: -workRef.current.clientWidth * 0.8,
                    behavior: "smooth",
                  })
                }
                className="grid size-11 place-items-center rounded-full border border-line"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next rooms"
                onClick={() =>
                  workRef.current?.scrollBy({
                    left: workRef.current.clientWidth * 0.8,
                    behavior: "smooth",
                  })
                }
                className="grid size-11 place-items-center rounded-full border border-line"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
          <div
            ref={workRef}
            className="work-row mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 md:px-8"
          >
            {WORK.map((project) => (
              <article key={project.title} className="work-card shrink-0 snap-start">
                <img src={project.image} alt={project.alt} className="aspect-[16/10] w-full object-cover" />
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <div>
                    <p className="eyebrow text-muted">№ {project.index}</p>
                    <h3 className="mt-1 text-2xl tracking-tight">{project.title}</h3>
                  </div>
                  <p className="text-right text-sm text-muted">
                    {project.kind}
                    <span className="mt-1 block">{project.meta}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="studio" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-32">
            <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
              <Reveal>
                <p className="eyebrow text-muted">The studio</p>
                <h2 className="chapter mt-4">A small practice for rooms that should feel already resolved.</h2>
                <p className="mt-6 text-ink-soft">
                  Mishaye takes few commissions at a time, so each one can be composed rather than
                  decorated. Proportion first, then light, then the surface you live with every day.
                </p>
                <p className="mt-4 text-ink-soft">
                  When you want one hand on the whole job, the same studio carries the renovation
                  through handover.
                </p>
                <dl className="mt-12 grid gap-8 sm:grid-cols-3">
                  <Stat value="64" label="Rooms composed" />
                  <Stat value="11" label="Years in practice" />
                  <Stat value="3" label="Disciplines, one studio" />
                </dl>
              </Reveal>
              <img
                src="/media/evening-room.jpg"
                alt="Cream seating and a walnut wall in an evening living room"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>

            <div className="mt-20 border-t border-line pt-16 md:mt-28 md:pt-20">
              <Reveal>
                <p className="eyebrow text-muted">Leadership</p>
                <h3 className="chapter mt-3">Our Team</h3>
              </Reveal>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                {TEAM.map((member) => (
                  <Reveal key={member.name}>
                    <div className="rounded-2xl border border-line bg-cream/70 p-8 transition-colors hover:border-walnut/40">
                      <p className="eyebrow text-walnut">{member.role}</p>
                      <h4 className="mt-3 text-3xl font-medium tracking-tight text-ink">{member.name}</h4>
                      <p className="mt-3 text-ink-soft">{member.copy}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-20 relative overflow-hidden bg-ink text-cream">
          <img
            src="/media/bath.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-ink/55" />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-end md:gap-16 md:px-8 md:py-28">
            <div>
              <p className="eyebrow text-cream/70">Let’s talk</p>
              <h2 className="chapter mt-4">Creating a quiet interior.</h2>
              <p className="mt-6 max-w-sm text-cream/85">
                Tell us the room, the house, or just the feeling you want when you walk in. Studio
                visits are by appointment.
              </p>
              <button
                type="button"
                onClick={() => setEstimate(true)}
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-cream py-2 pl-5 pr-2 text-ink"
              >
                <span className="eyebrow">Calculate the estimate</span>
                <span className="grid size-11 place-items-center rounded-full bg-ink text-cream">
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </button>

              <div className="mt-12 border-t border-cream/20 pt-8 space-y-4 text-cream/90 text-sm">
                <div>
                  <p className="eyebrow text-cream/60">Our Location</p>
                  <p className="mt-1 text-base font-medium">Delhi NCR, India</p>
                </div>
                <div>
                  <p className="eyebrow text-cream/60">Contact Numbers</p>
                  <div className="mt-1 flex flex-col gap-1 text-base">
                    <a href="tel:+919205419042" className="hover:underline">+91 9205419042</a>
                    <a href="tel:+918826981268" className="hover:underline">+91 8826981268</a>
                  </div>
                </div>
                <div>
                  <p className="eyebrow text-cream/60">Email</p>
                  <p className="mt-1 text-base">
                    <a href="mailto:mishaye.studio@gmail.com" className="hover:underline">mishaye.studio@gmail.com</a>
                  </p>
                </div>
                <div className="flex flex-wrap gap-8 pt-1">
                  <div>
                    <p className="eyebrow text-cream/60">Website</p>
                    <a href="https://www.mishayestudio.com" target="_blank" rel="noreferrer" className="mt-1 inline-block hover:underline text-base">www.mishayestudio.com</a>
                  </div>
                  <div>
                    <p className="eyebrow text-cream/60">Instagram</p>
                    <a href="https://instagram.com/mishaye.studio" target="_blank" rel="noreferrer" className="mt-1 inline-block hover:underline text-base">@mishaye.studio</a>
                  </div>
                </div>
              </div>
            </div>
            {sent ? (
              <div className="flex items-end">
                <p className="chapter">Received. We’ll reply within two working days.</p>
              </div>
            ) : (
              <form
                className="flex flex-col justify-end"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const data = new FormData(event.currentTarget);
                  const entry = {
                    name: String(data.get("name") || ""),
                    email: String(data.get("email") || ""),
                    note: String(data.get("note") || ""),
                    at: new Date().toISOString(),
                  };
                  const key = "mishaye-notes";
                  let prev: unknown[] = [];
                  try {
                    const parsed = JSON.parse(localStorage.getItem(key) || "[]") as unknown;
                    if (Array.isArray(parsed)) prev = parsed;
                  } catch {
                    prev = [];
                  }
                  localStorage.setItem(key, JSON.stringify([entry, ...prev].slice(0, 20)));

                  setSubmitting(true);
                  try {
                    const res = await fetch("https://api.web3forms.com/submit", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                      },
                      body: JSON.stringify({
                        access_key: "9b223c12-7628-4ec7-b90b-2add39846fe2",
                        name: entry.name,
                        email: entry.email,
                        message: entry.note,
                        from_name: "Mishaye Studio Website",
                        subject: `New Project Inquiry from ${entry.name} - MISHAYE STUDIO`,
                      }),
                    });
                    const data = await res.json();
                    console.log("Web3Forms response:", data);
                  } catch (err) {
                    console.error("Web3Forms submission error:", err);
                  } finally {
                    setSubmitting(false);
                    setSent(true);
                  }
                }}
              >
                <label>
                  <span className="sr-only">Name</span>
                  <input name="name" required placeholder="Name" autoComplete="name" className="field" />
                </label>
                <label>
                  <span className="sr-only">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email"
                    autoComplete="email"
                    className="field"
                  />
                </label>
                <label>
                  <span className="sr-only">About the project</span>
                  <textarea
                    name="note"
                    required
                    rows={3}
                    placeholder="The room you have in mind"
                    className="field resize-none"
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-cream py-2 pl-5 pr-2 text-ink disabled:opacity-70"
                >
                  <span className="eyebrow">{submitting ? "Sending..." : "Start a project"}</span>
                  <span className="grid size-11 place-items-center rounded-full bg-ink text-cream">
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h4 className="text-lg font-medium tracking-tight uppercase text-ink">MISHAYE STUDIO</h4>
              <p className="mt-2 text-sm text-ink-soft">
                Interior design & turnkey renovation.
              </p>
              <p className="mt-2 text-xs text-muted">
                Delhi NCR, India
              </p>
            </div>
            <div>
              <p className="eyebrow text-muted">Contact Numbers</p>
              <div className="mt-3 flex flex-col gap-1 text-sm text-ink-soft">
                <a href="tel:+919205419042" className="hover:text-ink hover:underline">
                  +91 9205419042
                </a>
                <a href="tel:+918826981268" className="hover:text-ink hover:underline">
                  +91 8826981268
                </a>
              </div>
            </div>
            <div>
              <p className="eyebrow text-muted">Email & Web</p>
              <div className="mt-3 flex flex-col gap-1 text-sm text-ink-soft">
                <a href="mailto:mishaye.studio@gmail.com" className="hover:text-ink hover:underline">
                  mishaye.studio@gmail.com
                </a>
                <a
                  href="https://www.mishayestudio.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-ink hover:underline"
                >
                  www.mishayestudio.com
                </a>
              </div>
            </div>
            <div>
              <p className="eyebrow text-muted">Instagram & Location</p>
              <div className="mt-3 flex flex-col gap-1 text-sm text-ink-soft">
                <a
                  href="https://instagram.com/mishaye.studio"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-ink hover:underline"
                >
                  @mishaye.studio
                </a>
                <span className="text-muted">Delhi NCR, India</span>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-line pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-muted">
            <p>© {new Date().getFullYear()} MISHAYE STUDIO. All rights reserved.</p>
            <p>Interior design & turnkey renovation</p>
          </div>
        </div>
      </footer>

      <EstimateDialog open={estimate} onOpenChange={setEstimate} />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-t border-line pt-4">
      <dt className="text-4xl font-medium tabular-nums tracking-tight md:text-5xl">{value}</dt>
      <dd className="mt-2 text-sm text-muted">{label}</dd>
    </div>
  );
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setOn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal${on ? " is-in" : ""}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
