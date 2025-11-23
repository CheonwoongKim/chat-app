import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KB 업무매뉴얼 챗봇",
  description: "KB 카드 업무매뉴얼 챗봇",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
