import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Footer from '@/components/Footer/Footer';
import SessionProviders from '@/components/Providers/SessionProviders';
import SystemAlertProvider from '@/components/SystemAlert/SystemAlertProvider';
import ThemeProvider from '@/components/Providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'AppGPP - Gestão de Patrimônio',
  description: 'Aplicativo para gestão de patrimônio e usuários'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <Script id="appgpp-theme-bootstrap" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var saved = localStorage.getItem('appgpp-theme');
                var savedMode = localStorage.getItem('appgpp-theme-mode');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var mode = (savedMode === 'system' || savedMode === 'light' || savedMode === 'dark')
                  ? savedMode
                  : ((saved === 'light' || saved === 'dark') ? saved : 'system');
                var theme = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;
                if (theme === 'dark') document.documentElement.classList.add('dark');
              } catch (e) {}
            })();
          `}
        </Script>
      </head>
      <body className="antialiased">
        <SessionProviders>
          <ThemeProvider>
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              {children}
              <Footer />
            </div>
            <SystemAlertProvider />
          </ThemeProvider>
        </SessionProviders>
      </body>
    </html>
  );
}
