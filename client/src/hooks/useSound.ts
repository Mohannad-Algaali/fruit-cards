// src/hooks/useSound.ts
import { useRef } from "react";

export function useSound(src: string, volume = 1) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioRef.current) {
    audioRef.current = new Audio(src);
    audioRef.current.volume = volume;
  }

  const play = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0; // restart if already playing
    audioRef.current.play();
  };

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  return { play, stop, audio: audioRef.current };
}
