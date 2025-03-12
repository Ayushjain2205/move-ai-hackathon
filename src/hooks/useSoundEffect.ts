"use client";

import { useState, useEffect, useCallback } from "react";

export function useSoundEffect(soundUrl: string): [boolean, () => void] {
  const [isMuted, setIsMuted] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioElement = new Audio(soundUrl);
    setAudio(audioElement);
    return () => {
      audioElement.pause();
      audioElement.src = "";
    };
  }, [soundUrl]);

  const toggleSound = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      if (audio) {
        audio.muted = newMuted;
      }
      return newMuted;
    });
  }, [audio]);

  return [isMuted, toggleSound];
}
