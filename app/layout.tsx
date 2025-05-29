import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/hide-nextjs-errors.css";
import ClientProviders from '@/components/providers/ClientProviders'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ToastContainer } from '@/components/ui/Toast'

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial']
});

export const metadata: Metadata = {
  title: "GAME PUMP - 让经典游戏再次伟大",
  description: "一个创新的社区驱动 Web3 项目，通过玩家投票复兴经典游戏，并将其带入区块链世界。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClientProviders>
          {children}
        </ClientProviders>
        <ToastContainer />
        <SpeedInsights />
      </body>
    </html>
  );
} 