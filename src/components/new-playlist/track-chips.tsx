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
    <div className="flex flex-wrap md:justify-center gap-4">
      {tracks.map((track, i) => (
        <button
          key={track.id}
          className="bg-white rounded-md flex justify-between gap-x-4 items-center w-full md:w-auto md:max-w-[16rem] px-4 py-2"
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
          <XIcon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
