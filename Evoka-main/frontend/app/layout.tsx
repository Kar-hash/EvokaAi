import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from "@vercel/analytics/react";
import './globals.css';

// Load the Inter font with Latin subset for consistent typography
const inter = Inter({ subsets: ['latin'] });

/**
 * Root layout component for Evoka AI.
 * Provides global styling and analytics integration.
 * @param {React.ReactNode} children - Child components to render.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
