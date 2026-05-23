"use client"
import { SessionProvider as NextAuthsessionProvider } from "next-auth/react";

export default function SessionProviders({children}: {children: React.ReactNode}) {
  return (
    <NextAuthsessionProvider
      // Evita refetch automatico durante uso do sistema (formularios).
      refetchOnWindowFocus={false}
      refetchInterval={0}
      refetchWhenOffline={false}
    >
      {children}
    </NextAuthsessionProvider>
  );
}
