"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { commonContent } from "@/data/commonContent";

const TABS = [
  { key: "home", href: "/town", icon: "🏠", label: commonContent.bottomNav.home },
  { key: "questLog", href: "/quest-log", icon: "📋", label: commonContent.bottomNav.questLog },
  { key: "shop", href: "/shop", icon: "🛍️", label: commonContent.bottomNav.shop },
  { key: "glossary", href: "/glossary", icon: "📖", label: commonContent.bottomNav.glossary },
  { key: "almanac", href: "/almanac", icon: "🗂️", label: commonContent.bottomNav.almanac },
  { key: "parent", href: "/parent", icon: "👪", label: commonContent.bottomNav.parent },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function isActive(pathname: string, key: TabKey, href: string): boolean {
  if (key === "home") {
    return pathname === "/town" || pathname.startsWith("/building/") || pathname === "/money-tree";
  }
  if (key === "almanac") {
    return pathname === "/almanac" || pathname.startsWith("/almanac/");
  }
  return pathname === href;
}

// 마을/퀘스트/상점/사전/도감/보호자 6탭 — 화면 어디서든 다른 메뉴로 바로 이동할 수 있게 한다.
// /credits는 탭에 넣지 않고 /almanac 허브 페이지 하단 보조 버튼으로 안내한다.
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-10 flex items-stretch justify-around border-t border-border bg-surface">
      {TABS.map(({ key, href, icon, label }) => {
        const active = isActive(pathname, key, href);
        return (
          <Link
            key={key}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-touch min-w-touch flex-1 flex-col items-center justify-center gap-0.5 py-2 text-caption ${
              active ? "text-primary" : "text-muted"
            }`}
          >
            <span aria-hidden className="text-body">
              {icon}
            </span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
