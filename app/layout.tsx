import type { Metadata } from "next";
import { Jua, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { HydrationGuard } from "@/components/providers/HydrationGuard";
import { SoundProvider } from "@/components/providers/SoundProvider";
import { AppShell } from "@/components/layout/AppShell";

// "머니타운" 워드마크 전용 라운드형 한글 폰트(components/hud/GameLogo.tsx에서만 사용) —
// 그 외 헤딩/본문은 전부 Noto Sans KR로 통일한다(DESIGN.md 참고 디자인 개편, app/globals.css 참고).
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
          <AppShell>
            <HydrationGuard>{children}</HydrationGuard>
          </AppShell>
        </SoundProvider>
      </body>
    </html>
  );
}
