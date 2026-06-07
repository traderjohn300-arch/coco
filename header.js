/**
 * Nexus & Co header — compact nav + CTA
 */
(function (global) {
  "use strict";

  const NAV = [
    { href: "index.html#services", label: "Capabilities", key: "services" },
    { href: "index.html#invest", label: "Invest", key: "invest" },
    { href: "index.html#work", label: "Work", key: "work" },
    { href: "index.html#about", label: "About", key: "about" },
    { href: "index.html#careers", label: "Careers", key: "careers" },
    { href: "index.html#contact", label: "Contact", key: "contact" },
  ];

  function renderHeader() {
    const links = NAV.map(
      (item) =>
        `<a href="${item.href}" class="nav-link" data-nav="${item.key}">${item.label}</a>`
    ).join("");

    return `
      <div class="header-inner">
        <a href="index.html#home" class="header-logo accent-lavender-soft">Nexus &amp; Co</a>
        <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="primary-nav">
          Menu
        </button>
        <div class="header-nav-group" id="primary-nav">
          <nav class="nav nav--public" aria-label="Site">
            ${links}
          </nav>
        </div>
        <div class="header-cta">
          <a href="index.html#contact" class="btn btn-primary btn-header-cta">Get in Touch</a>
        </div>
      </div>
    `;
  }

  function setActiveNav(activeKey) {
    document.querySelectorAll("[data-nav]").forEach((el) => {
      const key = el.getAttribute("data-nav");
      el.classList.toggle("active", key === activeKey);
    });
  }

  function bindMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const group = document.getElementById("primary-nav");
    if (!toggle || !group) return;

    toggle.addEventListener("click", () => {
      const open = group.classList.toggle("header-nav-group--open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    group.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        group.classList.remove("header-nav-group--open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function init(options = {}) {
    const { active = "home" } = options;
    const header = document.getElementById("site-header");
    if (!header) return;

    header.className = "site-header site-header--spread site-header--agency";
    header.innerHTML = renderHeader();
    setActiveNav(active);
    bindMobileNav();
  }

  global.NexusHeader = {
    init,
    setActiveNav,
    NAV,
  };
})(typeof window !== "undefined" ? window : globalThis);