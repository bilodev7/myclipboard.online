import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shared Clipboard',
  description: 'A real-time shared clipboard application for seamless content sharing',
  keywords: 'clipboard, sharing, real-time, collaboration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#121212" />
      </head>
      <body>
        <div className="relative">
          {/* Decorative elements */}
          <div className="fixed inset-0 z-[-1] overflow-hidden">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-gradient-radial from-primary/5 to-transparent opacity-30 blur-3xl" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-gradient-radial from-secondary/5 to-transparent opacity-30 blur-3xl" />
          </div>

          <main className="flex flex-col min-h-screen">
            {children}
          </main>
        </div>

      </body>
    </html>
  );
}
