import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * API Route para forçar revalidação do cache
 *
 * Uso: GET /api/revalidate?secret=SEU_SECRET&path=/
 *
 * Isso força o Next.js a regenerar a página especificada
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");
  const path = searchParams.get("path") || "/";

  // Verificar token secreto (em produção, use variável de ambiente)
  const expectedSecret =
    process.env.REVALIDATE_SECRET || "taskscribe-revalidate-2024";

  if (secret !== expectedSecret) {
    return NextResponse.json(
      {
        error: "Invalid secret",
        message: "Provide ?secret=YOUR_SECRET to revalidate",
      },
      { status: 401 }
    );
  }

  try {
    // Revalidar o path especificado
    revalidatePath(path);

    // Também revalidar rotas comuns se for a raiz
    if (path === "/") {
      revalidatePath("/", "layout");
    }

    return NextResponse.json({
      success: true,
      message: `Revalidated path: ${path}`,
      timestamp: new Date().toISOString(),
      instructions: [
        "Cache do Next.js foi purgado para este path",
        "O CDN da Hostinger pode ainda ter cache - purge via hPanel se necessário",
        "Aguarde alguns segundos e recarregue a página",
      ],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to revalidate",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
