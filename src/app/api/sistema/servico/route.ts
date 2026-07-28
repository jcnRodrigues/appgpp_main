import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth-options";
import { hasActionPermission, hasModuleAccess } from "@/lib/permissions";
import {
  APPGPP_SERVICE_NAME,
  getWindowsServiceStatus,
  getRecentServiceLogs,
  restartWindowsService,
  startWindowsService,
  stopWindowsService,
} from "@/lib/windows-service";

export async function GET() {
  const session = await getServerSession(AuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Usuario nao autenticado." }, { status: 401 });
  }

  const forms = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(forms, "SISTEMA")) {
    return NextResponse.json({ error: "Sem permissao para acessar o servico." }, { status: 403 });
  }

  const result = await getWindowsServiceStatus(APPGPP_SERVICE_NAME);
  const recentLogs = await getRecentServiceLogs(30);
  return NextResponse.json({ ...result, serviceName: APPGPP_SERVICE_NAME, recentLogs });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(AuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Usuario nao autenticado." }, { status: 401 });
  }

  const forms = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(forms, "SISTEMA") || !hasActionPermission(forms, "UPDATE")) {
    return NextResponse.json({ error: "Sem permissao para alterar o servico." }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const action = String(body?.action || "").toLowerCase();

    if (action === "start") {
      const result = await startWindowsService(APPGPP_SERVICE_NAME);
      return NextResponse.json({ ...result, serviceName: APPGPP_SERVICE_NAME });
    }

    if (action === "stop") {
      const result = await stopWindowsService(APPGPP_SERVICE_NAME);
      return NextResponse.json({ ...result, serviceName: APPGPP_SERVICE_NAME });
    }

    if (action === "restart") {
      const result = await restartWindowsService(APPGPP_SERVICE_NAME);
      return NextResponse.json({ ...result, serviceName: APPGPP_SERVICE_NAME });
    }

    return NextResponse.json({ error: "Acao invalida." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erro ao processar a solicitacao." }, { status: 500 });
  }
}
