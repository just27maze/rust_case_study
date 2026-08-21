/* ============================================================
   RUST PRESENTATION — SCRIPT
   ============================================================ */

/* ------------------------------------------------------------
   1. VIDEO CONFIGURATION
   Replace these paths with your own local files.
   Just drop the files into assets/videos/ and keep these
   filenames (or update the paths to match your filenames).
   ------------------------------------------------------------ */
const CONFIG = {
  mainVideo: "assets/videos/Subway Surfers Gameplay No Copyright - Vertical (1 HOUR).mp4",          // <-- put your gameplay/main video here
  signLanguageVideo: "assets/videos/sign-language.mp4" // <-- put your sign-language video here
};

/* Behavior settings for each video. Change these if you want
   different autoplay/loop/mute/controls behavior. */
const VIDEO_SETTINGS = {
  main: {
    autoplay: true,
    loop: true,
    muted: true,
    controls: false
  },
  signLanguage: {
    autoplay: true,    // per project settings: interpreter video plays automatically
    loop: true,
    muted: true,       // required by browsers for autoplay to work
    controls: false
  }
};

/* ------------------------------------------------------------
   2. APPLY VIDEO CONFIG + SETTINGS
   ------------------------------------------------------------ */
(function setupVideos() {
  const mainVideo = document.getElementById("mainVideo");
  const signVideo = document.getElementById("signVideo");

  if (mainVideo) {
    const src = mainVideo.querySelector("source");
    if (src) src.src = CONFIG.mainVideo;
    mainVideo.muted = VIDEO_SETTINGS.main.muted;
    mainVideo.loop = VIDEO_SETTINGS.main.loop;
    mainVideo.controls = VIDEO_SETTINGS.main.controls;
    mainVideo.load();
    if (VIDEO_SETTINGS.main.autoplay) {
      mainVideo.play().catch(() => {/* autoplay may be blocked; controls remain available */});
    }
  }

  if (signVideo) {
    const src = signVideo.querySelector("source");
    if (src) src.src = CONFIG.signLanguageVideo;
    signVideo.muted = VIDEO_SETTINGS.signLanguage.muted;
    signVideo.loop = VIDEO_SETTINGS.signLanguage.loop;
    signVideo.controls = VIDEO_SETTINGS.signLanguage.controls;
    signVideo.load();
    if (VIDEO_SETTINGS.signLanguage.autoplay) {
      signVideo.play().catch(() => {/* autoplay may be blocked until user interacts with the page */});
    }
  }
})();

/* ------------------------------------------------------------
   3. SLIDE / SECTION NAVIGATION
   ------------------------------------------------------------ */
const slides = Array.from(document.querySelectorAll(".slide"));
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const slideCounter = document.getElementById("slideCounter");
const progressFill = document.getElementById("progressFill");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const TOTAL = slides.length;
let current = 0;

function pad(n) { return String(n + 1).padStart(2, "0"); }

function goToSlide(index, updateHash = true) {
  if (index < 0 || index >= TOTAL) return;
  slides[current].classList.remove("active");
  slides[index].classList.remove("active"); // reset in case animation mid-flight
  current = index;
  slides[current].classList.add("active");

  navLinks.forEach((link) => link.classList.toggle("active", Number(link.dataset.slide) === current));

  if (slideCounter) slideCounter.textContent = `${pad(current)} / ${TOTAL}`;
  if (progressFill) progressFill.style.width = `${((current + 1) / TOTAL) * 100}%`;
  if (prevBtn) prevBtn.disabled = current === 0;
  if (nextBtn) nextBtn.disabled = current === TOTAL - 1;

  if (updateHash) {
    history.replaceState(null, "", `#${slides[current].id}`);
  }

  // Move focus to the slide heading for screen-reader / keyboard users
  const heading = slides[current].querySelector("h1, h2");
  if (heading) heading.setAttribute("tabindex", "-1");

  closeMobileNav();
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    goToSlide(Number(link.dataset.slide));
  });
});

if (prevBtn) prevBtn.addEventListener("click", () => goToSlide(current - 1));
if (nextBtn) nextBtn.addEventListener("click", () => goToSlide(current + 1));

/* Deep-link on load, e.g. index.html#case-study */
(function initialSlide() {
  const hash = window.location.hash.replace("#", "");
  const match = slides.findIndex((s) => s.id === hash);
  goToSlide(match >= 0 ? match : 0, false);
})();

/* ------------------------------------------------------------
   4. KEYBOARD NAVIGATION
   Arrow Left/Right, Home, End — ignored while typing in a field.
   ------------------------------------------------------------ */
