import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/back-end/components/Footer/Footer";
import SessionProviders from "@/back-end/components/Providers/SessionProviders";
import SystemAlertProvider from "@/back-end/components/SystemAlert/SystemAlertProvider";
import ThemeProvider from "@/back-end/components/Providers/ThemeProvider";

export const metadata: Metadata = {
  title: "AppGPP - Gestão de Patrimônio",
  description: "Aplicativo para gestão de patrimônio e usuários",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>,) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
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
            `,
          }}
        />
      </head>
      <body className="antialiased">
          <SessionProviders>
          <ThemeProvider>
          <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            {children}
            <Footer />
          </div>
          <SystemAlertProvider />
          </ThemeProvider>
          </SessionProviders>
      </body>
    </html >
  );
}
