const soundFiles = {
  move:      '/sounds/move.mp3',
  capture:   '/sounds/capture.mp3',
  castle:    '/sounds/castle.mp3',
  promote:   '/sounds/promote.mp3',
  check:     '/sounds/check.mp3',
  checkmate: '/sounds/checkmate.mp3',
  illegal:   '/sounds/illegal.mp3'
};

const cache: Partial<Record<keyof typeof soundFiles, HTMLAudioElement>> = {};

export function playSound(type: keyof typeof soundFiles) {
  if (typeof window === 'undefined') return;
  if (!cache[type]) cache[type] = new Audio(soundFiles[type]);
  const audio = cache[type]!;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}