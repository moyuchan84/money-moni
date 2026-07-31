"use client";

import { useEffect } from "react";

import { districtBgmSrc, type DistrictBgmKey } from "@/data/soundContent";
import { useSound } from "@/components/providers/SoundProvider";

// 화면은 "이 화면은 이 트랙"만 선언하면 된다 — 크로스페이드/중복재생 로직은
// SoundProvider(playBgm)에 캡슐화되어 있다. 이후 구역 개발자가 참고할 레퍼런스 패턴.
export function useDistrictBgm(key: DistrictBgmKey) {
  const { playBgm } = useSound();

  useEffect(() => {
    playBgm(districtBgmSrc[key]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
