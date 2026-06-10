import "@/app/globals.css";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("/");

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-data"
});

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable}`}>{children}</body>
    </html>
  );
}
