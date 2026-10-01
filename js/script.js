
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Header state + back-to-top ---------- */
  const header = $("#header");
  const toTop = $("#to-top");

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    toTop.classList.toggle("is-visible", y > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ---------- Mobile menu ---------- */
  const navToggle = $("#nav-toggle");
  const navMenu = $("#nav-menu");

  const closeMenu = () => {
    navMenu.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  $$(".nav__link").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Scroll spy (active nav link) ---------- */
  const sections = $$("main section[id]");
  const navLinks = $$(".nav__link");

  const spy = () => {
    const pos = window.scrollY + 120;
    let current = "home";
    sections.forEach((sec) => {
      if (pos >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === "#" + current
      );
    });
  };
  window.addEventListener("scroll", spy, { passive: true });
  spy();

  /* ---------- Typing effect ---------- */
  const typedEl = $("#typed-role");
  const roles = [
    "Frontend Developer",
    "React & Next.js Engineer",
    "React Native Developer",
    "Problem Solver",
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;

  const type = () => {
    const word = roles[roleIdx];
    charIdx += deleting ? -1 : 1;
    typedEl.textContent = word.slice(0, charIdx);

    let delay = deleting ? 45 : 95;
    if (!deleting && charIdx === word.length) {
      delay = 1900;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 350;
    }
    setTimeout(type, delay);
  };
  if (typedEl) type();

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = (i % 6) * 70 + "ms";
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
  /* ---------- Gallery lightbox ---------- */
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightbox-img");
  const lightboxClose = $("#lightbox-close");

  const openLightbox = (src) => {
    if (!src) return;
    lightboxImg.src = src;
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => {
      lightbox.hidden = true;
      lightboxImg.src = "";
    }, 300);
  };

  $$(".gallery__item").forEach((item) => {
    item.addEventListener("click", () => {
      // Skip placeholders (missing image files)
      if (item.classList.contains("is-empty")) return;
      const img = $("img", item);
      if (img && img.src) openLightbox(img.src);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  /* ---------- Contact form (opens your email client) ---------- */
  const form = $("#contact-form");
  const status = $("#form-status");
  const EMAIL = "aabdfatahi@gmail.com";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.classList.remove("is-error");

    const fields = ["name", "email", "message"];
    let valid = true;

    fields.forEach((id) => {
      const input = form.elements[id];
      const ok =
        input.value.trim() !== "" &&
        (id !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
      input.classList.toggle("is-invalid", !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      status.textContent = "Please fill in your name, a valid email and a message.";
      status.classList.add("is-error");
      return;
    }

    const subject =
      form.elements.subject.value.trim() ||
      "Message from " + form.elements.name.value.trim();
    const body =
      "Name: " + form.elements.name.value.trim() + "\n" +
      "Email: " + form.elements.email.value.trim() + "\n\n" +
      form.elements.message.value.trim();

    window.location.href =
      "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    status.textContent = "Opening your email app… thank you!";
    form.reset();
  });

  /* ---------- Footer year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
