// 구역별 BGM과 공용 SFX 경로. 컴포넌트/훅에서 문자열 경로를 직접 하드코딩하지 않기 위해
// 이 파일을 통해서만 참조한다. 실제 음원이 준비되기 전까지는 public/content/audio/의
// 0바이트 placeholder를 가리키며, SoundProvider는 재생 실패를 조용히 무시한다(Phase 2 관행과 동일).
// 경로는 항상 슬래시(/)로 시작한다 — 라우트 깊이와 무관하게 사이트 루트 기준으로 고정하기 위함
// (public/ 밑의 파일은 리소스 루트에 그대로 서빙된다).

export type DistrictBgmKey = "town" | 1 | 2 | 3;

export const districtBgmSrc: Record<DistrictBgmKey, string> = {
  town: "/content/audio/bgm-town.mp3",
  1: "/content/audio/bgm-district-1.mp3",
  2: "/content/audio/bgm-district-2.mp3",
  3: "/content/audio/bgm-district-3.mp3",
};

export const sfxSrc = {
  coinGain: "/content/audio/sfx-coin-gain.mp3",
  purchase: "/content/audio/sfx-purchase.mp3",
  treeGrow: "/content/audio/sfx-tree-grow.mp3",
};
