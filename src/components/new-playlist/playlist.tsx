import { Dispatch } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AudioPlayer from "./audio-player";
import { convertDurationToHMS } from "../../utils/convert-duration-to-hms";
import { PlaylistTrack } from "../../server/router/output-types";
import { TrashIcon } from "@heroicons/react/outline";
import { UserAction, UserActionType } from "./new-playlist-state";

const dragHandle = (
  <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
    <path
      fillRule="evenodd"
      d="M10 13a1 1 0 100-2 1 1 0 000 2zm-4 0a1 1 0 100-2 1 1 0 000 2zm1-5a1 1 0 11-2 0 1 1 0 012 0zm3 1a1 1 0 100-2 1 1 0 000 2zm1-5a1 1 0 11-2 0 1 1 0 012 0zM6 5a1 1 0 100-2 1 1 0 000 2z"
    ></path>
  </svg>
);

type SortablePlaylistTrackProps = {
  id: string;
  track: PlaylistTrack;
  dispatchUserAction: Dispatch<UserAction>;
};
export function SortableItem({
  id,
  track,
  dispatchUserAction,
}: SortablePlaylistTrackProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li className="bg-white hover:shadow-md p-4" ref={setNodeRef} style={style}>
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto] lg:grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-x-2 lg:gap-x-8">
        <div className="flex justify-center items-center">
          <button
            className="h-8 w-6 hover:bg-gray-200 rounded-md flex justify-center items-center"
            title="Reorder"
            aria-label="Drag handle"
            {...listeners}
            {...attributes}
          >
            {dragHandle}
          </button>
        </div>
        <div className="overflow-hidden">
          <div className="text-sm md:text-base truncate">{track.name}</div>
          <div className="text-xs md:text-sm text-slate-500 truncate">
            {track.artists.join(", ")}
          </div>
        </div>
        <div className="hidden lg:block text-base truncate">
          {track.albumName}
        </div>
        <div className="text-sm md:text-base flex justify-center items-center">
          {convertDurationToHMS(track.duration)}
        </div>
        <div className="flex justify-center items-center">
          <AudioPlayer url={track.previewUrl} />
        </div>
        <div className="flex justify-center items-center">
          <button
            className="h-8 w-6 hover:bg-gray-200 rounded-md flex justify-center items-center"
            title="Remove"
            aria-label="Remove"
            onClick={() =>
              dispatchUserAction({
                type: UserActionType.REMOVE_TRACK,
                payload: track,
              })
            }
          >
            <TrashIcon className="h-4 w-4 text-slate-700" aria-hidden />
          </button>
        </div>
      </div>
    </li>
  );
}

type PlaylistProps = {
  draggablePlaylistTracks: PlaylistTrack[];
  dispatchUserAction: Dispatch<UserAction>;
};
export default function Playlist({
  draggablePlaylistTracks,
  dispatchUserAction,
}: PlaylistProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over) {
      if (active.id !== over.id) {
        const oldIndex = draggablePlaylistTracks.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = draggablePlaylistTracks.findIndex(
          (item) => item.id === over.id
        );
        dispatchUserAction({
          type: UserActionType.UPDATE_PLAYLIST,
          payload: arrayMove(draggablePlaylistTracks, oldIndex, newIndex),
        });
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement, restrictToVerticalAxis]}
    >
      <SortableContext
        items={draggablePlaylistTracks}
        strategy={verticalListSortingStrategy}
      >
        <ul className="flex flex-col lg:pr-10 divide-y">
          {draggablePlaylistTracks.map((track) => (
            <SortableItem
              key={track.id}
              id={track.id}
              track={track}
              dispatchUserAction={dispatchUserAction}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
