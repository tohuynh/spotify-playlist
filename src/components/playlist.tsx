import { Dispatch, SetStateAction } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
  restrictToFirstScrollableAncestor,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

import { inferQueryOutput } from "../utils/trpc";
import { ArrayElement } from "../types/utility-types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AudioPlayer from "./audio-player";
import { convertDurationToHMS } from "../utils/convertDurationToHMS";

type PlaylistTrack = ArrayElement<
  inferQueryOutput<"spotify.getRecommendations">
>;

type SortablePlaylistTrackProps = {
  id: string;
  track: PlaylistTrack;
};
export function SortableItem(props: SortablePlaylistTrackProps) {
  const { id, track } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      className="bg-white hover:bg-slate-100 shadow-sm hover:shadow-md rounded-md p-2"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="flex flex-row gap-x-8">
        <div className="flex-1 flex gap-4 items-center">
          <div className="flex flex-col justify-center items-center">
            <AudioPlayer url={track.previewUrl} />
          </div>
          <div className="flex-1">
            <div className="text-sm lg:text-lg font-medium">{track.name}</div>
            <div className="text-xs lg:text-base font-light">
              {track.artists.join(", ")}
            </div>
          </div>
        </div>
        <div className="hidden lg:block flex-1 text-lg">{track.albumName}</div>
        <div className="text-sm lg:text-lg">
          {convertDurationToHMS(track.duration)}
        </div>
      </div>
    </li>
  );
}

type PlaylistProps = {
  draggablePlaylistTracks: PlaylistTrack[];
  setDraggablePlaylistTracks: Dispatch<SetStateAction<PlaylistTrack[]>>;
};
export default function Playlist(props: PlaylistProps) {
  const { draggablePlaylistTracks, setDraggablePlaylistTracks } = props;
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over) {
      if (active.id !== over.id) {
        setDraggablePlaylistTracks((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);

          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToFirstScrollableAncestor, restrictToVerticalAxis]}
    >
      <SortableContext
        items={draggablePlaylistTracks}
        strategy={verticalListSortingStrategy}
      >
        <ul className="mt-8 flex flex-col gap-5 lg:p-8 m-y-1">
          {draggablePlaylistTracks.map((track) => (
            <SortableItem key={track.id} id={track.id} track={track} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

//fix play button
//variable height?
