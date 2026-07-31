import type { Metadata } from "next";
import { Jua, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { HydrationGuard } from "@/components/providers/HydrationGuard";
import { SoundProvider } from "@/components/providers/SoundProvider";

// 헤드라인용 라운드형 한글 폰트 — docs/implementation.md 4장
const jua = Jua({
  weight: "400",
  variable: "--font-jua",
  display: "swap",
});

// 본문용 가독성 폰트
const notoSansKr = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "머니모니",
  description: "초등학교 1~3학년을 위한 자본주의 생존 웹앱, 머니타운",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${jua.variable} ${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SoundProvider>
          <HydrationGuard>{children}</HydrationGuard>
        </SoundProvider>
      </body>
    </html>
  );
}
