/**
 * Nexus & Co — shared footer
 */
(function (global) {
  "use strict";

  function renderFooterInner() {
    return `
      <div class="footer-locations">
        <div class="footer-location">
          <span class="footer-location__city">Singapore</span>
          <span class="footer-location__addr">Level 12, 6 Battery Road, Singapore 049909</span>
        </div>
        <span class="footer-dot" aria-hidden="true"></span>
        <div class="footer-location">
          <span class="footer-location__city">Australia</span>
          <span class="footer-location__addr">Level 15, 1 O'Connell Street, Sydney NSW 2000</span>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-meta-line">
          <a href="mailto:contact@nexusco.au" class="footer-email accent-cyan">contact@nexusco.au</a>
          <span class="footer-sep" aria-hidden="true">·</span>
          <span class="footer-legal">&copy; <span id="year"></span> NEXUS &amp; CO PTY LTD</span>
          <span class="footer-sep" aria-hidden="true">·</span>
          <span class="footer-legal">ACN 654 292 976</span>
        </p>
      </div>
    `;
  }

  function init() {
    document.querySelectorAll(".footer-inner--unified").forEach((el) => {
      el.innerHTML = renderFooterInner();
    });

    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  global.NexusFooter = { init, renderFooterInner };
})(typeof window !== "undefined" ? window : globalThis);