/* Car Spark Mobile Auto Detailing — interactions */
(function () {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Current year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow ---------- */
  const header = $(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = $("#navToggle");
  const menu = $("#mobileMenu");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("open", open);
    if (open) menu.removeAttribute("hidden");
    else menu.setAttribute("hidden", "");
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  $$("#mobileMenu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  window.addEventListener("resize", () => { if (window.innerWidth > 860) setMenu(false); });

  /* ---------- Scroll reveal (with light stagger) ---------- */
  $$(".cards, .gallery, .steps, .quotes, .incl, .plans, .services, .faq, .hero__copy, .section__head").forEach((group) => {
    [...group.children].forEach((child, i) => {
      if (child.classList.contains("reveal")) child.style.transitionDelay = Math.min(i * 70, 350) + "ms";
    });
  });

  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Active nav link ---------- */
  const linkMap = new Map();
  $$('.nav__links a[href^="#"]').forEach((a) => linkMap.set(a.getAttribute("href").slice(1), a));
  const sections = [...linkMap.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            linkMap.forEach((a) => a.classList.remove("active"));
            const a = linkMap.get(e.target.id);
            if (a) a.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Per-car gallery carousels ---------- */
  const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  $$("[data-carousel]").forEach((card) => {
    const track = $(".car__track", card);
    const slides = $$(".car__slide", track);
    const prev = $(".car__nav--prev", card);
    const next = $(".car__nav--next", card);
    const count = $(".car__count", card);
    const dotsBox = $(".car__dots", card);
    const n = slides.length;

    if (n < 2) { [prev, next, dotsBox, count].forEach((el) => el && (el.style.display = "none")); return; }

    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Go to photo " + (i + 1));
      b.addEventListener("click", () => goTo(i));
      dotsBox.appendChild(b);
      return b;
    });

    const index = () => Math.max(0, Math.min(n - 1, Math.round(track.scrollLeft / track.clientWidth)));
    const goTo = (i) => track.scrollTo({ left: i * track.clientWidth, behavior: motionOK ? "smooth" : "auto" });

    const update = () => {
      const i = index();
      count.textContent = (i + 1) + "/" + n;
      dots.forEach((d, k) => d.classList.toggle("active", k === i));
      prev.disabled = i === 0;
      next.disabled = i === n - 1;
    };

    prev.addEventListener("click", () => goTo(index() - 1));
    next.addEventListener("click", () => goTo(index() + 1));
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(index() - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(index() + 1); }
    });

    let raf = 0;
    track.addEventListener("scroll", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  /* ---------- Before / After slider ---------- */
  const ba = $("#beforeAfter");
  if (ba) {
    const range = $("#baRange", ba);
    const viewport = $(".ba__viewport", ba);
    const setPos = (val) => {
      const v = Math.max(0, Math.min(100, val));
      ba.style.setProperty("--pos", v + "%");
      range.value = v;
    };
    setPos(50);

    range.addEventListener("input", () => setPos(parseFloat(range.value)));

    let dragging = false;
    const posFromEvent = (clientX) => {
      const r = viewport.getBoundingClientRect();
      setPos(((clientX - r.left) / r.width) * 100);
    };
    const start = (e) => { dragging = true; posFromEvent(e.clientX); range.focus({ preventScroll: true }); };
    const move = (e) => { if (dragging) posFromEvent(e.clientX); };
    const end = () => { dragging = false; };

    viewport.addEventListener("pointerdown", start);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  }
})();
