import type { Metadata } from "next";
import "./globals.css";
import { Syne } from "next/font/google";
import Footer from "@/back-end/components/Footer/Footer";
import SessionProviders from "@/back-end/components/Providers/SessionProviders";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});


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
      <body
        className={`${syne.className}  antialiased`}
      >
          <SessionProviders>
          <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            {children}
            <Footer />
          </div>
          </SessionProviders>
      </body>
    </html >
  );
}
