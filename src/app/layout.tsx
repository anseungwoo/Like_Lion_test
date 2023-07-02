"use client";
import HeaderCustom from "@/components/Header/HeaderCompound";
import "./globals.css";
import { Inter } from "next/font/google";
import FooterCompound from "@/components/Footer/FooterCompound";
import { useState, createContext } from "react";

const inter = Inter({ subsets: ["latin"] });
export const AppContext = createContext<any>(null);
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [account, setAccount] = useState<string>("");
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppContext.Provider value={{ account, setAccount }}>
          <HeaderCustom />
          {children}
          <FooterCompound />
        </AppContext.Provider>
      </body>
    </html>
  );
}
