"use client";

import { motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

// Pixi 파티클(물가 요정)과 분리해, 가격 숫자 자체의 카운트업 연출만 담당하는 순수 DOM 컴포넌트
// (docs/implementation.md 8-3 — "가격 숫자는 Motion의 숫자 카운트업 애니메이션으로 처리").
export interface PriceCounterProps {
  price: number;
}

export function PriceCounter({ price }: PriceCounterProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.p
      key={price}
      initial={{ scale: reducedMotion ? 1 : 1.4, color: "#dc2626" }}
      animate={{ scale: 1, color: "#1f2937" }}
      transition={{ duration: reducedMotion ? 0 : 0.4 }}
      className="text-heading font-bold"
    >
      사탕 1개 · {price}원
    </motion.p>
  );
}
