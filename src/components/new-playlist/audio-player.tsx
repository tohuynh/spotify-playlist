import throttle from "lodash.throttle";
import { useMemo, useRef, useState } from "react";

const playIcon = (
  <svg
    aria-hidden
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 512 512"
  >
    <title>Preview</title>
    <path d="M133 440a35.37 35.37 0 01-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0135.77.45l247.85 148.36a36 36 0 010 61l-247.89 148.4A35.5 35.5 0 01133 440z" />
  </svg>
);

const stopIcon = (
  <svg
    aria-hidden
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 512 512"
  >
    <title>Stop</title>
    <path d="M392 432H120a40 40 0 01-40-40V120a40 40 0 0140-40h272a40 40 0 0140 40v272a40 40 0 01-40 40z" />
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
      <div>
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
    <div className="flex flex-col items-end justify-center text-zinc-700">
      <audio
        ref={audioPlayerRef}
        src={url}
        onEnded={onEnded}
        onTimeUpdate={() =>
          handleUpdateCurrentTime(audioPlayerRef.current?.currentTime || 0)
        }
      />
      <button
        className="flex w-10 items-center justify-center"
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
