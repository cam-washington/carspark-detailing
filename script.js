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
