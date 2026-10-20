/* =========================================================
   WHISTA MEDIA - whista.js (behaviour only, no styling)
   Every block checks its elements exist, so this file is
   safe to load on any page of the site.
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const on = (el, type, fn) => { if (el) el.addEventListener(type, fn); };

  // ---------- Copyright year ----------
  const year = $("copyrightYear");
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Search ----------
  const searchForm = $("searchForm");
  const searchOpen = $("searchOpen");
  const searchInput = $("searchInput");
  const searchMsg = $("searchMsg");
  const serviceSelect = $("service");
  const serviceCards = [...document.querySelectorAll(".service[data-service]")];

  function setSearch(open) {
    if (!searchForm) return;
    searchForm.hidden = !open;
    if (searchOpen) searchOpen.setAttribute("aria-expanded", open);
    if (open) searchInput.focus();
    else searchMsg.textContent = "";
  }

  on(searchOpen, "click", () => setSearch(true));
  on($("searchClose"), "click", () => setSearch(false));

  on(searchForm, "submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      searchMsg.textContent = "Please enter a service to search.";
      return;
    }

    const match = serviceCards.find((card) =>
      card.textContent.toLowerCase().includes(query) ||
      card.dataset.service.includes(query)
    );

    if (match) {
      searchMsg.textContent = "Service found.";
      match.scrollIntoView({ behavior: "smooth", block: "center" });
      match.focus({ preventScroll: true });
    } else {
      searchMsg.textContent = "No matching service found. Try another search.";
    }
  });

  // ---------- Menu ----------
  const menuOpen = $("menuOpen");
  const menuDrawer = $("menuDrawer");
  const menuOverlay = $("menuOverlay");

  function setMenu(open) {
    if (!menuDrawer) return;
    menuDrawer.hidden = !open;
    if (menuOverlay) menuOverlay.hidden = !open;
    if (menuOpen) menuOpen.setAttribute("aria-expanded", open);
  }

  on(menuOpen, "click", () => setMenu(menuDrawer.hidden));
  on($("menuClose"), "click", () => setMenu(false));
  on(menuOverlay, "click", () => setMenu(false));
  if (menuDrawer) {
    menuDrawer.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => setMenu(false))
    );
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setMenu(false);
    setSearch(false);
  });

  // ---------- Service cards fill the contact form ----------
  function goToForm(value) {
    if (!serviceSelect) return;
    serviceSelect.value = value;
    $("details").scrollIntoView({ behavior: "smooth" });
  }

  serviceCards.forEach((card) =>
    card.addEventListener("click", (event) => {
      event.preventDefault();
      goToForm(card.dataset.service);
    })
  );

  const requested = new URLSearchParams(window.location.search).get("service");
  if (requested && serviceSelect && [...serviceSelect.options].some((o) => o.value === requested)) {
    goToForm(requested);
  }

  // ---------- Words + pictures slide together, dots show the position ----------
  const dotsBox = $("mainDots");
  const wordSlides = [...document.querySelectorAll("#about-us .slide")];
  const pictureSlides = [...document.querySelectorAll("#Our-Team .slide")];

  if (dotsBox && wordSlides.length && pictureSlides.length) {
    let current = 0;
    let timer = null;

    const dots = wordSlides.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider-dot";
      dot.setAttribute("aria-label", "Show slide " + (i + 1));
      dot.addEventListener("click", () => { show(i); restart(); });
      dotsBox.appendChild(dot);
      return dot;
    });

    const show = (index) => {
      current = (index + wordSlides.length) % wordSlides.length;
      wordSlides.forEach((slide, i) => slide.classList.toggle("active", i === current));
      pictureSlides.forEach((slide, i) =>
        slide.classList.toggle("active", i === current % pictureSlides.length)
      );
      dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    };

    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => show(current + 1), 3500);
    };

    on(document.querySelector("#Our-Team .prev"), "click", () => { show(current - 1); restart(); });
    on(document.querySelector("#Our-Team .next"), "click", () => { show(current + 1); restart(); });

    show(0);
    restart();
  }

  // ---------- Why Us: 6 cards, 2 at a time, auto sliding ----------
  const whyTrack = $("whyTrack");

  if (whyTrack) {
    const whySteps = Math.ceil(whyTrack.children.length / 2);
    let whyStep = 0;

    setInterval(() => {
      whyStep = (whyStep + 1) % whySteps;
      whyTrack.dataset.step = whyStep;
    }, 3500);
  }
});


