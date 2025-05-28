import '@/styles/globals.css';
import type { Metadata } from 'next';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'Clipboard Online',
  description: 'Real-time clipboard sharing for text and files across all your devices',
  keywords: [
    'clipboard',
    'online',
    'sharing',
    'real-time',
    'sync',
    'files',
    'text',
    'collaboration',
    'copy paste online',
    'universal clipboard',
    'cloud clipboard',
    'shared clipboard',
    'remote clipboard',
    'device sync',
    'cross-device copy',
    'file transfer tool',
    'text synchronization',
    'productivity tool',
    'multi-device clipboard',
    'web clipboard',
    'secure clipboard sharing',
    'instant clipboard',
    'digital clipboard',
    'data transfer',
    'seamless sharing',
    'clipboard manager',
    'online copy paste',
    'pasteboard online',
  ],
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
        <ToastProvider>
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
        </ToastProvider>
      </body>
    </html>
  );
}
