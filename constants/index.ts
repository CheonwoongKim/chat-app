export const LOADING_MESSAGES = [
  '답변을 준비하고 있습니다...',
  '잠시만 기다려 주세요...',
  '최적의 답변을 찾고 있습니다...',
  '곧 답변을 드리겠습니다...',
] as const;

export const TIMING = {
  LOADING_MESSAGE_INTERVAL: 2000,
  SIMULATED_RESPONSE_DELAY: 1000,
} as const;
