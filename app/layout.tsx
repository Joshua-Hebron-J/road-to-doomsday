import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#050508",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "The Road to Doomsday | Cinematic Marvel Fan Archive",
  description:
    "An unofficial cinematic roadmap chronicling the pivotal Marvel chapters, multiverse incursions, and sovereign ascent leading to Avengers: Doomsday.",
  keywords: [
    "Marvel",
    "Avengers Doomsday",
    "Doctor Doom",
    "MCU Timeline",
    "Multiverse Saga",
    "Secret Wars",
    "Fan Project",
  ],
  authors: [{ name: "The Road to Doomsday Project" }],
  openGraph: {
    title: "The Road to Doomsday | Cinematic Marvel Fan Archive",
    description:
      "Every story led here. Explore the cinematic roadmap leading to Avengers: Doomsday.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-emerald-900/60 selection:text-emerald-100">
        {children}
      </body>
    </html>
  );
}
