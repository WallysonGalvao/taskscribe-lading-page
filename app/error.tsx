"use client";

import * as React from "react";

/**
 * Error - Componente de erro do Next.js para rotas
 * 
 * Este componente captura erros que ocorrem em páginas.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[Error] Erro na página:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-md text-center bg-white/5 p-10 rounded-2xl border border-white/10">
        <div className="text-6xl mb-5">⚠️</div>

        <h1 className="text-2xl font-bold text-red-400 mb-4">
          Algo deu errado
        </h1>

        <p className="text-gray-400 mb-6">
          Ocorreu um erro ao carregar esta página. Por favor, tente novamente.
        </p>

        {process.env.NODE_ENV === "development" && (
          <pre className="bg-black/30 p-4 rounded-lg text-xs text-left overflow-auto mb-6 text-orange-400">
            {error.message}
            {error.digest && `\nDigest: ${error.digest}`}
          </pre>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => reset()}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Tentar novamente
          </button>

          <button
            onClick={() => window.location.href = "/"}
            className="bg-transparent border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:border-white/60 transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    </div>
  );
}
