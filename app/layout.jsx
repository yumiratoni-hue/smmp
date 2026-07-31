import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SMM Panel - Social Media Marketing Services",
  description: "Boost your social media presence with fast, reliable, and cheap SMM services.",
  keywords: ["smm panel", "instagram followers", "tiktok views", "social media marketing"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-900 text-slate-100 min-h-screen antialiased`}>
        {/* Main Content Wrapper */}
        <main className="w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
