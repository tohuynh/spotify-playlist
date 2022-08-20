import { useReducer, useState } from "react";
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
import {
  INITIAL_AUDIO_FEATURES,
  UserActionType,
  userInputReducer,
} from "./new-playlist-state";
import AddPlaylistTrack from "./add-playlist-track";

export default function NewPlaylist() {
  const [userInput, dispatchUserAction] = useReducer(userInputReducer, {
    trackSeeds: [],
    audioFeatures: { ...INITIAL_AUDIO_FEATURES },
    playlistTracks: [],
  });
  const [audioFeaturesForDisplay, setAudioFeaturesForDisplay] = useState<
    Partial<AudioFeatures>
  >({
    ...INITIAL_AUDIO_FEATURES,
  });

  /* const [draggablePlaylistTracks, setDraggablePlaylistTracks] = useState<
    PlaylistTrack[]
  >([]); */
  const getRecommendationsQuery = trpc.useQuery(
    [
      "spotify.getRecommendations",
      {
        ...userInput.audioFeatures,
        trackSeeds: userInput.trackSeeds.map((track) => track.id),
        limit: 20,
      },
    ],
    {
      refetchOnWindowFocus: false,
      onSuccess: (result) => {
        dispatchUserAction({
          type: UserActionType.UPDATE_PLAYLIST,
          payload: [...result],
        });
        if (
          result.length > 0 &&
          Object.values(userInput.audioFeatures).every((af) => af === undefined)
        ) {
          setAudioFeaturesForDisplay(calculateAverageAudioFeatures(result));
        }
      },
    }
  );

  const [createPlaylistDialogIsOpen, setCreatePlaylistDialogIsOpen] =
    useState(false);

  return (
    <div className="pb-20 lg:pb-0 lg:flex lg:flex-row lg:justify-start lg:gap-x-4">
      <CreatePlaylistDialog
        isOpen={createPlaylistDialogIsOpen}
        setIsOpen={setCreatePlaylistDialogIsOpen}
        uris={userInput.playlistTracks.map((track) => track.id)}
      />
      <div className="lg:basis-32 flex justify-center items-start">
        <button
          className="z-50 fixed lg:sticky h-16 w-16 m-4 lg:m-0 bottom-0 right-0 lg:top-4 flex justify-center items-center rounded-2xl shadow-lg bg-spotify-green disabled:cursor-not-allowed"
          aria-label="New mixtape"
          onClick={() => setCreatePlaylistDialogIsOpen(true)}
          disabled={
            getRecommendationsQuery.status === "error" ||
            getRecommendationsQuery.status === "loading" ||
            userInput.playlistTracks.length === 0
          }
        >
          <PlusIcon className="h-6 w-6" aria-hidden />
        </button>
      </div>
      <div className="lg:flex-1">
        <div>
          <SearchTracks
            selectedTracksNum={userInput.trackSeeds.length}
            dispatchUserAction={dispatchUserAction}
          />
          <TrackChips
            dispatchUserAction={dispatchUserAction}
            tracks={userInput.trackSeeds}
          />
        </div>
        {getRecommendationsQuery.status === "loading" && <div>Loading...</div>}
        {getRecommendationsQuery.status === "error" ||
          (getRecommendationsQuery.status === "success" &&
            getRecommendationsQuery.data.length === 0 && (
              <div>No results found...</div>
            ))}
        {getRecommendationsQuery.status === "success" &&
          getRecommendationsQuery.data.length > 0 && (
            <ModifyPlaylist
              audioFeaturesForDisplay={audioFeaturesForDisplay}
              dispatchUserAction={dispatchUserAction}
            />
          )}
        <AddPlaylistTrack dispatchUserAction={dispatchUserAction} />
        <Playlist
          draggablePlaylistTracks={userInput.playlistTracks}
          dispatchUserAction={dispatchUserAction}
        />
      </div>
    </div>
  );
}
