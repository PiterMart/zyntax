import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "../components/NavigationWrapper";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Zyntax | Digital Alchemist | Official Portfolio",
  description: "Zyntax: Multidisciplinary Artist, 3D Generalist & Audio Engineer in Buenos Aires. High-fidelity Gothic aesthetics through 3D design, sound, and code.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NavigationWrapper>
          <Navbar />
          {children}
          <Footer />
        </NavigationWrapper>
      </body>
    </html>
  );
}
