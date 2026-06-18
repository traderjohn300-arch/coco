/**
 * Nexus & Co header — compact nav + CTA
 */
(function (global) {
  "use strict";

  const NEXUS_DAO_URL = "https://nexusdao.io";

  const NAV = [
    { hash: "services", label: "Services", key: "services" },
    { url: NEXUS_DAO_URL, label: "Invest", key: "invest", external: true },
    { hash: "work", label: "Work", key: "work" },
    { page: "careers", label: "Careers", key: "careers" },
    { hash: "contact", label: "Contact", key: "contact" },
  ];

  function siteRoot() {
    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean);
    if (parts.length && /\.[a-z0-9]+$/i.test(parts[parts.length - 1])) {
      parts.pop();
    }
    return parts.length ? `/${parts.join("/")}/` : "/";
  }

  function homeHref(hash) {
    const root = siteRoot();
    return hash ? `${root}#${hash}` : root;
  }

  function pageHref(page) {
    return `${siteRoot()}${page}.html`;
  }

  function navHref(item) {
    if (item.url) return item.url;
    if (item.page) return pageHref(item.page);
    return homeHref(item.hash);
  }

  function renderHeader() {
    const links = NAV.map((item) => {
      const externalAttrs = item.external
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      return `<a href="${navHref(item)}" class="nav-link" data-nav="${item.key}"${externalAttrs}>${item.label}</a>`;
    }).join("");

    return `
      <div class="header-inner">
        <a href="${homeHref("home")}" class="header-logo accent-lavender-soft">Nexus &amp; Co</a>
        <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="primary-nav">
          Menu
        </button>
        <div class="header-nav-group" id="primary-nav">
          <nav class="nav nav--public" aria-label="Site">
            ${links}
          </nav>
        </div>
        <div class="header-cta">
          <a href="${homeHref("contact")}" class="btn btn-primary btn-header-cta">Get in Touch</a>
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
    homeHref,
    pageHref,
    NEXUS_DAO_URL,
    NAV,
  };
})(typeof window !== "undefined" ? window : globalThis);