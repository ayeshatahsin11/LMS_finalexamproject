import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import ScrollToTop from "@/components/ScrollToTop";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Pathway — Learning Management System",
  description: "Learn at your own pace. A MERN-stack LMS built for real courses, real progress.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-73px)]">{children}</main>
          <ConditionalFooter />
          <ScrollToTop />
        </AuthProvider>
      </body>
    </html>
  );
}

