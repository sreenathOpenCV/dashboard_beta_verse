import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/StoreProvider";
import AuthProvider from "@/context/AuthProvider";
import PageWrapper from "@/component/pageWrapper.tsx/pageWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Opencv Lead Management",
  description: "A product by Opencv University",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReduxProvider>
        <AuthProvider>
          <body className={inter.className}>
            <PageWrapper children={children} />
          </body>
        </ AuthProvider>
      </ReduxProvider>
    </html>
  );
}