document.addEventListener("keydown", (e) => {
  const tag = document.activeElement.tagName;
  const isTyping = tag === "INPUT" || tag === "TEXTAREA" || document.activeElement.isContentEditable;
  if (isTyping) return;

  switch (e.key) {
    case "ArrowRight":
      if (nextBtn) nextBtn.click();
      break;
    case "ArrowLeft":
      if (prevBtn) prevBtn.click();
      break;
    case "Home":
      e.preventDefault();
      goToSlide(0);
      break;
    case "End":
      e.preventDefault();
      goToSlide(TOTAL - 1);
      break;
    case "f":
    case "F":
      e.preventDefault();
      if (fullscreenBtn) fullscreenBtn.click();
      break;
    case "Escape":
      if (document.fullscreenElement) document.exitFullscreen();
      break;
  }
});

/* ------------------------------------------------------------
   5. FULLSCREEN PRESENTATION MODE
   Uses vendor-prefixed fallbacks (Safari/older Chrome/Edge still
   need these) and surfaces a real message if the browser blocks
   the request, instead of failing silently.
   ------------------------------------------------------------ */
const fullscreenBtn = document.getElementById("fullscreenBtn");

function showToast(message, duration = 4000) {
  let toast = document.getElementById("appToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.className = "app-toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove("visible"), duration);
}

function getFullscreenElement() {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement ||
    null
  );
}

function isFullscreenSupported() {
  return !!(
    document.fullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled
  );
}

function requestFullscreenOn(el) {
  const method =
    el.requestFullscreen ||
    el.webkitRequestFullscreen ||
    el.mozRequestFullScreen ||
    el.msRequestFullscreen;
  if (!method) return Promise.reject(new Error("Fullscreen API not available on this element."));
  const result = method.call(el);
  // Older WebKit/IE implementations don't return a promise; normalize to one.
  return result instanceof Promise ? result : Promise.resolve();
}

function exitFullscreenNow() {
  const method =
    document.exitFullscreen ||
    document.webkitExitFullscreen ||
    document.mozCancelFullScreen ||
    document.msExitFullscreen;
  if (!method) return Promise.reject(new Error("Exit fullscreen API not available."));
  const result = method.call(document);
  return result instanceof Promise ? result : Promise.resolve();
}

function updateFullscreenButton() {
  if (!fullscreenBtn) return;
  const active = !!getFullscreenElement();
  fullscreenBtn.querySelector("span").textContent = active ? "Exit Fullscreen" : "Fullscreen";
  fullscreenBtn.setAttribute("aria-pressed", String(active));
}

if (fullscreenBtn) {
  if (!isFullscreenSupported()) {
    // Some contexts (e.g. a page embedded in an iframe without the
    // "fullscreen" permission/allow attribute) disable the API entirely.
    fullscreenBtn.title = "Fullscreen isn't available in this browsing context. Try opening index.html in its own browser tab, or press F11.";
  }

  fullscreenBtn.addEventListener("click", () => {
    if (!getFullscreenElement()) {
      requestFullscreenOn(document.documentElement).catch((err) => {
        console.warn("Fullscreen request failed:", err);
        showToast(
          "Fullscreen was blocked by the browser. If you're viewing this inside an editor's preview pane or an iframe, open index.html in its own tab, or press F11 for your browser's native fullscreen."
        );
      });
    } else {
      exitFullscreenNow().catch((err) => console.warn("Exit fullscreen failed:", err));
    }
  });

  ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"].forEach((evt) => {
    document.addEventListener(evt, updateFullscreenButton);
  });
}

/* ------------------------------------------------------------
   6. MOBILE NAV (hamburger)
   ------------------------------------------------------------ */
const navToggle = document.getElementById("navToggle");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
if (navToggle && !window.matchMedia("(max-width: 900px)").matches) {
  sidebar.classList.remove("collapsed");
  navToggle.classList.remove("sidebar-collapsed");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close navigation menu");
} else if (navToggle) {
  navToggle.classList.add("sidebar-collapsed");
}

