import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from "react";

import "../styles/LoopVideo.css";

type Subtitle = {
  lang: string;
  label: string;
  src: string;
};

type LoopVideoProps = {
  src: string;
  poster?: string;
  label: string;
  // "loop": muted, autoplays when visible, loops (ambient clips)
  // "story": sound on, plays once, no auto-resume (documentaries)
  variant?: "loop" | "story";
  // "cover" fills the frame and crops, "contain" shows the whole video
  fit?: "cover" | "contain";
  // Reports the real width / height of the video once it is known
  onRatio?: (ratio: number) => void;
  subtitles?: Subtitle[];
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
  volume: (
    <path d="M3 9v6h4l5 4V5L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" />
  ),
  muted: (
    <path d="M3 9v6h4l5 4V5L7 9H3zm13.6 3 2.4-2.4-1.4-1.4-2.4 2.4-2.4-2.4-1.4 1.4 2.4 2.4-2.4 2.4 1.4 1.4 2.4-2.4 2.4 2.4 1.4-1.4z" />
  ),
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
  poster,
  label,
  variant = "loop",
  fit = "cover",
  onRatio,
  subtitles = [],
}: LoopVideoProps) {
  const loop = variant === "loop";

  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const pausedByUser = useRef(false);
  const hasStarted = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [ended, setEnded] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [muted, setMuted] = useState(loop);
  const [volume, setVolume] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // -1 means subtitles off, otherwise the index in the subtitles list
  const [caption, setCaption] = useState(subtitles.length ? 0 : -1);

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

        const motionBlocked = loop && reduceMotion.matches;
        const mayPlay = loop
          ? !pausedByUser.current
          : !hasStarted.current && !pausedByUser.current;

        if (!motionBlocked && mayPlay) {
          void video.play().catch(() => setBlocked(true));
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [loop]);

  // Keep the element in sync with the sound state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    video.volume = volume;
  }, [muted, volume]);

  // Show the chosen subtitle track only
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    Array.from(video.textTracks).forEach((track, index) => {
      track.mode = index === caption ? "showing" : "disabled";
    });
  }, [caption, subtitles.length]);

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

  const toggleMute = () => {
    if (muted && volume === 0) setVolume(0.7);
    setMuted((value) => !value);
  };

  const changeVolume = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    setVolume(next);
    setMuted(next === 0);
  };

  const cycleCaption = () => {
    setCaption((current) =>
      current >= subtitles.length - 1 ? -1 : current + 1,
    );
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

  const seek = (event: MouseEvent<HTMLSpanElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / rect.width),
    );
    video.currentTime = ratio * video.duration;
    updateProgress();
  };

  const showBigPlay =
    blocked ||
    ended ||
    userPaused ||
    (!started && loop) ||
    (started && !loop && !isPlaying);

  const captionLabel = caption >= 0 ? subtitles[caption]?.label : "Off";

  return (
    <div
      className="loop-video"
      ref={boxRef}
      data-variant={variant}
      data-fit={fit}
      data-paused={!isPlaying}
      data-fullscreen={isFullscreen}
    >
      <video
        ref={videoRef}
        className="loop-video__media"
        src={src}
        poster={poster}
        muted={loop}
        loop={loop}
        playsInline
        preload={loop ? "metadata" : "auto"}
        aria-label={label}
        onClick={togglePlay}
        onLoadedMetadata={reportRatio}
        onPlay={() => {
          hasStarted.current = true;
          setIsPlaying(true);
          setStarted(true);
          setEnded(false);
          setBlocked(false);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setEnded(true)}
        onTimeUpdate={updateProgress}
      >
        {subtitles.map((track) => (
          <track
            key={track.lang}
            kind="subtitles"
            src={track.src}
            srcLang={track.lang}
            label={track.label}
          />
        ))}
      </video>

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

        <div className="loop-video__sound">
          <button
            type="button"
            className="loop-video__btn"
            onClick={toggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"}
          >
            <Icon name={muted ? "muted" : "volume"} />
          </button>

          <input
            className="loop-video__volume"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={changeVolume}
            aria-label="Volume"
          />
        </div>

        <div className="loop-video__end">
          {subtitles.length > 0 && (
            <button
              type="button"
              className="loop-video__btn loop-video__cc"
              data-on={caption >= 0}
              onClick={cycleCaption}
              aria-label={`Subtitles: ${captionLabel}. Tap to change`}
            >
              {caption >= 0 ? subtitles[caption].lang.toUpperCase() : "CC"}
            </button>
          )}

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

      <span className="loop-video__track" onClick={seek} aria-hidden="true">
        <span className="loop-video__progress" ref={progressRef} />
      </span>
    </div>
  );
}
