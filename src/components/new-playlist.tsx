import { useState } from "react";
import { ArrayElement } from "../types/utility-types";
import { inferQueryOutput, trpc } from "../utils/trpc";
import { PlusIcon, XIcon } from "@heroicons/react/outline";
import SearchTracks from "./search-tracks";
import { convertDurationToHMS } from "../types/convertDurationToHMS";
import AudioPlayer from "./audio-player";

type Track = ArrayElement<inferQueryOutput<"spotify.search">>;

function TrackChips({
  tracks,
  handleRemoveTrack,
}: {
  tracks: Track[];
  handleRemoveTrack: (track: Track) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {tracks.map((track, i) => (
        <button
          key={track.id}
          className="rounded-xl flex justify-between items-center ring-1 ring-slate-200 hover:bg-slate-200 max-w-[16rem] px-4 py-1"
          onClick={() => handleRemoveTrack(track)}
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

export default function NewPlaylist() {
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);

  const getRecommendationsQuery = trpc.useQuery(
    [
      "spotify.getRecommendations",
      {
        trackSeeds: selectedTracks.map((track) => track.id),
        limit: 20,
      },
    ],
    {
      refetchOnWindowFocus: false,
    }
  );

  const handleSelectTrack = (track: Track) => {
    const index = selectedTracks.findIndex((t) => t.id === track.id);
    if (index === -1) {
      setSelectedTracks((prev) => [...prev, track]);
    }
  };

  const handleRemoveTrack = (track: Track) => {
    const index = selectedTracks.findIndex((t) => t.id === track.id);
    if (index > -1) {
      selectedTracks.splice(index, 1);
      setSelectedTracks((prev) => {
        prev.slice(index, 1);
        return [...prev];
      });
    }
  };

  const createPlayList = trpc.useMutation(["spotify.createPlaylist"]);

  const onCreate = () => {
    //open the modal
    //slide from bottom, mobile
    //center modal, lg
    if (getRecommendationsQuery.data) {
      createPlayList.mutate({
        uris: getRecommendationsQuery.data.map((track) => track.uri),
        name: "My test pl",
        description: "test pl",
        isPublic: false,
      });
    }
  };

  return (
    <div className="pb-20 lg:pb-0 lg:flex lg:flex-row lg:justify-start lg:gap-x-4">
      <div className="lg:basis-32 flex justify-center items-start">
        <button
          className="fixed lg:relative h-16 w-16 m-4 lg:m-0 bottom-0 right-0 flex justify-center items-center bg-green-300 rounded-2xl shadow-lg"
          aria-label="New mixtape"
          onClick={onCreate}
          disabled={
            getRecommendationsQuery.status === "error" ||
            getRecommendationsQuery.status === "loading"
          }
        >
          <PlusIcon className="h-6 w-6" aria-hidden />
        </button>
      </div>
      <div className="lg:flex-1">
        <div>
          <SearchTracks
            selectedTracksNum={selectedTracks.length}
            handleSelectTrack={handleSelectTrack}
          />
          <TrackChips
            handleRemoveTrack={handleRemoveTrack}
            tracks={selectedTracks}
          />
        </div>
        <ul className="mt-4 flex flex-col gap-5 lg:p-8 m-y-1">
          {getRecommendationsQuery.data?.map((track) => (
            <li
              className="hover:bg-slate-200 hover:shadow-md rounded-md px-3 py-1"
              key={track.uri}
            >
              <div className="flex flex-row gap-x-8">
                <div className="flex-1 flex gap-4 items-center">
                  <div className="flex flex-col justify-center items-center">
                    <AudioPlayer url={track.previewUrl} />
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
                <div className="text-md">
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
