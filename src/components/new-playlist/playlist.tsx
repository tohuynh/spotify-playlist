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
      className={`relative bg-white p-4 md:py-2 ${
        isDragging ? "z-[1] shadow-lg" : "z-0"
      }`}
      ref={setNodeRef}
      style={style}
    >
      <span className="absolute top-0 -left-2">
        <svg
          aria-hidden
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1333.33 1333.3"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
          imageRendering="optimizeQuality"
          fillRule="evenodd"
          clipRule="evenodd"
        >
          <path
            d="M666.66 0C298.48 0 0 298.47 0 666.65c0 368.19 298.48 666.65 666.66 666.65 368.22 0 666.67-298.45 666.67-666.65C1333.33 298.49 1034.88.03 666.65.03l.01-.04zm305.73 961.51c-11.94 19.58-37.57 25.8-57.16 13.77-156.52-95.61-353.57-117.26-585.63-64.24-22.36 5.09-44.65-8.92-49.75-31.29-5.12-22.37 8.84-44.66 31.26-49.75 253.95-58.02 471.78-33.04 647.51 74.35 19.59 12.02 25.8 37.57 13.77 57.16zm81.6-181.52c-15.05 24.45-47.05 32.17-71.49 17.13-179.2-110.15-452.35-142.05-664.31-77.7-27.49 8.3-56.52-7.19-64.86-34.63-8.28-27.49 7.22-56.46 34.66-64.82 242.11-73.46 543.1-37.88 748.89 88.58 24.44 15.05 32.16 47.05 17.12 71.46V780zm7.01-189.02c-214.87-127.62-569.36-139.35-774.5-77.09-32.94 9.99-67.78-8.6-77.76-41.55-9.98-32.96 8.6-67.77 41.56-77.78 235.49-71.49 626.96-57.68 874.34 89.18 29.69 17.59 39.41 55.85 21.81 85.44-17.52 29.63-55.89 39.4-85.42 21.8h-.03z"
            fill="#1DB954"
            fillRule="nonzero"
          />
        </svg>
      </span>
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
              className="block truncate text-sm font-semibold text-blue-900 underline md:text-base"
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
