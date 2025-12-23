"use client";

import { useEffect, useState } from "react";

import { I18nextProvider } from "react-i18next";

import i18n from "@/i18n/config";

/**
 * I18nProvider - Provedor de internacionalização
 * 
 * Usa um estado de hidratação para evitar mismatch entre
 * servidor e cliente, que causa erros client-side.
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Marca como hidratado após a montagem do componente
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Verifica se o i18n já está inicializado
    const checkInitialization = () => {
      if (i18n.isInitialized) {
        setIsInitialized(true);
        return true;
      }
      return false;
    };

    // Tenta verificar imediatamente
    if (checkInitialization()) {
      return;
    }

    // Se não estiver inicializado, aguarda o evento
    const handleInitialized = () => {
      setIsInitialized(true);
    };

    i18n.on("initialized", handleInitialized);

    // Timeout de segurança - se não inicializar em 3s, força
    const timeout = setTimeout(() => {
      if (!i18n.isInitialized) {
        console.warn("[I18nProvider] Timeout waiting for i18n initialization, forcing...");
        setIsInitialized(true);
      }
    }, 3000);

    return () => {
      i18n.off("initialized", handleInitialized);
      clearTimeout(timeout);
    };
  }, []);

  // Durante SSR ou antes da hidratação, renderiza os filhos diretamente
  // Isso evita o flash de conteúdo vazio
  if (!isHydrated) {
    // Durante SSR, renderiza com o provider normalmente
    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
  }

  // Após hidratação, aguarda a inicialização do i18n
  if (!isInitialized) {
    // Fallback visual durante inicialização (muito breve, geralmente não aparece)
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        suppressHydrationWarning
      >
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
