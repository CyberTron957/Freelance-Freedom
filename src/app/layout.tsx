import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreelanceFreedom: Decentralized Freelance Marketplace",
  description: "Empowering Work with Blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </ClientProvider>
      </body>
    </html>
  );
}
