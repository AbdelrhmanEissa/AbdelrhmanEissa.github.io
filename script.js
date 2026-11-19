/**
 * Abdelrhman Eissa - Digital Profile & Business Card Logic
 */

// Set Current Year dynamically & initialize QR code
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  setupQrCode();
});

/**
 * Fast Save Contact Handler
 * 1. Web Share Level 2 (navigator.share with File): Directly triggers OS native Contact import sheet without disk download.
 * 2. Direct Navigation to abdelrhman_eissa.vcf: Mobile browsers pass .vcf straight to Contacts app.
 */
async function saveContact() {
  const vcardText = `BEGIN:VCARD
VERSION:3.0
N:Eissa;Abdelrhman;;;
FN:Abdelrhman Eissa
ORG:Eisus Enterprise
TITLE:Founder & Technology Architect (IoT, Embedded & PBX)
TEL;TYPE=CELL,VOICE,PREF:+201227799714
TEL;TYPE=WORK,VOICE:+201227799714
EMAIL;TYPE=INTERNET,PREF:abdelrahman@eisus.online
URL;TYPE=WORK:https://abdelrhmaneissa.github.io/
URL:https://eisus.online
URL:https://www.linkedin.com/in/abdelrhmaneissa/
X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/abdelrhmaneissa/
X-SOCIALPROFILE;TYPE=github:https://github.com/AbdelrhmanEissa
X-SOCIALPROFILE;TYPE=whatsapp:https://wa.me/201227799714
NOTE:Founder & Tech Lead at Eisus | Embedded Systems, IoT Solutions, GSM Gateways & Enterprise PBX Systems
END:VCARD`;

  // 1. Try Web Share API Level 2 (Directly invokes iOS / Android Contacts Import)
  if (navigator.share && navigator.canShare) {
    try {
      const file = new File([vcardText], "Abdelrhman_Eissa.vcf", { type: "text/vcard" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Abdelrhman Eissa",
          text: "Abdelrhman Eissa - Founder & Technology Architect | Eisus"
        });
        showToast("Opening contacts...");
        return;
      }
    } catch (err) {
      if (err.name === "AbortError") {
        return; // User cancelled
      }
      console.log("Web Share fallback:", err);
    }
  }

  // 2. Direct navigation to abdelrhman_eissa.vcf
  window.location.href = "abdelrhman_eissa.vcf";
  showToast("Opening contacts...");
}

/**
 * Copy Text to Clipboard with visual feedback
 */
function copyToClipboard(text, message) {
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
 * Toast notification
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
  }, 2500);
}

/**
 * QR Code Modal Setup & Generation (Supports Direct Contact QR & Website QR)
 */
let currentTab = 'contact';

function setupQrCode() {
  switchQrTab('contact');
}

function switchQrTab(tab) {
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
    
    // Direct VCard QR format recognized natively by iOS Camera & Android Google Lens
    const vcardString = `BEGIN:VCARD\nVERSION:3.0\nN:Eissa;Abdelrhman\nFN:Abdelrhman Eissa\nORG:Eisus Enterprise\nTITLE:Founder & Technology Architect\nTEL:+201227799714\nEMAIL:abdelrahman@eisus.online\nURL:https://abdelrhmaneissa.github.io/\nURL:https://www.linkedin.com/in/abdelrhmaneissa/\nEND:VCARD`;
    
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
