import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Workout Coach",
  description:
    "Adaptive weekly training plans, energy-matched playlists, AI form feedback, and audio briefings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
