// T10: Marathi / Hindi / English for the phone page (residents of older Mumbai buildings may not read English).
// Translations are drafts written by us; a native speaker should review before real use.
const T: Record<string, Record<string, string>> = {
  en: {
    sub: "Each phone signs its own readings to Arkiv",
    dash: "dashboard →",
    site: "Site",
    name: "This phone",
    start: "Start sensor",
    stop: "Stop",
    lay: "Lay the phone flat on the floor, screen up, then press Start.",
    srcT: "Demo vibration source",
    src: "Be the vibration source",
    syncT: "Sound sync (works offline)",
    sync: "Play sync sound",
  },
  mr: {
    sub: "प्रत्येक फोन स्वतःच्या नोंदी Arkiv वर स्वाक्षरीसह ठेवतो",
    dash: "डॅशबोर्ड →",
    site: "इमारत / साइट",
    name: "हा फोन",
    start: "नोंद सुरू करा",
    stop: "थांबवा",
    lay: "फोन जमिनीवर सपाट ठेवा, स्क्रीन वर, मग 'नोंद सुरू करा' दाबा.",
    srcT: "डेमो कंपन स्रोत",
    src: "कंपन स्रोत बना",
    syncT: "आवाजाने वेळ जुळवा (इंटरनेटशिवाय)",
    sync: "सिंक आवाज वाजवा",
  },
  hi: {
    sub: "हर फ़ोन अपनी रीडिंग पर खुद हस्ताक्षर करके Arkiv पर रखता है",
    dash: "डैशबोर्ड →",
    site: "इमारत / साइट",
    name: "यह फ़ोन",
    start: "रिकॉर्डिंग शुरू करें",
    stop: "रोकें",
    lay: "फ़ोन को ज़मीन पर सीधा रखें, स्क्रीन ऊपर, फिर 'रिकॉर्डिंग शुरू करें' दबाएँ.",
    srcT: "डेमो कंपन स्रोत",
    src: "कंपन स्रोत बनें",
    syncT: "आवाज़ से समय मिलाएँ (बिना इंटरनेट)",
    sync: "सिंक आवाज़ बजाएँ",
  },
};

export let lang = "en";
export const t = (k: string) => T[lang]?.[k] ?? T.en![k] ?? k;

export function applyLang(l: string) {
  lang = T[l] ? l : "en";
  document.documentElement.lang = lang;
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const k = el.dataset.i18n!;
    // The Start button flips to Stop while sensing; keep that state.
    if (el.id === "start" && el.classList.contains("running")) el.textContent = t("stop");
    else el.textContent = t(k);
  });
  try {
    localStorage.setItem("tw.lang", lang);
  } catch {
    /* ignore */
  }
}

export function initLang() {
  let saved = "en";
  try {
    saved = localStorage.getItem("tw.lang") ?? (navigator.language.startsWith("mr") ? "mr" : navigator.language.startsWith("hi") ? "hi" : "en");
  } catch {
    /* ignore */
  }
  document.querySelectorAll<HTMLButtonElement>("[data-lang]").forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.lang!)));
  applyLang(saved);
}
