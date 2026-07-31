"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { MuseumEra } from "@/data/museumContent";
import { useGsapContext } from "@/hooks/useGsapContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface MuseumTimelineStripProps {
  eras: MuseumEra[];
  activeEraIndex: number;
}

// 화폐의 역사 타임라인 — 가로 스크롤에 맞춰 각 시대 카드가 GSAP ScrollTrigger로 페이드/스케일인된다.
export function MuseumTimelineStrip({ eras, activeEraIndex }: MuseumTimelineStripProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useGsapContext<HTMLDivElement>(
    (_context, reducedMotion) => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-era-card]");
      cards.forEach((card) => {
        if (reducedMotion) {
          gsap.set(card, { opacity: 1, scale: 1 });
          return;
        }
        gsap.set(card, { opacity: 0.35, scale: 0.9 });
        gsap.to(card, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            scroller: containerRef.current,
            horizontal: true,
            start: "left 75%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    [eras.length],
    containerRef,
  );

  useEffect(() => {
    const activeEra = eras[activeEraIndex];
    if (!activeEra) return;
    cardRefs.current[activeEra.id]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeEraIndex, eras]);

  return (
    <div ref={containerRef} className="flex gap-4 overflow-x-auto rounded-card bg-surface-muted p-4 text-ink">
      {eras.map((era, index) => (
        <div
          key={era.id}
          data-era-card
          ref={(el) => {
            cardRefs.current[era.id] = el;
          }}
          className={`flex min-w-28 shrink-0 flex-col items-center gap-1 rounded-control border-2 p-3 transition-colors ${
            index === activeEraIndex
              ? "border-primary bg-primary-light"
              : "border-transparent bg-surface"
          }`}
        >
          <span aria-hidden className="text-heading">
            {era.currencyEmoji}
          </span>
          <span className="text-caption text-muted">{era.eraLabelKo}</span>
        </div>
      ))}
    </div>
  );
}
