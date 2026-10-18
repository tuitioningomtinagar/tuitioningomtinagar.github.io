/* =========================================================
   TUITION IN GOMTI NAGAR — SCRIPT
   Mobile navigation, sticky header, smooth scroll, active link
   highlighting, FAQ accordion, and enquiry form validation.
   Vanilla JS. No dependencies.
   ========================================================= */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.getElementById("siteHeader");
  function updateHeaderState() {
    if (!header) return;
    if (window.scrollY > 8) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  function closeNav() {
    if (!navToggle || !mainNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    mainNav.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function openNav() {
    if (!navToggle || !mainNav) return;
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    mainNav.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeNav();
      }
    });

    var navLinks = mainNav.querySelectorAll(".nav-link");
    navLinks.forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  /* ---------- Smooth scroll with sticky-header offset ---------- */
  var headerHeight = header ? header.offsetHeight : 72;

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var top =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        (headerHeight + 12);

      window.scrollTo({
        top: top,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });

      // Move focus for keyboard/screen-reader users once scroll settles
      window.setTimeout(function () {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }, prefersReducedMotion ? 0 : 400);
    });
  });

  /* ---------- Active nav link highlighting ---------- */
  var sections = Array.prototype.slice
    .call(document.querySelectorAll("main section[id]"))
    .filter(function (s) {
      return document.querySelector('.nav-list a[href="#' + s.id + '"]');
    });

  var navAnchorMap = {};
  document.querySelectorAll(".nav-list a").forEach(function (a) {
    navAnchorMap[a.getAttribute("href")] = a;
  });

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = navAnchorMap["#" + entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            document
              .querySelectorAll(".nav-list a.is-active")
              .forEach(function (a) {
                a.classList.remove("is-active");
              });
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  /* ---------- FAQ accordion ---------- */
   console.log("FAQ SCRIPT REACHED");

  document.querySelectorAll(".faq-trigger").forEach(function (trigger) {
  console.log("FAQ BUTTON FOUND", trigger);

  trigger.addEventListener("click", function () {
    console.log("FAQ CLICKED");

    var expanded = trigger.getAttribute("aria-expanded") === "true";
    var item = trigger.closest(".faq-item");

    trigger.setAttribute("aria-expanded", String(!expanded));

    if (item) {
      item.classList.toggle("is-open", !expanded);
    }
  });
});

  /* ---------- Enquiry form validation + mailto fallback ---------- */
 

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyzrCocgpeSSwR4zcyI8PodBnEDCutYTtFTmpSxkaz7muKNBFKK4VaYKKbQs-ooSKU4w/exec";

const form = document.getElementById("enquiryForm");
const statusBox = document.getElementById("formStatus");

if (form && statusBox) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const getValue = (selector) =>
      form.querySelector(selector)?.value.trim() || "";

    const data = {
      parentName: getValue("#parentName"),
      phone: getValue("#phone"),
      email: getValue("#email"),
      studentClass: getValue("#studentClass"),
      subject: getValue("#subject"),
      board: getValue("#board"),
      timing: getValue("#timing"),
      area: getValue("#area"),
      message: getValue("#message")
    };

    const button = form.querySelector(
      'button[type="submit"]'
    );

    if (button) button.disabled = true;

    statusBox.textContent = "Submitting your enquiry...";

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(data)
      });

      statusBox.textContent =
        "Your request was submitted. Please contact us directly if you do not receive a response.";

      form.reset();

    } catch (error) {
      console.error("Enquiry submission error:", error);

      statusBox.textContent =
        "Submission failed. Please call or WhatsApp us directly.";

    } finally {
      if (button) button.disabled = false;
    }
  });
}


    /* ---------- Cute stick-man button helper ---------- */

var cuteHelper = document.querySelector(".cute-helper");

if (cuteHelper) {
  var cuteButtons = document.querySelectorAll(
    "button, .btn, .social-link"
  );

  var helperTimer;

  function showCuteHelper(button) {
  var rect = button.getBoundingClientRect();

  /* Put the character directly over the button */
  cuteHelper.style.left =
    rect.left + rect.width / 2 - 15 + "px";

  cuteHelper.style.top =
    rect.top - 5 + "px";

  cuteHelper.classList.add("is-visible");

  clearTimeout(helperTimer);

  helperTimer = setTimeout(function () {
    cuteHelper.classList.remove("is-visible");
  }, 900);
}


  cuteButtons.forEach(function (button) {

    /* Desktop */
    button.addEventListener("mouseenter", function () {
      showCuteHelper(button);
    });

    button.addEventListener("mouseleave", function () {
      clearTimeout(helperTimer);
      cuteHelper.classList.remove("is-visible");
    });

    /* Mobile / touch */
    button.addEventListener("touchstart", function () {
      showCuteHelper(button);
    }, { passive: true });

  });
}
})();
