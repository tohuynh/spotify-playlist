import { XIcon } from "@heroicons/react/outline";
import { Dispatch } from "react";
import { PlaylistTrack } from "../../server/router/output-types";
import { UserAction, UserActionType } from "./new-playlist-state";

type TrackChipsProps = {
  tracks: PlaylistTrack[];
  dispatchUserAction: Dispatch<UserAction>;
};

export default function TrackChips({
  tracks,
  dispatchUserAction,
}: TrackChipsProps) {
  return (
    <div className="flex flex-wrap gap-4 md:justify-center">
      {tracks.map((track, i) => (
        <button
          key={track.id}
          className="flex w-full items-center justify-between gap-x-4 rounded-md bg-white px-4 py-2 md:w-auto md:max-w-[16rem]"
          onClick={() =>
            dispatchUserAction({
              type: UserActionType.UNSELECT_TRACK,
              payload: track,
            })
          }
        >
          <span className="basis-11/12 truncate text-sm lg:text-base">
            <span className="mr-1 font-light">{`${i + 1}. `}</span>
            <span>{track.name}</span>
          </span>
          <XIcon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
