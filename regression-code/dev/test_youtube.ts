import assert from "node:assert/strict";

import {
  clampYoutubeOffsetMs,
  MAX_YOUTUBE_OFFSET_MS,
  MIN_YOUTUBE_OFFSET_MS,
} from "../src/core/score/score_limits";
import {
  canResumeYoutubeWithoutSeek,
  isYoutubeBeforeVideoStart,
  scoreSecondsToRawYoutubeSeconds,
  scoreSecondsToYoutubeSeconds,
  secondsUntilYoutubeStart,
  shouldResyncYoutubeDrift,
} from "../src/app/youtube/youtube_sync";
import { parseYoutubeVideoId } from "../src/app/youtube/youtube_url";

function runYoutubeTests(): void {
  assert.equal(parseYoutubeVideoId("abcDEF_123-"), "abcDEF_123-");
  assert.equal(parseYoutubeVideoId("https://www.youtube.com/watch?v=abcDEF_123-"), "abcDEF_123-");
  assert.equal(parseYoutubeVideoId("https://youtu.be/abcDEF_123-?si=test"), "abcDEF_123-");
  assert.equal(parseYoutubeVideoId("https://www.youtube.com/embed/abcDEF_123-"), "abcDEF_123-");
  assert.equal(parseYoutubeVideoId("https://www.youtube.com/shorts/abcDEF_123-"), "abcDEF_123-");
  assert.equal(parseYoutubeVideoId("not a youtube url"), null);
  assert.equal(parseYoutubeVideoId("https://example.com/watch?v=abcDEF_123-"), null);

  assert.equal(scoreSecondsToYoutubeSeconds(10, -12500), 22.5);
  assert.equal(scoreSecondsToYoutubeSeconds(0.1, 300), 0);
  assert.equal(scoreSecondsToYoutubeSeconds(1, 300), 0.7);
  assert.ok(Math.abs(scoreSecondsToRawYoutubeSeconds(0.1, 300) - -0.2) < 0.000001);
  assert.equal(isYoutubeBeforeVideoStart(0.1, 300), true);
  assert.equal(isYoutubeBeforeVideoStart(0.3, 300), false);
  assert.ok(Math.abs(secondsUntilYoutubeStart(0.1, 300) - 0.2) < 0.000001);
  assert.equal(secondsUntilYoutubeStart(0.3, 300), 0);

  assert.equal(shouldResyncYoutubeDrift(10, 10.2, 0), false);
  assert.equal(shouldResyncYoutubeDrift(10, 10.251, 0), true);
  assert.equal(shouldResyncYoutubeDrift(10, 22.5, -12500), false);
  assert.equal(shouldResyncYoutubeDrift(0.1, 0.25, 300), false);

  // 일시정지 재개만 50ms 이내 위치를 유지하고, 최초 재생·위치 불일치·영상 시작 전에는 seek 경로를 유지한다.
  assert.equal(canResumeYoutubeWithoutSeek(false, 10, 10, 0), false);
  assert.equal(canResumeYoutubeWithoutSeek(true, 10, 10, 0), true);
  assert.equal(canResumeYoutubeWithoutSeek(true, 10, 10.02, 0), true);
  assert.equal(canResumeYoutubeWithoutSeek(true, 0, 0.05, 0), true);
  assert.equal(canResumeYoutubeWithoutSeek(true, 10, 10.051, 0), false);
  assert.equal(canResumeYoutubeWithoutSeek(true, 10, 22.5, -12500), true);
  assert.equal(canResumeYoutubeWithoutSeek(true, 1, 0.7, 300), true);
  assert.equal(canResumeYoutubeWithoutSeek(true, 0.1, 0, 300), false);
  assert.equal(canResumeYoutubeWithoutSeek(true, NaN, 10, 0), false);
  assert.equal(canResumeYoutubeWithoutSeek(true, 10, Infinity, 0), false);
  assert.equal(canResumeYoutubeWithoutSeek(true, 10, 10, NaN), false);

  assert.equal(clampYoutubeOffsetMs(MIN_YOUTUBE_OFFSET_MS - 1), MIN_YOUTUBE_OFFSET_MS);
  assert.equal(clampYoutubeOffsetMs(MAX_YOUTUBE_OFFSET_MS + 1), MAX_YOUTUBE_OFFSET_MS);
  assert.equal(clampYoutubeOffsetMs(123.9), 123);
}

runYoutubeTests();
console.log("test_youtube passed");
