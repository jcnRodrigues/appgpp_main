/* eslint-disable @next/next/no-img-element */
"use client";

import {
  ClipboardCheck,
  ClipboardList,
  DatabaseBackup,
  Home,
  KeyRound,
  LandmarkIcon,
  LaptopIcon,
  LogOut,
  Menu,
  Monitor,
  Moon,
  PackagePlusIcon,
  Router,
  Settings,
  Sun,
  User,
  UserCog,
  UserSearchIcon,
  SlidersHorizontal
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState, type ElementType } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { useTheme } from '../Providers/ThemeProvider';
import { hasModuleAccess } from '@/lib/permissions';

type MenuItem = {
  icon: ElementType;
  label: string;
  href: string;
  required?: string | string[];
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const { theme, mode, setMode } = useTheme();

  const userFormularios = ((session?.user as any)?.formularios || []) as string[];
  const canView = (required?: string | string[]) =>
    !required
      ? true
      : Array.isArray(required)
        ? required.some((item) => hasModuleAccess(userFormularios, item))
        : hasModuleAccess(userFormularios, required);

  const menuItens: MenuItem[] = [
    { icon: Home, label: 'Home', href: '/', required: 'DASHBOARD' },
    { icon: User, label: 'Funcionários', href: '/funcionarios', required: 'FUNCIONARIOS' },
    { icon: LaptopIcon, label: 'Patrimônio', href: '/patrimoniolist', required: 'PATRIMONIO' },
    { icon: Settings, label: 'Monitor de Patrimônios', href: '/monitor-patrimonios', required: 'MONITOR_PATRIMONIOS' },
    { icon: SlidersHorizontal, label: 'Sistema', href: '/sistema', required: 'SISTEMA' },
    { icon: ClipboardList, label: 'Varredura de Patrimônios', href: '/monitor-patrimonios/agente/varredura', required: 'VARREDURA_PATRIMONIOS' },
    { icon: LandmarkIcon, label: 'Centros de Custo', href: '/ccustos', required: 'CENTRO_CUSTO' },
    { icon: ClipboardCheck, label: 'Conferir Medição', href: '/ccusto/medicao', required: 'MEDICAO_CCUSTO' },
    { icon: ClipboardList, label: 'Inventário', href: '/inventario', required: 'PATRIMONIO' },
    { icon: UserSearchIcon, label: 'Funções', href: '/funcoes', required: 'FUNCOES' },
    { icon: KeyRound, label: 'Licenças de Software', href: '/licencas', required: 'LICENCAS_SOFTWARE' },
    { icon: PackagePlusIcon, label: 'Alocação de Patrimônios', href: '/alocacoes', required: 'ALOCACOES' },
    {
      icon: DatabaseBackup,
      label: 'Importar e Exportar Dados',
      href: '/sistema-dados',
      required: ['IMPORTAR_DADOS', 'EXPORTAR_DADOS', 'IMPORTACAO_EXPORTACAO']
    },
    { icon: DatabaseBackup, label: 'Backup DB (1 a 6)', href: '/backup-db', required: 'BACKUP_DB' },
    { icon: Router, label: 'Ativos de Rede', href: '/ativos-rede', required: 'ATIVOS_REDE' },
    { icon: UserCog, label: 'Acesso de Usuários', href: '/acesso-usuarios', required: 'ACESSO_USUARIOS' }
  ];

  return (
    <header className="sticky top-0 z-50 mb-6 border-b border-border/50 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image
            src="/Imagens/image31_2.svg"
            alt="Logo App GPP"
            width={150}
            height={134}
            priority
            className="h-auto w-auto max-h-12 sm:max-h-16"
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full border border-border/60 bg-card p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setMode('system')}
              aria-label="Tema do sistema"
              title="Usar tema do sistema"
              className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${
                mode === 'system' ? 'bg-accent/15 text-accent ring-1 ring-accent/35' : 'text-foreground/80 hover:bg-secondary'
              }`}
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setMode('light')}
              aria-label="Tema claro"
              title="Forçar tema claro"
              className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${
                mode === 'light' ? 'bg-accent/15 text-accent ring-1 ring-accent/35' : 'text-foreground/80 hover:bg-secondary'
              }`}
            >
              <Sun className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setMode('dark')}
              aria-label="Tema escuro"
              title="Forçar tema escuro"
              className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${
                mode === 'dark' ? 'bg-accent/15 text-accent ring-1 ring-accent/35' : 'text-foreground/80 hover:bg-secondary'
              }`}
            >
              <Moon className="h-4 w-4" />
            </button>
          </div>

          <div className="hidden items-center rounded-full border border-border/60 bg-card px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm sm:flex">
            <span className="mr-2 h-2 w-2 rounded-full bg-accent" />
            {mode === 'system' ? `Sistema (${theme === 'dark' ? 'Escuro' : 'Claro'})` : mode === 'dark' ? 'Escuro' : 'Claro'}
          </div>

          <div className="rounded-full border border-border bg-card p-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button type="button" aria-label="Abrir menu" className="grid h-8 w-8 place-items-center">
                  <Menu className="h-6 w-6 text-primary" />
                </button>
              </SheetTrigger>
              <SheetContent className="border-l border-accent/30 p-0">
                <div className="flex h-full min-h-0 flex-col">
                  <SheetHeader className="shrink-0 border-b border-border px-4 py-4">
                    <SheetTitle className="flex flex-col items-center gap-2 text-primary">
                      <Image
                        src="/Imagens/image31_2.svg"
                        alt="Logo App GPP"
                        width={78}
                        height={96}
                        className="h-auto w-auto max-h-6"
                        style={{ width: 'auto', height: 'auto' }}
                      />
                      Menu
                    </SheetTitle>
                    <SheetDescription className="text-center text-muted-foreground">
                      Navegue pelos módulos disponíveis e gerencie seus recursos de forma simples.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
                    {status === 'authenticated' && session ? (
                      <>
                        <div className="mt-6 flex items-center gap-4 border-b border-border pb-6">
                          <div className="h-14 w-14 overflow-hidden rounded-full">
                            <img
                              src={session.user?.image || '/Imagens/image31_2.svg'}
                              alt={session.user?.name || 'Avatar do usuário'}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate font-bold text-foreground">Bem-vindo, {session.user?.name}</span>
                            <span className="truncate text-sm text-muted-foreground">{session.user?.email}</span>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-4">
                          {menuItens
                            .filter((item) => canView(item.required))
                            .map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-base text-primary transition-colors hover:bg-secondary hover:text-accent"
                              >
                                <item.icon className="h-5 w-5 text-accent" />
                                {item.label}
                              </Link>
                            ))}

                          <button
                            type="button"
                            onClick={() => {
                              signOut();
                              setOpen(false);
                            }}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-base text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <LogOut className="h-5 w-5 text-red-500" />
                            Sair
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="mt-6 flex flex-col gap-3">
                        <Button
                          onClick={() => signIn('google')}
                          className="flex w-full items-center justify-center gap-2 border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M19.8055 8.0415H19V8H10V12H15.4045C14.7916 14.1276 12.8882 15.7526 10.5 15.7526C7.42616 15.7526 4.94018 13.2667 4.94018 10.1929C4.94018 7.11902 7.42616 4.63297 10.5 4.63297C11.9366 4.63297 13.2262 5.19015 14.1908 6.09523L17.1898 3.09523C15.4123 1.45032 13.0476 0.383789 10.5 0.383789C5.25215 0.383789 1 4.6359 1 9.88374C1 15.1316 5.25215 19.3837 10.5 19.3837C15.2467 19.3837 19.1639 16.0273 19.8382 11.7501C19.9398 10.9256 20 10.0523 19.9944 9.17309C19.9726 8.79159 19.9071 8.41008 19.8055 8.0415Z" fill="#FFC107" />
                            <path d="M2.42683 5.88798L5.92215 8.47418C6.73156 6.27523 8.46115 4.63297 10.5 4.63297C11.9366 4.63297 13.2262 5.19015 14.1907 6.09523L17.1898 3.09523C15.4123 1.45032 13.0476 0.383789 10.5 0.383789C7.05305 0.383789 4.03306 2.64633 2.42683 5.88798Z" fill="#FF3D00" />
                            <path d="M10.5 19.3837C13.0005 19.3837 15.2264 18.3599 16.9122 16.7356L13.6494 13.9906C12.7122 14.6787 11.6095 15.0689 10.5 15.0689C8.13156 15.0689 6.10297 13.4805 5.49335 11.2091L2.0658 13.8093C3.68417 17.1245 6.87874 19.3837 10.5 19.3837Z" fill="#4CAF50" />
                            <path d="M19.8055 8.0415H19V8H10V12H15.4045C15.1097 12.9379 14.5461 13.7837 13.7998 14.4261L13.8002 14.4257L16.9114 17.1115C16.7344 17.2714 19.9999 15.0001 19.9999 10.0001C19.9999 9.36999 19.9359 8.72378 19.8055 8.0415Z" fill="#1976D2" />
                          </svg>
                          Login Google
                        </Button>
                        <Button onClick={() => signIn('credentials')} className="w-full justify-center">
                          Login Local
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
