import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, FormEventHandler, Fragment, SetStateAction } from "react";
import toast from "react-hot-toast";

import Status from "../../components/status";
import { trpc } from "../../utils/trpc";
import SpotifyIcon from "../spotify-icon";

type CreatePlaylistDialogProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  uris: string[];
};

export default function CreatePlaylistDialog(props: CreatePlaylistDialogProps) {
  const { isOpen, setIsOpen, uris } = props;
  const { mutate, status, error, reset, isLoading } = trpc.useMutation(
    ["spotify.createPlaylist"],
    {
      retry: false,
      onSuccess: (result) => {
        setIsOpen(false);
        reset();
        toast.success(`Created mixtape ${result.name}!`);
      },
    }
  );
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      playlistName: { value: string };
      playlistDescription: { value: string };
      //playlistIsPublic: { checked: boolean };
    };
    if (uris.length > 0) {
      mutate({
        uris,
        name: target.playlistName.value,
        description: target.playlistDescription.value,
        isPublic: true /* target.playlistIsPublic.checked */,
      });
    }
  };

  const onClose = () => {
    reset();
    setIsOpen(false);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-xl font-medium">
                  New mixtape
                </Dialog.Title>
                <form
                  className="mt-2 flex flex-col gap-y-3"
                  onSubmit={onSubmit}
                >
                  <label className="block font-medium text-zinc-600">
                    Name:
                    <input
                      required
                      className="mt-1 h-10 w-full rounded border-2 border-gray-200 p-3"
                      type="text"
                      name="playlistName"
                    />
                  </label>
                  <label className="block font-medium text-zinc-600">
                    Description:
                    <input
                      required
                      className="mt-1 h-10 w-full rounded border-2 border-gray-200 p-3"
                      type="text"
                      name="playlistDescription"
                    />
                  </label>
                  {/*  <label className="text-md block font-medium text-gray-700">
                    <input
                      defaultChecked={true}
                      className="mr-2 h-4 w-4 rounded border-2 border-gray-200 text-sm"
                      type="checkbox"
                      name="playlistIsPublic"
                    />
                    Is public?
                  </label> */}
                  <div className="mt-1">
                    <Status
                      isVisible={true}
                      status={status}
                      heightClass="h-5"
                      widthClass="w-5"
                      errorMessage={error?.message}
                    />
                  </div>
                  <div className="mt-4 flex flex-col items-center justify-start gap-4 font-medium text-zinc-800 md:flex-row md:justify-end">
                    <button
                      disabled={isLoading}
                      type="reset"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-zinc-200 px-4 py-2 disabled:cursor-not-allowed md:w-auto"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isLoading}
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-zinc-200 px-4 py-2 font-semibold text-spotify-green disabled:cursor-not-allowed md:w-auto"
                    >
                      <SpotifyIcon heightClass="h-5" widthClass="w-5" />
                      <span>Save on Spotify</span>
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
