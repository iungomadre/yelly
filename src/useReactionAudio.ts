import { useEffect, useRef } from "preact/hooks";

type UseReactionAudioOptions = {
  volume?: number;
  loop?: boolean;
};

export function useReactionAudio(
  shouldPlay: boolean,
  src: string,
  options: UseReactionAudioOptions = {}
) {
  const { volume = 0.5, loop = true } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = loop;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src, volume, loop]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (shouldPlay) {
      audio.play().catch((e) => console.log("Audio blocked until interaction", e));
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [shouldPlay]);
}