function openMobileNav() {
  const mobileSidebar = document.getElementById("sidebar");
  const mobileOverlay = document.getElementById("sidebarOverlay");
  const mobileToggle = document.getElementById("navToggle");
  if (!mobileSidebar || !mobileOverlay || !mobileToggle) return;
  mobileSidebar.classList.add("open");
  mobileOverlay.classList.add("visible");
  mobileToggle.setAttribute("aria-expanded", "true");
  mobileToggle.setAttribute("aria-label", "Close navigation menu");
  mobileToggle.classList.remove("sidebar-collapsed");
  mobileToggle.classList.add("menu-open");
}
function closeMobileNav() {
  if (!window.matchMedia("(max-width: 900px)").matches) return;
  const mobileSidebar = document.getElementById("sidebar");
  const mobileOverlay = document.getElementById("sidebarOverlay");
  const mobileToggle = document.getElementById("navToggle");
  if (!mobileSidebar || !mobileOverlay || !mobileToggle) return;
  mobileSidebar.classList.remove("open");
  mobileOverlay.classList.remove("visible");
  mobileToggle.setAttribute("aria-expanded", "false");
  mobileToggle.setAttribute("aria-label", "Open navigation menu");
  mobileToggle.classList.add("sidebar-collapsed");
  mobileToggle.classList.remove("menu-open");
}
if (navToggle) {
  navToggle.addEventListener("click", () => {
    if (!window.matchMedia("(max-width: 900px)").matches) {
      const isCollapsed = sidebar.classList.toggle("collapsed");
      navToggle.setAttribute("aria-expanded", String(!isCollapsed));
      navToggle.setAttribute("aria-label", isCollapsed ? "Open navigation menu" : "Close navigation menu");
      navToggle.classList.toggle("sidebar-collapsed", isCollapsed);
      return;
    }
    const isOpen = sidebar.classList.contains("open");
    isOpen ? closeMobileNav() : openMobileNav();
  });
}
if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeMobileNav);

/* ------------------------------------------------------------
   7. ACCORDION (Key Terms slide)
   ------------------------------------------------------------ */
document.querySelectorAll(".acc-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".acc-item");
    const panel = item?.querySelector(".acc-panel");
    if (!item || !panel) return;

    const expanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!expanded));
    item.classList.toggle("open", !expanded);
    panel.setAttribute("aria-hidden", String(expanded));
    panel.style.maxHeight = expanded ? "0px" : `${panel.scrollHeight}px`;
  });
});

/* ------------------------------------------------------------
   8. MAIN VIDEO PIP COLLAPSE TOGGLE
   ------------------------------------------------------------ */
const mainPip = document.getElementById("mainPip");
const mainPipCollapse = document.getElementById("mainPipCollapse");
const mainPipDecrease = document.getElementById("mainPipDecrease");
const mainPipIncrease = document.getElementById("mainPipIncrease");
const PIP_SIZE_STEP = 20;
const PIP_MIN_WIDTH = 120;
const PIP_MAX_WIDTH = 420;

function setMainPipSize(width) {
  if (!mainPip) return;
  const maxWidth = Math.min(PIP_MAX_WIDTH, window.innerWidth - 24);
  const nextWidth = Math.min(Math.max(width, PIP_MIN_WIDTH), maxWidth);
  mainPip.style.width = `${nextWidth}px`;
  if (mainPipDecrease) mainPipDecrease.disabled = nextWidth <= PIP_MIN_WIDTH;
  if (mainPipIncrease) mainPipIncrease.disabled = nextWidth >= maxWidth;
}

if (mainPipDecrease) {
  mainPipDecrease.addEventListener("click", (e) => {
    e.stopPropagation();
    setMainPipSize(mainPip.getBoundingClientRect().width - PIP_SIZE_STEP);
  });
}
if (mainPipIncrease) {
  mainPipIncrease.addEventListener("click", (e) => {
    e.stopPropagation();
    setMainPipSize(mainPip.getBoundingClientRect().width + PIP_SIZE_STEP);
  });
}
if (mainPipCollapse) {
  mainPipCollapse.addEventListener("click", (e) => {
    e.stopPropagation(); // don't let this click also start a drag
    mainPip.classList.toggle("collapsed");
    mainPipCollapse.textContent = mainPip.classList.contains("collapsed") ? "+" : "–";
    mainPipCollapse.setAttribute(
      "aria-label",
      mainPip.classList.contains("collapsed") ? "Expand main video" : "Minimize main video"
    );
  });
}

/* ------------------------------------------------------------
   9. DRAGGABLE MAIN VIDEO PIP
   Drag the header bar (grip icon) to move the box anywhere in
   the viewport. Works with mouse, touch, and pen via Pointer Events.
   Position is clamped so the box can't be dragged off-screen.
   ------------------------------------------------------------ */
