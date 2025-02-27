"use client";

import { useState, useEffect, useCallback } from "react";

export function useSoundEffect(soundUrl: string): [boolean, () => void] {
  const [isMuted, setIsMuted] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setAudio(new Audio(soundUrl));
  }, [soundUrl]);

  const playSound = useCallback(() => {
    if (audio && !isMuted) {
      audio.currentTime = 0;
      audio.play().catch(console.error);
    }
  }, [audio, isMuted]);

  const toggleSound = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return [isMuted, toggleSound];
}
