import { XIcon } from "@heroicons/react/outline";
import { TrackSeed } from "../server/router/output-types";

export default function TrackChips({
  tracks,
  handleUnselectTrack,
}: {
  tracks: TrackSeed[];
  handleUnselectTrack: (track: TrackSeed) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {tracks.map((track, i) => (
        <button
          key={track.id}
          className="shadow-md rounded-md flex justify-between items-center ring-1 ring-slate-200 hover:bg-slate-100 max-w-[16rem] px-4 py-1"
          onClick={() => handleUnselectTrack(track)}
        >
          <span className="basis-11/12 truncate">
            <span className="font-light mr-1">{`${i + 1}. `}</span>
            <span>{track.name}</span>
          </span>
          <XIcon className="h-4 w-4 ml-4" />
        </button>
      ))}
    </div>
  );
}
