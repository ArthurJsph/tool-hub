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
  title: "Tool Hub - Dashboard Admin",
  description: "Dashboard administrativo com ferramentas de desenvolvedor",
  generator: "v0.app",
  icons: {
    icon: "/tool-hub-icon.png",
    shortcut: "/tool-hub-icon.png",
    apple: "/tool-hub-icon.png",
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
