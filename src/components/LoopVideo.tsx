import { useEffect, useRef, useState } from "react";

import "../styles/LoopVideo.css";

type LoopVideoProps = {
  src: string;
  label: string;
  // "cover" fills the frame and crops, "contain" shows the whole video
  fit?: "cover" | "contain";
  // Reports the real width / height of the video once it is known
  onRatio?: (ratio: number) => void;
};

type FsElement = HTMLElement & {
  webkitRequestFullscreen?: () => void;
};

type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => void;
};

type FsVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
};

const icons = {
  play: <path d="M8 5v14l11-7z" />,
  pause: <path d="M6 5h4v14H6zM14 5h4v14h-4z" />,
  expand: (
    <path d="M4 4h6v2H6v4H4zm10 0h6v6h-2V6h-4zM4 14h2v4h4v2H4zm14 0h2v6h-6v-2h4z" />
  ),
  collapse: (
    <path d="M8 4h2v6H4V8h4zm6 0h2v4h4v2h-6zM4 14h6v6H8v-4H4zm10 0h6v2h-4v4h-2z" />
  ),
};

function Icon({ name }: { name: keyof typeof icons }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

export default function LoopVideo({
  src,
  label,
  fit = "cover",
  onRatio,
}: LoopVideoProps) {
  // The #t fragment makes browsers (iPhone Safari included) show the first
  // frame of the video itself, so no separate poster image is needed.
  const firstFrameSrc = `${src}#t=0.001`;

  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const pausedByUser = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Autoplay when visible, pause when off screen
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause();
          return;
        }

        if (!reduceMotion.matches && !pausedByUser.current) {
          void video.play().catch(() => setBlocked(true));
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Track fullscreen changes, including the Esc key
  useEffect(() => {
    const doc = document as FsDocument;
    const onChange = () => {
      const current = doc.fullscreenElement ?? doc.webkitFullscreenElement;
      setIsFullscreen(current === boxRef.current);
    };

    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      pausedByUser.current = false;
      setUserPaused(false);
      setBlocked(false);
      void video.play().catch(() => setBlocked(true));
    } else {
      pausedByUser.current = true;
      setUserPaused(true);
      video.pause();
    }
  };

  const toggleFullscreen = () => {
    const doc = document as FsDocument;
    const box = boxRef.current as FsElement | null;
    const video = videoRef.current as FsVideo | null;

    if (doc.fullscreenElement ?? doc.webkitFullscreenElement) {
      if (doc.exitFullscreen) void doc.exitFullscreen();
      else doc.webkitExitFullscreen?.();
    } else if (box?.requestFullscreen) {
      void box.requestFullscreen().catch(() => {});
    } else if (box?.webkitRequestFullscreen) {
      box.webkitRequestFullscreen();
    } else {
      // iPhone Safari only allows fullscreen on the video element itself
      video?.webkitEnterFullscreen?.();
    }
  };

  const updateProgress = () => {
    const video = videoRef.current;
    const bar = progressRef.current;
    if (!video || !bar || !video.duration) return;
    bar.style.transform = `scaleX(${video.currentTime / video.duration})`;
  };

  const reportRatio = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;
    onRatio?.(video.videoWidth / video.videoHeight);
  };

  const showBigPlay = blocked || userPaused || !started;

  return (
    <div
      className="loop-video"
      ref={boxRef}
      data-fit={fit}
      data-paused={!isPlaying}
      data-fullscreen={isFullscreen}
    >
      <video
        ref={videoRef}
        className="loop-video__media"
        src={firstFrameSrc}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onClick={togglePlay}
        onLoadedMetadata={reportRatio}
        onPlay={() => {
          setIsPlaying(true);
          setStarted(true);
          setBlocked(false);
        }}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={updateProgress}
      />

      {showBigPlay && (
        <button
          type="button"
          className="loop-video__big"
          onClick={togglePlay}
          aria-label="Play video"
        >
          <Icon name="play" />
        </button>
      )}

      <div className="loop-video__bar">
        <button
          type="button"
          className="loop-video__btn"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          <Icon name={isPlaying ? "pause" : "play"} />
        </button>

        <div className="loop-video__end">
          <button
            type="button"
            className="loop-video__btn"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
          >
            <Icon name={isFullscreen ? "collapse" : "expand"} />
          </button>
        </div>
      </div>

      <span className="loop-video__track" aria-hidden="true">
        <span className="loop-video__progress" ref={progressRef} />
      </span>
    </div>
  );
}
