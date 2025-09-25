import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'KrishiMitra',
  description: 'AI-powered agricultural predictions',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background')}>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <Link href="/" className="mr-6 flex items-center">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="ml-2 text-xl font-bold">KrishiMitra</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Home</Link>
              <Link href="/predict" className="transition-colors hover:text-foreground/80 text-foreground/60">Predict</Link>
              <Link href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">About Us</Link>
              <Link href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">Contact</Link>
            </nav>
            <div className="flex flex-1 items-center justify-end">
               <Button>Login</Button>
            </div>
          </div>
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
