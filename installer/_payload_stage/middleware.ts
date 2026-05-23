import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

function getRequiredFormulario(pathname: string) {
  if (pathname === "/") return "DASHBOARD";
  if (pathname.startsWith("/ccusto/medicao")) return "MEDICAO_CCUSTO";
  if (pathname.startsWith("/ccustos") || pathname.startsWith("/ccusto")) return "CENTRO_CUSTO";
  if (pathname.startsWith("/funcionariosadd") || pathname.startsWith("/funcionario")) return "FUNCIONARIOS";
  if (pathname.startsWith("/patrimoniolist") || pathname.startsWith("/patrimonio")) return "PATRIMONIO";
  if (pathname.startsWith("/funcoes") || pathname.startsWith("/funcao")) return "FUNCOES";
  if (pathname.startsWith("/alocacoes")) return "ALOCACOES";
  if (pathname.startsWith("/acesso-usuarios")) return "ACESSO_USUARIOS";
  if (pathname.startsWith("/unifi-config")) return "UNIFI_CONFIG";
  if (pathname.startsWith("/monitor-patrimonios")) return "UNIFI_CONFIG";
  return null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  if (pathname === "/acesso-negado") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const required = getRequiredFormulario(pathname);
  if (required) {
    const formularios = Array.isArray((token as any).formularios) ? (token as any).formularios : [];
    if (!formularios.includes(required)) {
      return NextResponse.redirect(new URL("/acesso-negado", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    "/api/:path*",
  ],
};