function makeDraggable(pip) {
  if (!pip) return;
  const handle = pip.querySelector(".video-9-16, .video-16-9");
  if (!handle) return;

  let dragging = false;
  let pointerId = null;
  let startX = 0, startY = 0, startLeft = 0, startTop = 0;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function onPointerDown(e) {
    if (e.target.closest(".pip-collapse, .pip-size-control")) return; // let the controls handle their own clicks
    dragging = true;
    pointerId = e.pointerId;
    handle.setPointerCapture(pointerId);

    const rect = pip.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startLeft = rect.left;
    startTop = rect.top;

    // Switch from corner-anchored (bottom/right) to explicit left/top so it
    // can be positioned freely; this only happens once, on first drag.
    pip.style.left = `${startLeft}px`;
    pip.style.top = `${startTop}px`;
    pip.style.right = "auto";
    pip.style.bottom = "auto";

    pip.classList.add("dragging");
  }

  function onPointerMove(e) {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const maxLeft = Math.max(4, window.innerWidth - pip.offsetWidth - 4);
    const maxTop = Math.max(4, window.innerHeight - pip.offsetHeight - 4);

    const newLeft = clamp(startLeft + dx, 4, maxLeft);
    const newTop = clamp(startTop + dy, 4, maxTop);

    pip.style.left = `${newLeft}px`;
    pip.style.top = `${newTop}px`;
  }

  function onPointerUp(e) {
    if (!dragging || e.pointerId !== pointerId) return;
    dragging = false;
    pip.classList.remove("dragging");
    try { handle.releasePointerCapture(pointerId); } catch (_) { /* already released */ }
    pointerId = null;
  }

  handle.addEventListener("pointerdown", onPointerDown);
  handle.addEventListener("pointermove", onPointerMove);
  handle.addEventListener("pointerup", onPointerUp);
  handle.addEventListener("pointercancel", onPointerUp);

  // Keep the box on-screen if the window is resized/rotated after dragging.
  window.addEventListener("resize", () => {
    if (pip.style.left === "" || pip.style.top === "") return; // still corner-anchored, nothing to clamp
    const rect = pip.getBoundingClientRect();
    const maxLeft = Math.max(4, window.innerWidth - pip.offsetWidth - 4);
    const maxTop = Math.max(4, window.innerHeight - pip.offsetHeight - 4);
    if (rect.left > maxLeft) pip.style.left = `${maxLeft}px`;
    if (rect.top > maxTop) pip.style.top = `${maxTop}px`;
  });
}
makeDraggable(mainPip);
makeDraggable(document.getElementById("signPip"));

/* ------------------------------------------------------------
   10. RESIZABLE MAIN VIDEO PIP
   Resize from any edge or corner while preserving the portrait ratio.
   ------------------------------------------------------------ */
function makeResizable(pip) {
  if (!pip) return;

  const MIN_WIDTH = 120;
  const MAX_WIDTH = 420;
  const handles = pip.querySelectorAll(".pip-resize-handle");
  const videoFrame = pip.querySelector(".video-9-16, .video-16-9");
  const aspectRatio = videoFrame?.classList.contains("video-9-16") ? 9 / 16 : 16 / 9;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  handles.forEach((handle) => {
    handle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const direction = handle.dataset.resize;
      const rect = pip.getBoundingClientRect();
      const startWidth = rect.width;
      const startHeight = rect.height;
      const startLeft = rect.left;
      const startTop = rect.top;
      const headerHeight = pip.querySelector(".pip-header")?.offsetHeight || 0;
      const startX = e.clientX;
      const startY = e.clientY;
      const maxWidth = Math.min(MAX_WIDTH, window.innerWidth - 24);
      const pointerId = e.pointerId;

      pip.style.left = `${startLeft}px`;
      pip.style.top = `${startTop}px`;
      pip.style.right = "auto";
      pip.style.bottom = "auto";
      pip.classList.add("resizing");
      handle.setPointerCapture(pointerId);

      function onMove(moveEvent) {
        if (moveEvent.pointerId !== pointerId) return;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        const horizontalDelta = direction.includes("e") ? dx : direction.includes("w") ? -dx : 0;
        const verticalDelta = direction.includes("s") ? dy : direction.includes("n") ? -dy : 0;
        const widthFromHorizontal = startWidth + horizontalDelta;
        const widthFromVertical = startWidth + (verticalDelta * aspectRatio);
        const requestedWidth = horizontalDelta ? widthFromHorizontal : widthFromVertical;
        const width = clamp(requestedWidth, MIN_WIDTH, maxWidth);
        const height = headerHeight + (width / aspectRatio);

        pip.style.width = `${width}px`;
        if (direction.includes("w")) pip.style.left = `${startLeft + startWidth - width}px`;
        if (direction.includes("n")) pip.style.top = `${startTop + startHeight - height}px`;
      }

      function finishResize() {
        pip.classList.remove("resizing");
        try { handle.releasePointerCapture(pointerId); } catch (_) { /* already released */ }
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", finishResize);
        handle.removeEventListener("pointercancel", finishResize);
      }

      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", finishResize);
      handle.addEventListener("pointercancel", finishResize);
    });
  });
}
makeResizable(mainPip);
makeResizable(document.getElementById("signPip"));
