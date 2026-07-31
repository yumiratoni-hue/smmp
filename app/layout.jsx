import "./globals.css";

export const metadata = {
  title: "SMM Panel Global",
  description: "Best Social Media Marketing Services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
