import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Business Manager | AI Business Operating System",
  description:
    "Business Manager by MAGIC QUANT TRADING Corp. The AI-powered operating system for South African businesses. CRM, Invoicing, SARS eFiling assistance, and 7 autonomous agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased font-sans text-slate-900 bg-slate-50 selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
