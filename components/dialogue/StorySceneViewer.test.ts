import { describe, expect, it } from "vitest";

import { storyViewerReducer, type StoryViewerState } from "./StorySceneViewer";

const TOTAL_SCENES = 4;

function reduce(state: StoryViewerState, action: Parameters<typeof storyViewerReducer>[1]) {
  return storyViewerReducer(state, action, TOTAL_SCENES);
}

describe("storyViewerReducer", () => {
  it("next는 마지막 인덱스(totalScenes - 1)에서 더 진행하지 않고 clamp된다", () => {
    const lastIndexState: StoryViewerState = { index: TOTAL_SCENES - 1, skipConfirmOpen: false };

    const result = reduce(lastIndexState, { type: "next" });

    expect(result.index).toBe(TOTAL_SCENES - 1);
  });

  it("prev는 0에서 더 내려가지 않고 clamp된다", () => {
    const firstIndexState: StoryViewerState = { index: 0, skipConfirmOpen: false };

    const result = reduce(firstIndexState, { type: "prev" });

    expect(result.index).toBe(0);
  });

  it("requestSkip은 skipConfirmOpen을 true로 만든다", () => {
    const initialState: StoryViewerState = { index: 1, skipConfirmOpen: false };

    const result = reduce(initialState, { type: "requestSkip" });

    expect(result.skipConfirmOpen).toBe(true);
  });

  it("cancelSkip은 skipConfirmOpen을 다시 false로 만든다", () => {
    const openState: StoryViewerState = { index: 1, skipConfirmOpen: true };

    const result = reduce(openState, { type: "cancelSkip" });

    expect(result.skipConfirmOpen).toBe(false);
  });
});
