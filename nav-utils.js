/**
 * Shared hash scroll helpers
 */
(function (global) {
  "use strict";

  function scrollToHash(retry = 0) {
    const hash = window.location.hash;
    if (!hash || hash === "#") return;

    const el = document.getElementById(hash.slice(1));
    if (!el) {
      if (retry < 10) setTimeout(() => scrollToHash(retry + 1), 60);
      return;
    }

    const header = document.getElementById("site-header");
    const offset = (header?.offsetHeight || 56) + 20;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: retry > 0 ? "smooth" : "auto" });
  }

  function bindHashNavigation() {
    function handle() {
      scrollToHash();
    }

    window.addEventListener("hashchange", handle);
    window.addEventListener("load", handle);
    setTimeout(handle, 150);
  }

  global.NexusNav = { scrollToHash, bindHashNavigation };
})(typeof window !== "undefined" ? window : globalThis);