"use client";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import pt from "./locales/pt.json";

const resources = {
  pt: {
    translation: pt,
  },
  en: {
    translation: en,
  },
};

// Verifica se estamos no browser
const isBrowser = typeof window !== "undefined";

// Configuração base do i18n
const i18nConfig = {
  resources,
  lng: "pt", // Idioma padrão
  fallbackLng: "en",
  debug: process.env.NODE_ENV === "development" && isBrowser,
  interpolation: {
    escapeValue: false,
  },
  detection: {
    // Só usa detecção no browser
    order: isBrowser ? ["localStorage", "navigator"] : [],
    caches: isBrowser ? ["localStorage"] : [],
  },
  react: {
    useSuspense: false, // Importante para Next.js
  },
};

// Inicializa o i18n apenas se ainda não estiver inicializado
if (!i18n.isInitialized) {
  try {
    // Adiciona LanguageDetector apenas no browser
    if (isBrowser) {
      i18n.use(LanguageDetector);
    }

    i18n
      .use(initReactI18next)
      .init(i18nConfig)
      .catch((err) => {
        console.error("[i18n] Failed to initialize:", err);
      });
  } catch (error) {
    console.error("[i18n] Error during initialization:", error);
    // Fallback: inicializa sem LanguageDetector
    i18n
      .use(initReactI18next)
      .init(i18nConfig)
      .catch((err) => {
        console.error("[i18n] Fallback initialization failed:", err);
      });
  }
}

export default i18n;
