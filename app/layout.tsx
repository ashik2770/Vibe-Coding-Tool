import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'AI WebApp Builder - Build Apps with AI',
  description: 'Create production-ready web applications with AI assistance. React, Next.js, and Tailwind CSS projects in minutes.',
  keywords: 'AI, web development, React, Next.js, Tailwind CSS, app builder, code generation',
  authors: [{ name: 'AI WebApp Builder Team' }],
  creator: 'AI WebApp Builder',
  publisher: 'AI WebApp Builder',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'AI WebApp Builder - Build Apps with AI',
    description: 'Create production-ready web applications with AI assistance. React, Next.js, and Tailwind CSS projects in minutes.',
    url: '/',
    siteName: 'AI WebApp Builder',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI WebApp Builder',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI WebApp Builder - Build Apps with AI',
    description: 'Create production-ready web applications with AI assistance. React, Next.js, and Tailwind CSS projects in minutes.',
    images: ['/twitter-image.png'],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                backdropFilter: 'blur(10px)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}