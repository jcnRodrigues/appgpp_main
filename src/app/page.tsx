import Dashboard from "@/features/dashboard/components/Dashboard/Dashboard";
import Header from "@/components/Header/Header";
import PageHeader from "@/components/PageHeader/PageHeader";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth-options";
import { hasModuleAccess } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { BadgeInfo, Home as HomeIcon } from "lucide-react";
import { getInstalledAppVersion } from "@/lib/app-version";
import HomeDashboardSection from "@/app/HomeDashboardSection";

export default async function Home() {
  const session = await getServerSession(AuthOptions);
  const appVersion = await getInstalledAppVersion();

  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Tela Inicial - Dashboard</h1>
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <p className="mb-6 text-lg">Faça login para visualizar o Dashboard</p>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted px-3 py-1 text-sm text-muted-foreground">
              <BadgeInfo className="h-4 w-4" />
              Versão instalada: {appVersion.version}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, "DASHBOARD")) {
    redirect("/acesso-negado");
  }

  return (
    <div>
      <Header />
      <div className="mx-auto mt-6 max-w-7xl px-4 md:px-6">
        <PageHeader
          icon={HomeIcon}
          title="Dashboard"
          description="Visão geral do sistema e atalhos principais"
        />
      </div>
      <div className="mx-auto max-w-7xl px-4 md:px-6 pb-8">
        <HomeDashboardSection version={appVersion.version} updatedAt={appVersion.updatedAt}>
          <Dashboard />
        </HomeDashboardSection>
      </div>
    </div>
  );
}
