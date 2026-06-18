/**
 * Nexus & Co — nebula background, navigation, contact form
 */
(function () {
  "use strict";

  const PARTNER_LOGO_DIR = "assets/partners";

  const PARTNERS = [
    { name: "Aristocrat Leisure", slug: "aristocrat", file: "Aristocrat.png", initials: "AL" },
    { name: "Flutter Entertainment", slug: "flutter", file: "Flutter.png", initials: "FE" },
    { name: "Evolution Gaming", slug: "evolution", file: "Evolution Gaming.png", initials: "EG" },
    { name: "Playtech", slug: "playtech", file: "Playtech.png", initials: "PT" },
    { name: "Stake", slug: "stake", file: "Stake.png", initials: "ST" },
    { name: "Rainbet", slug: "rainbet", file: "Rainbet.png", initials: "RB" },
    { name: "Natural8", slug: "natural8", file: "Natural8.png", initials: "N8" },
    { name: "Bet365", slug: "bet365", file: "bet365.png", initials: "B3" },
    { name: "Binance", slug: "binance", file: "Binance.png", initials: "BN" },
    { name: "Coinbase", slug: "coinbase", file: "Coinbase.png", initials: "CB" },
    { name: "OKX", slug: "okx", file: "OKX.png", initials: "OK" },
    { name: "SoftSwiss", slug: "softswiss", file: "SoftSwiss.png", initials: "SS" },
  ];

  function partnerLogoSrc(partner, stage = "local") {
    if (stage === "local" && partner.file) {
      return `${PARTNER_LOGO_DIR}/${encodeURIComponent(partner.file)}`;
    }
    if (partner.domain) {
      return `https://logo.clearbit.com/${partner.domain}`;
    }
    return "";
  }

  function partnerLogoStage(partner) {
    return partner.file ? "local" : "remote";
  }

  function showPartnerFallback(img) {
    img.classList.add("partner-logo--hidden");
    const fallback = img.nextElementSibling;
    if (fallback) fallback.hidden = false;
  }

  function handlePartnerLogoError(img) {
    const partner = PARTNERS.find((item) => item.slug === img.dataset.slug);
    if (!partner) return;

    if (img.dataset.stage === "local") {
      img.dataset.stage = "remote";
      const remote = partnerLogoSrc(partner, "remote");
      if (remote) {
        img.src = remote;
        return;
      }
    }

    showPartnerFallback(img);
  }

  const canvas = document.getElementById("portal-canvas");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (typeof NexusFooter !== "undefined") {
    NexusFooter.init();
  }

  const isHome = document.body.classList.contains("page-home");
  const isCareers = document.body.classList.contains("page-careers");

  function initPartners() {
    const track = document.getElementById("partners-track");
    if (!track) return;

    const renderCard = (partner) => {
      const stage = partnerLogoStage(partner);
      const src = partnerLogoSrc(partner, stage);
      const alt = `${partner.name} logo`;

      return `
      <article class="partner-card">
        <div class="partner-logo-box">
          <img
            src="${src}"
            data-slug="${partner.slug}"
            data-stage="${stage}"
            alt="${alt}"
            class="partner-logo"
            width="72"
            height="72"
            loading="lazy"
            decoding="async"
          >
          <span class="partner-logo-fallback" hidden>${partner.initials}</span>
        </div>
        <p class="partner-name">${partner.name}</p>
      </article>
    `;
    };

    const cards = PARTNERS.map(renderCard).join("");
    track.innerHTML = cards + cards;

    track.querySelectorAll(".partner-logo").forEach((img) => {
      img.addEventListener("error", () => handlePartnerLogoError(img));
    });

    const syncMarquee = () => {
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        track.style.setProperty("--marquee-distance", `-${halfWidth}px`);
      }
    };

    syncMarquee();
    window.addEventListener("resize", syncMarquee);
    track.querySelectorAll(".partner-logo").forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", syncMarquee, { once: true });
      }
    });
  }

  if (isHome) {
    initPartners();
  }

  if (typeof NexusHeader !== "undefined") {
    if (isHome) {
      NexusHeader.init({
        active: window.location.hash?.slice(1) || "home",
      });
    } else if (isCareers) {
      NexusHeader.init({ active: "careers" });
    }
  }

  if (isHome && typeof NexusNav !== "undefined") {
    NexusNav.bindHashNavigation();

    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (typeof NexusHeader !== "undefined") {
            NexusHeader.setActiveNav(entry.target.id);
          }
        });
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
  }

  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-status");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(contactForm);
      const name = data.get("name") || "";
      const email = data.get("email") || "";
      const company = data.get("company") || "";
      const message = data.get("message") || "";

      const subject = encodeURIComponent(`Project inquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\n${message}`
      );

      window.location.href = `mailto:contact@nexusco.au?subject=${subject}&body=${body}`;

      if (contactStatus) {
        contactStatus.hidden = false;
        contactStatus.textContent =
          "Your email client should open shortly. If it does not, write to contact@nexusco.au directly.";
      }
    });
  }

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let stars = [];
    let dust = [];
    let animationId = null;
    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cx = w * 0.5;
      cy = h * 0.35;
      const count = Math.min(140, Math.floor((w * h) / 12000));
      stars = Array.from({ length: count }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 60 + Math.random() * Math.max(w, h) * 0.55,
        size: 0.3 + Math.random() * 1.2,
        speed: 0.00005 + Math.random() * 0.0001,
        opacity: 0.05 + Math.random() * 0.18,
        tint: Math.random() > 0.5 ? "lavender" : "cyan",
      }));
      dust = Array.from({ length: 20 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 40 + Math.random() * 120,
        dx: (Math.random() - 0.5) * 0.06,
        dy: (Math.random() - 0.5) * 0.04,
        hue: Math.random() > 0.5 ? [122, 107, 158] : [61, 138, 138],
        alpha: 0.01 + Math.random() * 0.018,
      }));
    }

    function drawNebulaWash() {
      const g = ctx.createRadialGradient(cx, cy * 0.9, 0, cx, cy, Math.max(w, h) * 0.75);
      g.addColorStop(0, "rgba(155, 130, 190, 0.07)");
      g.addColorStop(0.25, "rgba(100, 160, 190, 0.05)");
      g.addColorStop(0.55, "rgba(180, 140, 200, 0.025)");
      g.addColorStop(1, "rgba(10, 10, 12, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const d of dust) {
        d.x += d.dx;
        d.y += d.dy;
        if (d.x < -d.r) d.x = w + d.r;
        if (d.x > w + d.r) d.x = -d.r;
        if (d.y < -d.r) d.y = h + d.r;
        if (d.y > h + d.r) d.y = -d.r;

        const dg = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
        const [r, gCol, b] = d.hue;
        dg.addColorStop(0, `rgba(${r},${gCol},${b},${d.alpha * 2})`);
        dg.addColorStop(1, `rgba(${r},${gCol},${b},0)`);
        ctx.fillStyle = dg;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      drawNebulaWash();

      for (const star of stars) {
        star.angle += star.speed;
        const x = cx + Math.cos(star.angle) * star.radius;
        const y = cy + Math.sin(star.angle) * star.radius * 0.34;
        if (x < -20 || x > w + 20 || y < -20 || y > h + 20) continue;

        const color =
          star.tint === "lavender"
            ? `rgba(122, 107, 158, ${star.opacity})`
            : `rgba(61, 138, 138, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(animationId);
      else draw();
    });
  }
})();