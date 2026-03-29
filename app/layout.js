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

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Carmel Senate",
  description: "Official Carmel High School Student Senate Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          title="timeline-styles"
          rel="stylesheet"
          href="https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}