import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./Components/Sidebar";
import { AuthProvider } from '../context/AuthContext';
import { ReportProvider } from "@/context/ReportContext";
import Header from "./Components/Header";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adovate",
  description: "Ad Data Analysis Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <ReportProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <div className="h-screen flex items-stretch">
              <Sidebar />
              <Suspense fallback={<div>Loading...</div>}>
                <div className="grid grid-rows-[60px_1fr] h-full">
                  <Header />
                  {children}
                </div>
              </Suspense>
            </div>
          </body>
        </html>
      </ReportProvider>
    </AuthProvider>
    
  );
}
