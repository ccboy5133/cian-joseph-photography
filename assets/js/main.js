/* =========================================================
   Cian E. Joseph — Photography Portfolio · interactions
   ========================================================= */
(function () {
  "use strict";

  const photos = Array.isArray(window.PHOTOS) ? window.PHOTOS : [];
  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  /* ---------- Year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Build gallery ---------- */
  const gallery = $("#gallery");
  const filtersWrap = $(".filters");

  function mediaHTML(p) {
    if (p.placeholder || !p.src) {
      const tone = p.tone ? `tone-${p.tone}` : "tone-noir";
      return `<div class="card__ph ${tone}"><span>${p.title || ""}</span></div>`;
    }
    return `<img src="${p.src}" alt="${(p.title || "Photograph").replace(/"/g, "")}" loading="lazy" />`;
  }

  function buildGallery() {
    if (!gallery) return;
    gallery.innerHTML = photos.map((p, i) => `
      <figure class="card" data-index="${i}" data-cat="${p.category || "All"}">
        <div class="card__media">${mediaHTML(p)}</div>
        <figcaption class="card__overlay">
          <span class="card__title">${p.title || ""}</span>
          <span class="card__cat">${p.category || ""}</span>
        </figcaption>
      </figure>`).join("");
    observeCards();
  }

  /* ---------- Filters ---------- */
  function buildFilters() {
    if (!filtersWrap) return;
    const cats = ["All", ...Array.from(new Set(photos.map(p => p.category).filter(Boolean)))];
    filtersWrap.innerHTML = cats.map((c, i) =>
      `<button class="${i === 0 ? "is-active" : ""}" data-filter="${c}">${c}</button>`
    ).join("");

    filtersWrap.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      $$("button", filtersWrap).forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const f = btn.dataset.filter;
      $$(".card", gallery).forEach(card => {
        const show = f === "All" || card.dataset.cat === f;
        card.classList.toggle("is-hiding", !show);
        if (show) { card.classList.remove("is-in"); requestAnimationFrame(() => card.classList.add("is-in")); }
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  function observeCards() { $$(".card").forEach(c => io.observe(c)); }
  $$(".reveal").forEach(el => io.observe(el));

  /* ---------- Hero intro ---------- */
  window.addEventListener("load", () => $(".hero")?.classList.add("is-in"));
  // Fallback if load already fired
  if (document.readyState === "complete") $(".hero")?.classList.add("is-in");

  /* ---------- Nav scroll state + progress ---------- */
  const nav = $("#nav");
  const progress = $(".scroll-progress");
  function onScroll() {
    const y = window.scrollY;
    nav?.classList.toggle("is-scrolled", y > 40);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = $(".nav__toggle");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("[data-link]").forEach(a => a.addEventListener("click", () => {
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  }));

  /* ---------- Custom cursor ---------- */
  const cursor = $(".cursor");
  if (cursor && window.matchMedia("(hover: hover)").matches) {
    let x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", e => { x = e.clientX; y = e.clientY; });
    (function loop() {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseover", e => {
      if (e.target.closest("a, button, .card")) cursor.classList.add("is-hover");
    });
    document.addEventListener("mouseout", e => {
      if (e.target.closest("a, button, .card")) cursor.classList.remove("is-hover");
    });
  }

  /* ---------- Hero parallax ---------- */
  const heroBg = $(".hero__bg");
  if (heroBg && window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("mousemove", e => {
      const dx = (e.clientX / window.innerWidth - 0.5) * 24;
      const dy = (e.clientY / window.innerHeight - 0.5) * 24;
      heroBg.style.transform = `translate(${dx}px, ${dy}px) scale(1.05)`;
    });
  }

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox");
  const stage = $(".lightbox__stage", lb);
  const lbTitle = $(".lightbox__title", lb);
  const lbCounter = $(".lightbox__counter", lb);
  let current = 0;
  let visibleList = [];

  function currentVisiblePhotos() {
    return $$(".card", gallery)
      .filter(c => !c.classList.contains("is-hiding"))
      .map(c => Number(c.dataset.index));
  }

  function renderLightbox() {
    const p = photos[visibleList[current]];
    if (!p) return;
    stage.innerHTML = mediaHTML(p);
    lbTitle.textContent = p.title || "";
    lbCounter.textContent = `${current + 1} / ${visibleList.length}`;
  }

  function openLightbox(photoIndex) {
    visibleList = currentVisiblePhotos();
    current = visibleList.indexOf(photoIndex);
    if (current < 0) current = 0;
    renderLightbox();
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function step(dir) {
    current = (current + dir + visibleList.length) % visibleList.length;
    renderLightbox();
  }

  gallery?.addEventListener("click", e => {
    const card = e.target.closest(".card");
    if (card) openLightbox(Number(card.dataset.index));
  });
  $(".lightbox__close", lb)?.addEventListener("click", closeLightbox);
  $(".lightbox__nav--prev", lb)?.addEventListener("click", () => step(-1));
  $(".lightbox__nav--next", lb)?.addEventListener("click", () => step(1));
  lb?.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ---------- Init ---------- */
  buildFilters();
  buildGallery();

  // Empty-state nudge if no photos defined
  if (photos.length === 0 && gallery) {
    gallery.innerHTML = `<p style="color:var(--muted);grid-column:1/-1">
      Add your photos in <code>assets/js/photos.js</code> to fill this gallery.</p>`;
  }
})();
