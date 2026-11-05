import { useEffect, useRef, useState } from "react";

import "../styles/LoopVideo.css";

type LoopVideoProps = {
  src: string;
  poster?: string;
  label: string;
};

export default function LoopVideo({ src, poster, label }: LoopVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedByUser = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!reduceMotion.matches && !pausedByUser.current) {
            void video.play().catch(() => {});
          }
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      pausedByUser.current = false;
      void video.play().catch(() => {});
    } else {
      pausedByUser.current = true;
      video.pause();
    }
  };

  return (
    <div className="loop-video">
      <video
        ref={videoRef}
        className="loop-video__media"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <button
        type="button"
        className="loop-video__toggle"
        onClick={toggle}
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}
