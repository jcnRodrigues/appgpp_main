"use client"
import {SessionProvider as NextAuthsessionProvider} from 'next-auth/react';

export default function SessionProviders({children}: {children: React.ReactNode}) {
  return (<NextAuthsessionProvider>{children}</NextAuthsessionProvider>);
}

