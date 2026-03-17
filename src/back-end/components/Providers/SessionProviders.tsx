"use client"
import { useMemo } from "react";
import { SessionProvider as NextAuthsessionProvider } from "next-auth/react";

export default function SessionProviders({children}: {children: React.ReactNode}) {
  const isLanAccess = useMemo(() => {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") return false;
    // IPv4 privados e nomes diferentes de localhost
    const isPrivateIpv4 =
      /^10\.\d+\.\d+\.\d+$/.test(host) ||
      /^192\.168\.\d+\.\d+$/.test(host) ||
      /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(host);
    return isPrivateIpv4 || host.includes(".");
  }, []);

  return (
    <NextAuthsessionProvider
      // Evita refresh automático que limpa formulários quando acessa via rede
      refetchOnWindowFocus={!isLanAccess}
      refetchInterval={isLanAccess ? 0 : undefined}
      refetchWhenOffline={isLanAccess ? false : undefined}
    >
      {children}
    </NextAuthsessionProvider>
  );
}

