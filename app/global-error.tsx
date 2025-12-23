"use client";

import * as React from "react";

/**
 * GlobalError - Componente de erro global do Next.js
 * 
 * Este componente captura erros que ocorrem no root layout.
 * É importante ter este arquivo para capturar exceções client-side.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-errors-in-root-layouts
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log do erro no console para debug
    console.error("[GlobalError] Erro capturado:", error);

    // Opcional: enviar para serviço de monitoramento
    if (typeof window !== "undefined" && (window as unknown as { posthog?: { capture: (name: string, props: object) => void } }).posthog) {
      (window as unknown as { posthog: { capture: (name: string, props: object) => void } }).posthog.capture("global_error", {
        error_message: error.message,
        error_digest: error.digest,
        error_stack: error.stack?.slice(0, 500),
      });
    }
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              maxWidth: "500px",
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.05)",
              padding: "40px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Ícone de erro */}
            <div
              style={{
                fontSize: "64px",
                marginBottom: "20px",
              }}
            >
              ⚠️
            </div>

            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "16px",
                color: "#ff6b6b",
              }}
            >
              Algo deu errado
            </h1>

            <p
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: "24px",
                lineHeight: "1.6",
              }}
            >
              Ocorreu um erro inesperado. Por favor, tente novamente ou
              recarregue a página.
            </p>

            {/* Mensagem de erro (apenas em desenvolvimento) */}
            {process.env.NODE_ENV === "development" && (
              <pre
                style={{
                  background: "rgba(0, 0, 0, 0.3)",
                  padding: "16px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  textAlign: "left",
                  overflow: "auto",
                  marginBottom: "24px",
                  color: "#ffa502",
                }}
              >
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            )}

            {/* Botões de ação */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => reset()}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#ffffff",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "transform 0.2s, opacity 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Tentar novamente
              </button>

              <button
                onClick={() => window.location.reload()}
                style={{
                  background: "transparent",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.6)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)")
                }
              >
                Recarregar página
              </button>
            </div>

            {/* Link para diagnóstico */}
            <p
              style={{
                marginTop: "24px",
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              Se o problema persistir, tente{" "}
              <a
                href="/api/diagnostic"
                style={{
                  color: "#667eea",
                  textDecoration: "underline",
                }}
              >
                executar o diagnóstico
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
