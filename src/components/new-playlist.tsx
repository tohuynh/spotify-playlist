import {
  Dispatch,
  SetStateAction,
  useState,
  Fragment,
  FormEventHandler,
} from "react";
import { trpc } from "../utils/trpc";
import { PlusIcon } from "@heroicons/react/outline";
import SearchTracks from "./search-tracks";
import { Transition, Dialog } from "@headlessui/react";
import toast from "react-hot-toast";
import Playlist from "./playlist";
import { PlaylistTrack, TrackSeed } from "../server/router/output-types";
import TrackChips from "./track-chips";

type CreatePlaylistDialogProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  uris: string[];
};
function CreatePlaylistDialog(props: CreatePlaylistDialogProps) {
  const { isOpen, setIsOpen, uris } = props;
  const createPlayList = trpc.useMutation(["spotify.createPlaylist"]);
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      playlistName: { value: string };
      playlistDescription: { value: string };
      playlistIsPublic: { checked: boolean };
    };
    if (uris.length > 0) {
      createPlayList.mutate(
        {
          uris,
          name: target.playlistName.value,
          description: target.playlistDescription.value,
          isPublic: target.playlistIsPublic.checked,
        },
        {
          onSuccess: (result) => {
            setIsOpen(false);
            toast.success(`Created mixtape ${result.name}!`);
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  New mixtape
                </Dialog.Title>
                <form
                  className="mt-2 flex flex-col gap-y-3"
                  onSubmit={onSubmit}
                >
                  <label className="block text-xs font-medium text-gray-500">
                    Name:
                    <input
                      required
                      className="h-10 w-full p-3 mt-1 text-sm border-2 border-gray-200 rounded outline-none"
                      type="text"
                      name="playlistName"
                    />
                  </label>
                  <label className="block text-xs font-medium text-gray-500">
                    Description:
                    <input
                      required
                      className="h-10 w-full p-3 mt-1 text-sm border-2 border-gray-200 rounded outline-none"
                      type="text"
                      name="playlistDescription"
                    />
                  </label>
                  <label className="block text-md font-medium text-gray-700">
                    <input
                      defaultChecked={true}
                      className="h-4 w-4 mr-2 text-sm border-2 border-gray-200 rounded outline-none"
                      type="checkbox"
                      name="playlistIsPublic"
                    />
                    Is public?
                  </label>
                  <div className="mt-4 flex justify-end items-center gap-x-4">
                    <button
                      type="reset"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium focus:outline-none"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-spotify-green px-4 py-2 text-sm font-medium focus:outline-none"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default function NewPlaylist() {
  const [selectedTracks, setSelectedTracks] = useState<TrackSeed[]>([]);

  const [draggablePlaylistTracks, setDraggablePlaylistTracks] = useState<
    PlaylistTrack[]
  >([]);
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
      onSuccess: (result) => {
        setDraggablePlaylistTracks([...result]);
      },
    }
  );

  const handleSelectTrack = (track: TrackSeed) => {
    const index = selectedTracks.findIndex((t) => t.id === track.id);
    if (index === -1) {
      setSelectedTracks((prev) => [...prev, track]);
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
        <Playlist
          draggablePlaylistTracks={draggablePlaylistTracks}
          setDraggablePlaylistTracks={setDraggablePlaylistTracks}
        />
      </div>
    </div>
  );
}
