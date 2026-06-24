// Configuration du contact.
// Remplacer par le numéro WhatsApp définitif au format international, sans + ni espaces.
const WHATSAPP_NUMBER = "33768345608";

const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

navToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

const zoneSelect = document.querySelector("#zone");
const otherZoneRow = document.querySelector("#other-zone-row");
const otherZoneInput = document.querySelector("#other-zone");

zoneSelect?.addEventListener("change", () => {
  const isOther = zoneSelect.value === "Autre";
  otherZoneRow?.classList.toggle("hidden", !isOther);
  if (otherZoneInput) {
    otherZoneInput.required = isOther;
    if (!isOther) otherZoneInput.value = "";
  }
});

const serviceMap = {
  "menage-regulier": "Ménage régulier",
  "menage-ponctuel": "Ménage ponctuel",
  "repassage": "Repassage",
  "grand-nettoyage": "Grand nettoyage",
  "menage-apres-demenagement": "Ménage après déménagement"
};

const params = new URLSearchParams(window.location.search);
const requestedService = params.get("service");
const serviceSelect = document.querySelector("#service");

if (requestedService && serviceSelect && serviceMap[requestedService]) {
  serviceSelect.value = serviceMap[requestedService];
}

const quoteForm = document.querySelector("#quote-form");

function buildQuoteMessage(form) {
  const data = new FormData(form);
  const zone = data.get("zone") === "Autre" ? data.get("other-zone") : data.get("zone");

  return [
    "Bonjour, je souhaite une première estimation pour une prestation de ménage.",
    "",
    `Prénom : ${data.get("firstname")}`,
    `Téléphone : ${data.get("phone")}`,
    `E-mail : ${data.get("email") || "Non précisé"}`,
    `Ville/quartier : ${zone}`,
    `Type de logement : ${data.get("housing")}`,
    `Surface approximative : ${data.get("surface")}`,
    `Besoin principal : ${data.get("service")}`,
    `Fréquence souhaitée : ${data.get("frequency")}`,
    `Message : ${data.get("message") || "Non précisé"}`
  ].join("\n");
}

quoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!quoteForm.reportValidity()) return;

  const message = buildQuoteMessage(quoteForm);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

const reviewForm = document.querySelector("#review-form");

reviewForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!reviewForm.reportValidity()) return;

  const data = new FormData(reviewForm);

  const message = [
    "Bonjour, je souhaite laisser un avis pour votre service de ménage.",
    "",
    `Prénom : ${data.get("review-name")}`,
    `Ville/quartier : ${data.get("review-city")}`,
    `Note : ${data.get("review-rating")}`,
    `Prestation : ${data.get("review-service")}`,
    `Avis : ${data.get("review-message")}`
  ].join("\n");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});
