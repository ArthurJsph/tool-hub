import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { ReactQueryProvider } from "@/providers/ReactQueryProvider"
import { ToastProvider } from "@/providers/ToastProvider"
import { SessionManager } from "@/components/SessionManager"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "700"],
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["400", "600"],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://toolhub.com'),
  title: {
    default: "Tool Hub - Ferramentas Essenciais para Desenvolvedores",
    template: "%s | Tool Hub"
  },
  description: "Plataforma completa com ferramentas essenciais para desenvolvedores: Gerador de Senhas Seguras, Validador JWT, Gerador UUID/ULID/NanoID, Conversor Base64, Hash Generator (MD5, SHA), Regex Tester, DNS Lookup, Mock Data Generator e muito mais. Totalmente gratuito e sem necessidade de instalação.",
  keywords: [
    "ferramentas desenvolvedor",
    "developer tools",
    "gerador senha",
    "password generator",
    "validador jwt",
    "jwt validator",
    "gerador uuid",
    "uuid generator",
    "base64 converter",
    "hash generator",
    "md5 sha256",
    "regex tester",
    "dns lookup",
    "json formatter",
    "mock data generator",
    "faker",
    "nanoid",
    "ulid",
    "url parser",
    "ferramentas online",
    "online tools"
  ],
  authors: [{ name: "Tool Hub Team", url: "https://toolhub.com" }],
  creator: "Tool Hub",
  publisher: "Tool Hub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://toolhub.com",
    title: "Tool Hub - Ferramentas Essenciais para Desenvolvedores",
    description: "Plataforma completa com mais de 15 ferramentas essenciais para desenvolvedores. Gerador de Senhas, JWT, UUID, Base64, Hash, Regex e muito mais.",
    siteName: "Tool Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tool Hub - Ferramentas para Desenvolvedores",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tool Hub - Ferramentas para Desenvolvedores",
    description: "Ferramentas essenciais para desenvolvedores modernos. Totalmente gratuito.",
    images: ["/og-image.png"],
    creator: "@toolhub",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://toolhub.com",
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${sourceSans.variable}`}
    >
      <head>
        <style>{`
html {
  font-family: ${sourceSans.style.fontFamily}, system-ui, sans-serif;
  --font-sans: ${sourceSans.variable};
  --font-serif: ${playfair.variable};
  --font-mono: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
        `}</style>
      </head>
      <body className="font-sans antialiased">
        <ReactQueryProvider>
          <AuthProvider>
            <ToastProvider>
              <SessionManager>
                {children}
              </SessionManager>
            </ToastProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
