/**
 * Cursor 3 Intro - Main JavaScript
 * Features: Navigation highlight, Dark mode toggle, Back to top, Scroll animations
 */

(function () {
  "use strict";

  // ============================================
  // Navigation Highlight
  // ============================================
  const navLinks = document.querySelectorAll(".nav a[href^='#'], .island-nav a[href^='#']");
  const sections = [...navLinks]
    .map((a) => {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      return el ? { link: a, el } : null;
    })
    .filter(Boolean);

  if (sections.length) {
    function setActive() {
      const mid = window.scrollY + window.innerHeight * 0.25;
      let current = sections[0];
      for (const s of sections) {
        if (s.el.offsetTop <= mid) current = s;
      }
      sections.forEach(({ link }) => link.classList.remove("is-active"));
      current.link.classList.add("is-active");
    }

    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setActive();
        ticking = false;
      });
    });

    setActive();
  }

  // ============================================
  // Dark Mode Toggle
  // ============================================
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  function getPreferredTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (themeToggle) {
      themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "切换亮色模式" : "切换暗色模式"
      );
    }
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "dark" ? "#1d1d1f" : "#fbfbfd"
      );
    }
  }

  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });

  // ============================================
  // Back to Top Button
  // ============================================
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    function toggleBackToTop() {
      if (window.scrollY > 300) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }

    window.addEventListener("scroll", () => {
      requestAnimationFrame(toggleBackToTop);
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    toggleBackToTop();
  }

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 16;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ============================================
  // Scroll Animations (Intersection Observer)
  // ============================================
  const animatedElements = document.querySelectorAll(
    ".animate-on-scroll, .timeline-item, .insight-card, .feature-card, .pricing-card"
  );

  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    animatedElements.forEach((el) => observer.observe(el));
  }

  // ============================================
  // Keyboard Shortcut Table Enhancement
  // ============================================
  // ============================================
  // Sticky Stacking Cards Setup
  // ============================================
  const stackCards = document.querySelectorAll(".stack-card");
  stackCards.forEach((card, index) => {
    card.style.setProperty("--stack-i", index);
  });
})();
