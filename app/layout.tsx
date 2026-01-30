// app/layout.tsx
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

export const metadata = {
  title: "EcoAir",
  description: "Energy-Efficient Smart Air Quality Monitoring",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body
        className="
          min-h-screen
          bg-neutral-950
          text-neutral-200
          antialiased
          font-[var(--font-body)]
        "
      >
        {/* Page entrance animation */}
        <div className="animate-dashboard-in">
          {children}
        </div>
      </body>
    </html>
  );
}
