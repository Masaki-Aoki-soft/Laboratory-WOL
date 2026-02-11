import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextFont } from 'next/dist/compiled/@next/font';
import React, { ReactNode, Suspense } from 'react';
import { ToasterContext } from './context/ToastContext';
import { ClerkProvider } from '@clerk/nextjs';
import './styles/globals.css';
import { ThemeProvider } from '@/lib/theme-provider';
import { DeviceProvider } from './context/DevicesContext';
import { jaJP } from '@clerk/localizations';

const inter: NextFont = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'スマートホーム',
    description: 'コントロールパネル',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider localization={jaJP}>
            <html lang="en" suppressHydrationWarning>
                <Suspense>
                    <body className={inter.className}>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <DeviceProvider>
                                <ToasterContext />
                                {children}
                            </DeviceProvider>
                        </ThemeProvider>
                    </body>
                </Suspense>
            </html>
        </ClerkProvider>
    );
}
