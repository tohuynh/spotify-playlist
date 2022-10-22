import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Dispatch } from "react";

import { PlaylistTrack } from "../../server/router/output-types";
import { convertDurationToHMS } from "../../utils/convert-duration-to-hms";
import AudioPlayer from "./audio-player";
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      className={`bg-white p-4 md:py-2 ${
        isDragging ? "z-[1] shadow-lg" : "z-0"
      }`}
      ref={setNodeRef}
      style={style}
    >
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-2 lg:grid-cols-[auto_1fr_1fr_auto_auto_auto] lg:gap-x-8">
        <div className="flex items-center justify-center">
          <button
            className={`flex h-8 w-6 items-center justify-center rounded-md hover:bg-gray-200 ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            title="Reorder"
            aria-label="Drag handle"
            {...listeners}
            {...attributes}
          >
            {dragHandle}
          </button>
        </div>
        <div className="flex items-center gap-x-1 overflow-hidden">
          <div className="hidden flex-shrink-0 md:block">
            <Image
              layout="fixed"
              alt={`Cover art of ${track.albumName}`}
              src={track.image.url}
              height={track.image.height}
              width={track.image.width}
            />
          </div>
          <div className="overflow-hidden">
            <a
              className="truncate text-sm font-semibold text-blue-900 underline md:text-base"
              href={`https://open.spotify.com/track/${track.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {track.name}
            </a>
            <div className="truncate text-xs text-zinc-500 md:text-sm">
              {track.artists.join(", ")}
            </div>
          </div>
        </div>
        <div className="hidden truncate text-base lg:block">
          {track.albumName}
        </div>
        <div className="flex items-center justify-center text-sm md:text-base">
          {convertDurationToHMS(track.duration)}
        </div>
        <div className="flex items-center justify-center">
          <AudioPlayer url={track.previewUrl} />
        </div>
        <div className="flex items-center justify-center">
          <button
            className="flex h-8 w-6 items-center justify-center rounded-md hover:bg-gray-200"
            title="Remove"
            aria-label="Remove"
            onClick={() =>
              dispatchUserAction({
                type: UserActionType.REMOVE_TRACK,
                payload: track,
              })
            }
          >
            <TrashIcon className="h-4 w-4 text-zinc-700" aria-hidden />
          </button>
        </div>
      </div>
    </li>
  );
}

type PlaylistProps = {
  isFetching: boolean;
  draggablePlaylistTracks: PlaylistTrack[];
  dispatchUserAction: Dispatch<UserAction>;
};
export default function Playlist({
  isFetching,
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

  const [listRef, enableAnimation] = useAutoAnimate<HTMLUListElement>();

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
        //allow animation after arrayMove has happened
        setTimeout(() => enableAnimation(true), 500);
      }
    }
  }

  function handleDragStart() {
    enableAnimation(false);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement, restrictToVerticalAxis]}
    >
      <SortableContext
        items={draggablePlaylistTracks}
        strategy={verticalListSortingStrategy}
      >
        <ul
          className={`${
            isFetching ? "blur-[2px]" : "blur-none"
          } flex flex-col divide-y`}
          ref={listRef}
        >
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
