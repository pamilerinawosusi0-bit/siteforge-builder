/* =========================
   DELIGHT HOTEL JAVASCRIPT
========================= */


/* LOADER */

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hide");
  }, 900);
});


/* NAVBAR */

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});


/* MOBILE MENU */

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("open");
  menuBtn.textContent = navMenu.classList.contains("open") ? "×" : "☰";
});

document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuBtn.textContent = "☰";
  });
});


/* SCROLL REVEAL */

const revealElements = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach(element => revealObserver.observe(element));


/* GALLERY LIGHTBOX */

const galleryImages = document.querySelectorAll(".gallery-item img");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");

galleryImages.forEach(image => {
  image.addEventListener("click", () => {
    lightboxImage.src = image.src;
    lightbox.classList.add("open");
  });
});

closeLightbox.addEventListener("click", () => {
  lightbox.classList.remove("open");
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.classList.remove("open");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    lightbox.classList.remove("open");
  }
});


/* BOOKING FORM */

const bookingForm = document.getElementById("bookingForm");
const toast = document.getElementById("toast");
const checkIn = document.getElementById("checkIn");
const checkOut = document.getElementById("checkOut");
const emailBtn = document.getElementById("emailBtn");

const HOTEL_WHATSAPP = "2348083745991";
const HOTEL_EMAIL = "info@delighthotel.com.ng";

/* Prevent past dates */
const today = new Date().toISOString().split("T")[0];
checkIn.min = today;
checkOut.min = today;

checkIn.addEventListener("change", () => {
  checkOut.min = checkIn.value;
  if (checkOut.value && checkOut.value <= checkIn.value) checkOut.value = "";
});

function getBooking() {
  const name = document.getElementById("guestName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const room = document.getElementById("roomType").value;
  const guests = document.getElementById("guests").value;
  const arrival = checkIn.value;
  const departure = checkOut.value;

  if (!name || !phone) {
    showToast("Missing details", "Please enter your name and phone number.");
    return null;
  }
  if (!arrival || !departure) {
    showToast("Select your dates", "Please choose your check-in and check-out dates.");
    return null;
  }
  if (departure <= arrival) {
    showToast("Check-out date is invalid", "Please choose a date after check-in.");
    return null;
  }

  const message =
`Hello Delight Hotel & Suites,

I would like to make a booking enquiry.

Name: ${name}
Phone: ${phone}
Room: ${room}
Guests: ${guests}
Check-in: ${arrival}
Check-out: ${departure}

Please let me know the availability and price. Thank you.`;

  return message;
}

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = getBooking();
  if (!message) return;
  window.open(`https://wa.me/${HOTEL_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank");
  showToast("Opening WhatsApp", "Send the message to complete your request.");
});

emailBtn.addEventListener("click", () => {
  const message = getBooking();
  if (!message) return;
  window.open(
    `mailto:${HOTEL_EMAIL}?subject=${encodeURIComponent("Booking enquiry")}&body=${encodeURIComponent(message)}`,
    "_blank"
  );
  showToast("Opening your email app", "Send the email to complete your request.");
});


/* TOAST */

function showToast(title, message) {
  toast.querySelector("strong").textContent = title;
  toast.querySelector("span").textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4500);
}


/* BUTTON HOVER EFFECT */

document.querySelectorAll(".gold-btn, .outline-btn").forEach(button => {
  button.addEventListener("mouseenter", () => {
    button.style.transform = "translateY(-3px)";
  });
  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});


/* =========================================
   SCROLL-DRIVEN HERO
   Video shows first at normal size.
   Scrolling reveals the photos, one by one,
   zooming in/out with your scroll.
========================================= */

const heroSection = document.getElementById("home");
const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const heroContent = document.getElementById("heroContent");
const sceneLabel = document.getElementById("sceneLabel");
const heroVideo = document.getElementById("heroVideo");

const ZOOM = 0.08;   /* photo zoom amount (0.28 = 28%) */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let currentScene = -1;
let heroTicking = false;

function updateHero() {

  heroTicking = false;

  const total = heroSection.offsetHeight - window.innerHeight;
  if (total <= 0) return;

  /* how far through the hero we are (0 → 1) */
  const scrolled = window.scrollY - heroSection.offsetTop;
  const p = Math.min(Math.max(scrolled / total, 0), 0.999);

  const pos = p * heroSlides.length;
  const idx = Math.floor(pos);
  const t = pos - idx;   /* progress inside this scene */

  /* switch scene */
  if (idx !== currentScene) {

    currentScene = idx;

    heroSlides.forEach((slide, i) => {
      slide.classList.toggle("active", i === idx);
    });

    const scene = heroSlides[idx];
    heroSection.querySelector(".hero-pin").classList.toggle("photo-scene", scene.dataset.type !== "video");

    if (heroVideo) {
      if (scene.dataset.type === "video") {
        heroVideo.play().catch(() => {});
      } else {
        heroVideo.pause();
      }
    }

    sceneLabel.style.opacity = 0;
    setTimeout(() => {
      sceneLabel.textContent = scene.dataset.scene.toUpperCase();
      sceneLabel.style.opacity = 1;
    }, 250);
  }

  /* photo zoom follows the scroll */
  const slide = heroSlides[idx];

  if (slide.dataset.type !== "video" && !reduceMotion) {
    const scale = slide.classList.contains("zoom-in")
      ? 1 + ZOOM * t
      : 1 + ZOOM * (1 - t);
    slide.style.transform = `scale(${scale})`;
  }

  /* headline fades away once you start scrolling
     (at the very top, the CSS entrance animation plays instead) */
  if (window.scrollY > 5) {
    const fade = idx === 0 ? Math.max(0, 1 - t * 2) : 0;
    heroContent.style.animation = "none";
    heroContent.style.opacity = fade;
    heroContent.style.pointerEvents = fade < 0.2 ? "none" : "auto";
  } else {
    heroContent.style.animation = "";
    heroContent.style.opacity = "";
    heroContent.style.pointerEvents = "";
  }
}

window.addEventListener("scroll", () => {
  if (!heroTicking) {
    requestAnimationFrame(updateHero);
    heroTicking = true;
  }
}, { passive: true });

window.addEventListener("resize", updateHero);

if (heroVideo) heroVideo.play().catch(() => {});

updateHero();


/* ACTIVE NAVIGATION */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {

  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.style.color = "";
    if (link.getAttribute("href") === `#${current}`) {
      link.style.color = "#e4c98f";
    }
  });

});


/* CARD TILT EFFECT */

document.querySelectorAll(".room-card").forEach(card => {

  card.addEventListener("mousemove", (event) => {

    if (window.innerWidth < 850) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -4;
    const rotateY = ((x / rect.width) - 0.5) * 4;

    card.style.transform =
      `translateY(-8px) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });

});


/* MAP TABS */

const mapTabs = document.querySelectorAll(".map-tab");
const panelGuide = document.getElementById("panelGuide");
const panelLive = document.getElementById("panelLive");
const liveMap = document.getElementById("liveMap");

mapTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    mapTabs.forEach(t => t.classList.toggle("active", t === tab));
    const live = tab.dataset.tab === "live";
    panelGuide.hidden = live;
    panelLive.hidden = !live;
    if (live && !liveMap.src) {
      liveMap.src = "https://www.google.com/maps?q=Delight+Hotel+and+Suites+Ilawe+Road+Ado-Ekiti&z=15&output=embed";
    }
  });
});
