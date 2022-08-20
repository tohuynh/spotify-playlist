import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { PlusIcon } from "@heroicons/react/outline";
import SearchTracks from "./search-tracks";
import Playlist from "./playlist";
import {
  AudioFeatures,
  PlaylistTrack,
  TrackSeed,
} from "../../server/router/output-types";
import TrackChips from "./track-chips";
import { calculateAverageAudioFeatures } from "../../utils/audio-features";
import CreatePlaylistDialog from "./create-playlist-dialog";
import ModifyPlaylist from "./modify-playlist";

export default function NewPlaylist() {
  const [selectedTracks, setSelectedTracks] = useState<TrackSeed[]>([]);
  const [audioFeaturesForRecommedations, setAudioFeaturesForRecommedations] =
    useState<Partial<AudioFeatures>>({
      danceability: undefined,
      instrumentalness: undefined,
      valence: undefined,
    });
  const [audioFeaturesForDisplay, setAudioFeaturesForDisplay] = useState<
    Partial<AudioFeatures>
  >({
    danceability: undefined,
    instrumentalness: undefined,
    valence: undefined,
  });

  const [draggablePlaylistTracks, setDraggablePlaylistTracks] = useState<
    PlaylistTrack[]
  >([]);
  const getRecommendationsQuery = trpc.useQuery(
    [
      "spotify.getRecommendations",
      {
        ...audioFeaturesForRecommedations,
        trackSeeds: selectedTracks.map((track) => track.id),
        limit: 20,
      },
    ],
    {
      refetchOnWindowFocus: false,
      onSuccess: (result) => {
        setDraggablePlaylistTracks([...result]);
        if (result.length > 0) {
          setAudioFeaturesForDisplay(calculateAverageAudioFeatures(result));
        }
      },
    }
  );

  const handleSelectTrack = (track: TrackSeed) => {
    const index = selectedTracks.findIndex((t) => t.id === track.id);
    if (index === -1) {
      setSelectedTracks((prev) => [...prev, track]);
      setAudioFeaturesForRecommedations({
        danceability: undefined,
        instrumentalness: undefined,
        valence: undefined,
        energy: undefined,
      });
    }
  };

  const handleUnselectTrack = (track: TrackSeed) => {
    const index = selectedTracks.findIndex((t) => t.id === track.id);
    if (index > -1) {
      selectedTracks.splice(index, 1);
      setSelectedTracks((prev) => {
        prev.slice(index, 1);
        return [...prev];
      });
    }
  };

  const [createPlaylistDialogIsOpen, setCreatePlaylistDialogIsOpen] =
    useState(false);

  return (
    <div className="pb-20 lg:pb-0 lg:flex lg:flex-row lg:justify-start lg:gap-x-4">
      <CreatePlaylistDialog
        isOpen={createPlaylistDialogIsOpen}
        setIsOpen={setCreatePlaylistDialogIsOpen}
        uris={draggablePlaylistTracks.map((track) => track.id) || []}
      />
      <div className="lg:basis-32 flex justify-center items-start">
        <button
          className="z-50 fixed lg:sticky h-16 w-16 m-4 lg:m-0 bottom-0 right-0 lg:top-4 flex justify-center items-center rounded-2xl shadow-lg bg-spotify-green disabled:cursor-not-allowed"
          aria-label="New mixtape"
          onClick={() => setCreatePlaylistDialogIsOpen(true)}
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
            handleUnselectTrack={handleUnselectTrack}
            tracks={selectedTracks}
          />
        </div>
        {draggablePlaylistTracks.length > 0 && (
          <ModifyPlaylist
            audioFeaturesForDisplay={audioFeaturesForDisplay}
            setAudioFeaturesForRecommedations={
              setAudioFeaturesForRecommedations
            }
          />
        )}
        <Playlist
          draggablePlaylistTracks={draggablePlaylistTracks}
          setDraggablePlaylistTracks={setDraggablePlaylistTracks}
        />
      </div>
    </div>
  );
}
