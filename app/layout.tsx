import type { Metadata } from "next";
import { Raleway, Inter, DM_Sans } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//     variable: "--font-geist-sans",
//     subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//     variable: "--font-geist-mono",
//     subsets: ["latin"],
// });

const raleway = Raleway({
    variable: "--font-title",
    subsets: ["latin"]
});

const inter = Inter({
    variable: "--font-medium",
    subsets: ["latin"]
});

const dm_sans = DM_Sans({
    variable: "--font-main",
    subsets: ["latin"]
});

export const metadata: Metadata = {
    title: "Project Wealthwise Test",
    description: "Test description",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={` h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
