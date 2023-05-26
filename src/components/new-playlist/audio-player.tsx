import throttle from "lodash.throttle";
import { useMemo, useRef, useState } from "react";

const playIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
    />
    <title>Play</title>
  </svg>
);

const stopIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
    />
    <title>Stop</title>
  </svg>
);

export default function AudioPlayer({ url }: { url: string | null }) {
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const handleUpdateCurrentTime = useMemo(
    () =>
      throttle(
        (time: number) => {
          setCurrentTime(
            (time / (audioPlayerRef.current?.duration || 30)) * 100
          );
        },
        100,
        { trailing: false }
      ),
    []
  );

  const onEnded = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const onTogglePlay = () => {
    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
      } else {
        audioPlayerRef.current.play();
      }
    }
    setIsPlaying((prev) => !prev);
  };

  if (url === null) {
    return (
      <div className="text-foreground/60">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="ml-3 mr-2 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <title>No preview</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            clipRule="evenodd"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end justify-center">
      <audio
        ref={audioPlayerRef}
        src={url}
        onEnded={onEnded}
        onTimeUpdate={() =>
          handleUpdateCurrentTime(audioPlayerRef.current?.currentTime || 0)
        }
      />
      <button
        className="flex w-10 items-center justify-center p-1 text-foreground/60"
        aria-label={`${isPlaying ? "Pause" : "Play"} track`}
        onClick={onTogglePlay}
      >
        {isPlaying ? stopIcon : playIcon}
      </button>
      {isPlaying && (
        <>
          <label className="sr-only" htmlFor="current-time">
            Current time
          </label>
          <meter
            id="current-time"
            className="h-2 w-10"
            min={0}
            max={100}
            value={currentTime}
          />
        </>
      )}
    </div>
  );
}
