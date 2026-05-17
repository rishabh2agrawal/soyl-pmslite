import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOYL Lite PMS",
  description: "Smart property management for Indian hotels",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
