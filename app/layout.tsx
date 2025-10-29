import type React from "react";
import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AppProvider } from "@/lib/providers";
import "./globals.css";

/* Updated to use Roboto font family */
const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    variable: "--font-roboto",
});

const robotoMono = Roboto_Mono({
    weight: ["400", "500"],
    subsets: ["latin"],
    variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
    title: "Voter Management System",
    description: "Modern voter management application",
    generator: "v0.app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${roboto.variable} ${robotoMono.variable} font-sans antialiased`}>
                <AppProvider>{children}</AppProvider>
                <Analytics />
            </body>
        </html>
    );
}
