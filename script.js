/**
 * Abdelrhman Eissa - Digital Profile & Business Card Logic
 * Ultra-Fast & High Interactivity Engine
 */

// Register Service Worker for instant offline/repeat visits (Sub-second loading)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // Set dynamic copyright year
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Start Realtime System Clock
  initClock();

  // Setup Mouse / Touch Interactive Spotlight
  setupSpotlight();

  // Setup QR Modal
  setupQrCode();
});

/**
 * Haptic Vibration Feedback (Crisp Tactile Tap)
 */
function triggerHaptic(duration = 15) {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(duration);
    } catch (e) {}
  }
}

/**
 * Realtime System Clock (Dot Matrix Style)
 */
function initClock() {
  const clockEl = document.getElementById("liveClock");
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hrs}:${mins}:${secs}`;
  }

  update();
  setInterval(update, 1000);
}

/**
 * Dynamic Pointer / Touch Light Spotlight
 * Smoothly tracks user interaction on the card border
 */
function setupSpotlight() {
  const card = document.querySelector(".card-wrapper");
  if (!card) return;

  let ticking = false;

  function handlePointer(e) {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
      ticking = false;
    });
  }

  window.addEventListener("mousemove", handlePointer, { passive: true });
  card.addEventListener("touchmove", handlePointer, { passive: true });
}

/**
 * Electrical Circuit Trace Pulse Trigger
 * Shoots an energetic glowing pulse across the circuit backdrop
 */
function triggerCircuitPulse() {
  triggerHaptic(25);
  const container = document.querySelector(".circuit-bg-container");
  if (!container) return;

  container.classList.remove("circuit-pulse-active");
  void container.offsetWidth; // Force reflow
  container.classList.add("circuit-pulse-active");

  showToast("⚡ Circuit Synced");
}

/**
 * Fast Save Contact Handler
 * 1. Web Share Level 2 (navigator.share with File): Direct contact import sheet.
 * 2. Direct Navigation to abdelrhman_eissa.vcf.
 */
async function saveContact() {
  triggerHaptic(20);
  const vcardText = `BEGIN:VCARD
VERSION:3.0
N:Eissa;Abdelrhman;;;
FN:Abdelrhman Eissa
ORG:Eisus Enterprise
TITLE:Founder & Technology Leader (Smart Systems & Electrical Engineering)
TEL;TYPE=CELL,VOICE,PREF:+201227799714
TEL;TYPE=WORK,VOICE:+201227799714
EMAIL;TYPE=INTERNET,PREF:abdelrahman@eisus.online
URL;TYPE=WORK:https://abdelrhmaneissa.github.io/
URL:https://eisus.online
URL:https://www.linkedin.com/in/abdelrhmaneissa/
X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/abdelrhmaneissa/
X-SOCIALPROFILE;TYPE=github:https://github.com/AbdelrhmanEissa
X-SOCIALPROFILE;TYPE=whatsapp:https://wa.me/201227799714
NOTE:Founder & Executive Tech Leader at Eisus | Smart Building Automation, Advanced Electrical Engineering & Next-Gen Smart Living Solutions
END:VCARD`;

  if (navigator.share && navigator.canShare) {
    try {
      const file = new File([vcardText], "Abdelrhman_Eissa.vcf", { type: "text/vcard" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Abdelrhman Eissa",
          text: "Abdelrhman Eissa - Founder & Technology Leader | Eisus"
        });
        showToast("Opening contacts...");
        return;
      }
    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }

  window.location.href = "abdelrhman_eissa.vcf";
  showToast("Opening contacts...");
}

/**
 * Copy Text to Clipboard with visual feedback & morphing checkmark
 */
function copyToClipboard(text, message, event) {
  triggerHaptic(15);

  if (event) {
    const target = event.currentTarget || event.target;
    const chip = target.querySelector ? (target.querySelector(".copy-chip") || target) : target;
    if (chip && chip.classList.contains("copy-chip")) {
      const originalHtml = chip.innerHTML;
      chip.classList.add("copied");
      chip.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#00e676" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      
      setTimeout(() => {
        chip.classList.remove("copied");
        chip.innerHTML = originalHtml;
      }, 1800);
    }
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => showToast(message || "Copied to clipboard!"))
      .catch(() => fallbackCopy(text, message));
  } else {
    fallbackCopy(text, message);
  }
}

function fallbackCopy(text, message) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
    showToast(message || "Copied to clipboard!");
  } catch (err) {
    showToast("Failed to copy");
  }
  document.body.removeChild(textArea);
}

/**
 * Toast Notification
 */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add("show");
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

/**
 * QR Code Modal Setup & Generation
 */
let currentTab = 'contact';

function setupQrCode() {
  switchQrTab('contact');
}

function switchQrTab(tab) {
  triggerHaptic(10);
  currentTab = tab;
  const tabContact = document.getElementById("tabContactQr");
  const tabWebsite = document.getElementById("tabWebsiteQr");
  const instruction = document.getElementById("qrInstructionText");
  const targetText = document.getElementById("qrTargetUrlText");
  const qrImage = document.getElementById("qrImage");
  const downloadBtn = document.getElementById("downloadQrBtn");

  if (!tabContact || !tabWebsite || !qrImage) return;

  if (tab === 'contact') {
    tabContact.classList.add("active");
    tabWebsite.classList.remove("active");
    instruction.textContent = "امسحه بكاميرا أي هاتف ليفتح جهات الاتصال ويسجل رقمك وبياناتك فوراً!";
    
    const vcardString = `BEGIN:VCARD\nVERSION:3.0\nN:Eissa;Abdelrhman\nFN:Abdelrhman Eissa\nORG:Eisus Enterprise\nTITLE:Founder & Technology Leader\nTEL:+201227799714\nEMAIL:abdelrahman@eisus.online\nURL:https://abdelrhmaneissa.github.io/\nURL:https://www.linkedin.com/in/abdelrhmaneissa/\nEND:VCARD`;
    
    targetText.textContent = "⚡ Direct Contact: Abdelrhman Eissa (+201227799714)";
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=450x450&margin=15&format=png&data=${encodeURIComponent(vcardString)}`;
    qrImage.src = qrUrl;
    if (downloadBtn) {
      downloadBtn.href = qrUrl;
      downloadBtn.setAttribute("download", "abdelrhman-eissa-contact-qr.png");
    }
  } else {
    tabWebsite.classList.add("active");
    tabContact.classList.remove("active");
    instruction.textContent = "امسحه بكاميرا الهاتف ليفتح صفحتك الشخصية وملفك بالكامل:";
    
    const siteUrl = "https://abdelrhmaneissa.github.io/";
    targetText.textContent = siteUrl;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=450x450&margin=15&format=png&data=${encodeURIComponent(siteUrl)}`;
    qrImage.src = qrUrl;
    if (downloadBtn) {
      downloadBtn.href = qrUrl;
      downloadBtn.setAttribute("download", "abdelrhman-eissa-website-qr.png");
    }
  }
}

function toggleQrModal() {
  triggerHaptic(15);
  const modal = document.getElementById("qrModal");
  if (modal) {
    modal.classList.toggle("active");
  }
}

function closeQrModalOnBackdrop(e) {
  if (e.target.id === "qrModal") {
    toggleQrModal();
  }
}
