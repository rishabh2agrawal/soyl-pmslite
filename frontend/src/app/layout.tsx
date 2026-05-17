import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "soylPMS — Property Management System",
  description:
    "Modern hotel PMS for Indian hospitality. Check-ins in 30 seconds.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
