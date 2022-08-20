import { XIcon } from "@heroicons/react/outline";
import { Dispatch } from "react";
import { TrackSeed } from "../../server/router/output-types";
import { UserAction, UserActionType } from "./new-playlist-state";

type TrackChipsProps = {
  tracks: TrackSeed[];
  dispatchUserAction: Dispatch<UserAction>;
};

export default function TrackChips({
  tracks,
  dispatchUserAction,
}: TrackChipsProps) {
  return (
    <div className="flex flex-wrap lg:justify-center gap-4 py-4 border-b-2">
      {tracks.map((track, i) => (
        <button
          key={track.id}
          className="shadow-md rounded-md flex justify-between items-center ring-1 ring-slate-200 hover:bg-slate-100 w-full md:max-w-[16rem] px-4 py-1"
          onClick={() =>
            dispatchUserAction({
              type: UserActionType.UNSELECT_TRACK,
              payload: track,
            })
          }
        >
          <span className="basis-11/12 truncate text-sm lg:text-base">
            <span className="font-light mr-1">{`${i + 1}. `}</span>
            <span>{track.name}</span>
          </span>
          <XIcon className="h-4 w-4 ml-4" />
        </button>
      ))}
    </div>
  );
}
