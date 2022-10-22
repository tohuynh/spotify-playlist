import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, FormEventHandler, Fragment, SetStateAction } from "react";
import toast from "react-hot-toast";

import Status from "../../components/status";
import { trpc } from "../../utils/trpc";

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
                  <div className="mt-4 flex items-center justify-end gap-x-4 font-medium text-zinc-800">
                    <button
                      disabled={isLoading}
                      type="reset"
                      className="inline-flex justify-center rounded-md border border-transparent bg-zinc-200 px-4 py-2 disabled:cursor-not-allowed"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isLoading}
                      type="submit"
                      className="inline-flex items-center justify-center gap-1 rounded-md border border-transparent bg-zinc-200 px-4 py-2 font-semibold text-spotify-green disabled:cursor-not-allowed"
                    >
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
