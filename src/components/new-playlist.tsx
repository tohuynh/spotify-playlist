import { Combobox } from "@headlessui/react";
import { useRef, useState } from "react";
import { ArrayElement } from "../types/utility-types";
import { inferQueryOutput, trpc } from "../utils/trpc";
import { PlusIcon, XIcon } from "@heroicons/react/outline";
import SearchTracks from "./search-tracks";
import { convertDurationToHMS } from "../types/convertDurationToHMS";

type Track = ArrayElement<inferQueryOutput<"spotify.search">>;

function TrackChips({
  tracks,
  handleRemove,
}: {
  tracks: Track[];
  handleRemove: (track: Track) => void;
}) {
  // has maintain list of chips state
  // pass callbacks to add/edit/remove track for TrackChip
  // display or remove NewTrackTrip
  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {tracks.map((track) => (
        <button
          key={track.id}
          className="rounded-xl flex justify-between items-center ring-1 ring-slate-200 hover:bg-slate-200 max-w-[16rem] px-4 py-1"
          onClick={() => handleRemove(track)}
        >
          <span className="basis-11/12 truncate">{track.name}</span>
          <XIcon className="h-4 w-4 ml-4" />
        </button>
      ))}
    </div>
  );
}

function MixTapes() {}

export default function NewPlaylist() {
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);

  const getRecommendationsQuery = trpc.useQuery([
    "spotify.getRecommendations",
    {
      trackSeeds: selectedTracks.map((track) => track.id).join(","),
      limit: 20,
    },
  ]);

  const handleRemove = (track: Track) => {
    const index = selectedTracks.findIndex((t) => t.id === track.id);
    if (index > -1) {
      selectedTracks.splice(index, 1);
      setSelectedTracks((prev) => {
        prev.slice(index, 1);
        return [...prev];
      });
    }
  };

  /*  const createPlayList = trpc.useMutation(["spotify.createPlaylist"]);

  const onCreate = () =>
    createPlayList.mutate({
      ids: ["51R5mPcJjOnfv9lKY1u5sW"],
      name: "My test pl",
      description: "test pl",
      isPublic: false,
    }); */

  // maintain list of chips state
  // provide callbacks to add/edit/remove track to TrakcChips
  // use list of chips state to generate list of recommended tracks
  return (
    <div className="pb-20 lg:pb-0 lg:flex lg:flex-row lg:justify-start lg:gap-x-4">
      <div className="lg:basis-32 flex justify-center items-start">
        <button
          className="fixed lg:relative h-16 w-16 m-4 lg:m-0 bottom-0 right-0 flex justify-center items-center bg-green-300 rounded-2xl shadow-lg"
          aria-label="New mixtape"
        >
          <PlusIcon className="h-6 w-6" aria-hidden />
        </button>
      </div>
      <div className="lg:flex-1">
        <div>
          <SearchTracks
            selectedTracksNum={selectedTracks.length}
            handleSelectTrack={(track: Track) =>
              setSelectedTracks((prev) => [...prev, track])
            }
          />
          <TrackChips handleRemove={handleRemove} tracks={selectedTracks} />
        </div>
        <ul className="mt-4 flex flex-col gap-5 lg:p-8">
          {getRecommendationsQuery.data?.map((track, i) => (
            <li className="hover:bg-slate-200 px-3 py-1" key={track.uri}>
              <div className="flex flex-col lg:flex-row gap-x-8">
                <div className="flex-1 flex gap-3 items-center">
                  <div className="flex flex-col justify-center items-center">
                    <div>{i + 1}</div>
                    <div className="lg:hidden">
                      {convertDurationToHMS(track.duration)}
                    </div>
                  </div>
                  <div className="">
                    <div className="text-lg">{track.name}</div>
                    <div className="text-md font-light">
                      {track.artists.join(", ")}
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block flex-1 text-lg">
                  {track.albumName}
                </div>
                <div className="hidden lg:block text-md">
                  {convertDurationToHMS(track.duration)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
