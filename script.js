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
  var form = document.getElementById("enquiryForm");
  var statusBox = document.getElementById("formStatus");

  function setError(field, message) {
    var errorEl = document.getElementById(field.id + "-error");
    if (errorEl) {
      errorEl.textContent = message || "";
    }
    if (message) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
  }

  function showStatus(message, type) {
    if (!statusBox) return;
    statusBox.textContent = message;
    statusBox.className = "form-status is-visible " + type;
  }

  function isValidPhone(value) {
    return /^[6-9]\d{9}$/.test(value.replace(/\D/g, "").slice(-10));
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var firstInvalid = null;

      var name = form.querySelector("#parentName");
      var phone = form.querySelector("#phone");
      var email = form.querySelector("#email");
      var studentClass = form.querySelector("#studentClass");
      var area = form.querySelector("#area");
      var message = form.querySelector("#message");
      var subject = form.querySelector("#subject");
      var board = form.querySelector("#board");
      var timing = form.querySelector("#timing");

      // Name
      if (!name.value.trim()) {
        setError(name, "Please enter a name.");
        valid = false;
        firstInvalid = firstInvalid || name;
      } else {
        setError(name, "");
      }

      // Phone
      if (!phone.value.trim()) {
        setError(phone, "Please enter a phone number.");
        valid = false;
        firstInvalid = firstInvalid || phone;
      } else if (!isValidPhone(phone.value)) {
        setError(phone, "Please enter a valid 10-digit mobile number.");
        valid = false;
        firstInvalid = firstInvalid || phone;
      } else {
        setError(phone, "");
      }

      // Email (optional, validated only if filled)
      if (email.value.trim() && !isValidEmail(email.value.trim())) {
        setError(email, "Please enter a valid email address.");
        valid = false;
        firstInvalid = firstInvalid || email;
      } else {
        setError(email, "");
      }

      // Class
      if (!studentClass.value) {
        setError(studentClass, "Please select a class.");
        valid = false;
        firstInvalid = firstInvalid || studentClass;
      } else {
        setError(studentClass, "");
      }

      // Area
      if (!area.value) {
        setError(area, "Please select an area.");
        valid = false;
        firstInvalid = firstInvalid || area;
      } else {
        setError(area, "");
      }

      // Message
      if (!message.value.trim()) {
        setError(message, "Please add a short message.");
        valid = false;
        firstInvalid = firstInvalid || message;
      } else {
        setError(message, "");
      }

      if (!valid) {
        showStatus(
          "Please check the highlighted fields and try again.",
          "error"
        );
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      // Build a mailto link with the enquiry details.
      // This site has no backend, so this hands the message to the
      // user's own email app rather than pretending to send it directly.
      var lines = [
        "New home tuition enquiry from the website:",
        "",
        "Name: " + name.value.trim(),
        "Phone: " + phone.value.trim(),
        "Email: " + (email.value.trim() || "Not provided"),
        "Class: " + studentClass.value,
        "Subject(s): " + (subject.value.trim() || "Not specified"),
        "School Board: " + (board.value.trim() || "Not specified"),
        "Preferred Timing: " + (timing.value.trim() || "Not specified"),
        "Area / Location: " + area.value,
        "",
        "Message:",
        message.value.trim(),
      ];

      var mailSubject = encodeURIComponent(
        "Home Tuition Enquiry — " + name.value.trim()
      );
      var mailBody = encodeURIComponent(lines.join("\n"));
      var mailtoLink =
        "mailto:lotstudyindia@gmail.com?subject=" +
        mailSubject +
        "&body=" +
        mailBody;

      window.location.href = mailtoLink;

      showStatus(
        "Opening your email app with the enquiry details — please hit send. You can also reach us directly by call or WhatsApp.",
        "success"
      );
    });

    // Clear individual field errors as the user corrects them
    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") {
          setError(field, "");
        }
      });
    });
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
}
  }
})();
