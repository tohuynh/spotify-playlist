import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
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
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    className="h-4 w-4"
    stroke="currentColor"
  >
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
      className={`bg-background py-2 ${
        isDragging ? "z-[1] shadow-lg" : "z-0"
      } md:py-4`}
      ref={setNodeRef}
      style={style}
    >
      <div className="grid grid-cols-[auto_1fr_auto] gap-x-2 md:grid-cols-[auto_1fr_1fr_auto_auto_auto] md:gap-x-4">
        <button
          className={`group flex h-full w-12 items-center justify-center ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          title="Reorder"
          aria-label="Drag handle"
          {...listeners}
          {...attributes}
        >
          <span className="inline-flex h-8 w-6 items-center justify-center rounded-md text-foreground/70 group-hover:bg-foreground/10">
            {dragHandle}
          </span>
        </button>
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
          <div className="overflow-hidden p-1">
            <a
              className="block truncate text-sm font-semibold text-primary underline underline-offset-2 md:text-base"
              href={`https://open.spotify.com/track/${track.id}`}
              target="_blank"
              rel="noopener noreferrer"
              title={track.name}
            >
              {track.name}
            </a>
            <div
              className="truncate text-xs text-foreground/60 md:text-sm"
              title={track.artists.join(", ")}
            >
              {track.artists.join(", ")}
            </div>
          </div>
        </div>
        <div
          className="hidden truncate p-1 text-base text-foreground/90 md:block"
          title={track.albumName}
        >
          {track.albumName}
        </div>
        <div className="hidden text-sm text-foreground/70 md:flex md:items-center md:justify-center md:text-base">
          {convertDurationToHMS(track.duration)}
        </div>
        <div className="hidden md:block">
          <AudioPlayer url={track.previewUrl} trackId={track.id} />
        </div>
        <button
          className="group flex h-full w-12 items-center justify-center"
          title="Remove"
          aria-label="Remove"
          onClick={() =>
            dispatchUserAction({
              type: UserActionType.REMOVE_TRACK,
              payload: track,
            })
          }
        >
          <span className="flex h-8 w-6 items-center justify-center rounded-md text-foreground/70 group-hover:bg-foreground/10">
            <TrashIcon className="h-4 w-4" aria-hidden />
          </span>
        </button>
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
          } flex flex-col divide-y divide-neutral-400/10`}
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
