import { PlusIcon } from "@heroicons/react/24/outline";
import { useReducer, useState } from "react";

import { AudioFeatures } from "../../server/router/output-types";
import { calculateAverageAudioFeatures } from "../../utils/audio-features";
import { trpc } from "../../utils/trpc";
import Status from "../status";
import CreatePlaylistDialog from "./create-playlist-dialog";
import ModifyPlaylist from "./modify-playlist";
import {
  INITIAL_AUDIO_FEATURES,
  UserActionType,
  userInputReducer,
} from "./new-playlist-state";
import Playlist from "./playlist";
import SearchTracks from "./search-tracks";
import TrackChips from "./track-chips";

export default function NewPlaylist() {
  const [userInput, dispatchUserAction] = useReducer(userInputReducer, {
    trackSeeds: [],
    audioFeatures: { ...INITIAL_AUDIO_FEATURES },
    playlistTracks: [],
    hasNewTrackSeeds: false,
  });
  const [audioFeaturesForDisplay, setAudioFeaturesForDisplay] = useState<
    Partial<AudioFeatures>
  >({
    ...INITIAL_AUDIO_FEATURES,
  });

  const { status, error, isFetching } = trpc.useQuery(
    [
      "spotify.getRecommendations",
      {
        ...userInput.audioFeatures,
        trackSeeds: userInput.trackSeeds.map((track) => track.id),
        limit: 15,
      },
    ],
    {
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (result) => {
        dispatchUserAction({
          type: UserActionType.UPDATE_PLAYLIST,
          payload: [...result],
        });
        if (userInput.hasNewTrackSeeds) {
          setAudioFeaturesForDisplay(calculateAverageAudioFeatures(result));
        }
      },
    }
  );

  const hasTrackSeeds = userInput.trackSeeds.length > 0;

  const [createPlaylistDialogIsOpen, setCreatePlaylistDialogIsOpen] =
    useState(false);

  return (
    <>
      <CreatePlaylistDialog
        isOpen={createPlaylistDialogIsOpen}
        setIsOpen={setCreatePlaylistDialogIsOpen}
        uris={userInput.playlistTracks.map((track) => track.uri)}
      />
      <button
        className="fixed bottom-16 right-0 z-40 m-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-spotify-green shadow-lg disabled:cursor-not-allowed md:top-20 md:left-10 md:m-0"
        aria-label="New mixtape"
        onClick={() => setCreatePlaylistDialogIsOpen(true)}
        disabled={
          ["error", "loading"].includes(status) ||
          userInput.playlistTracks.length === 0
        }
      >
        <PlusIcon className="h-6 w-6" aria-hidden />
      </button>
      <div className="flex flex-col gap-y-4 border-b-2 border-neutral-400/10 py-16">
        <div className="mx-auto w-full md:w-2/3 lg:w-1/2">
          <SearchTracks
            placeholderText="Select up to 5 tracks to generate a mixtape"
            disabled={userInput.trackSeeds.length === 5}
            onSelectUserActionType={UserActionType.SELECT_TRACK}
            dispatchUserAction={dispatchUserAction}
          />
        </div>
        <TrackChips
          dispatchUserAction={dispatchUserAction}
          tracks={userInput.trackSeeds}
        />
      </div>
      {(hasTrackSeeds || userInput.hasNewTrackSeeds) && (
        <div className="mx-auto flex w-full flex-col gap-y-4 py-16 md:w-2/3 lg:w-1/2">
          <ModifyPlaylist
            disabled={userInput.trackSeeds.length === 0}
            audioFeaturesForDisplay={audioFeaturesForDisplay}
            setAudioFeaturesForDisplay={setAudioFeaturesForDisplay}
            dispatchUserAction={dispatchUserAction}
          />
          <SearchTracks
            placeholderText="Add track to mixtape"
            disabled={false}
            onSelectUserActionType={UserActionType.ADD_TRACK}
            dispatchUserAction={dispatchUserAction}
          />
          <div className="flex justify-center">
            <Status
              isVisible={hasTrackSeeds}
              status={status}
              errorMessage={error?.message}
            />
          </div>
        </div>
      )}
      <Playlist
        isFetching={isFetching}
        draggablePlaylistTracks={userInput.playlistTracks}
        dispatchUserAction={dispatchUserAction}
      />
    </>
  );
}
