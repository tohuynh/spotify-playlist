import { Dispatch, SetStateAction, Fragment, FormEventHandler } from "react";
import { trpc } from "../../utils/trpc";
import { Transition, Dialog } from "@headlessui/react";
import toast from "react-hot-toast";

type CreatePlaylistDialogProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  uris: string[];
};

export default function CreatePlaylistDialog(props: CreatePlaylistDialogProps) {
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
                      className="mt-1 h-10 w-full rounded border-2 border-gray-200 p-3 text-sm outline-none"
                      type="text"
                      name="playlistName"
                    />
                  </label>
                  <label className="block text-xs font-medium text-gray-500">
                    Description:
                    <input
                      required
                      className="mt-1 h-10 w-full rounded border-2 border-gray-200 p-3 text-sm outline-none"
                      type="text"
                      name="playlistDescription"
                    />
                  </label>
                  <label className="text-md block font-medium text-gray-700">
                    <input
                      defaultChecked={true}
                      className="mr-2 h-4 w-4 rounded border-2 border-gray-200 text-sm outline-none"
                      type="checkbox"
                      name="playlistIsPublic"
                    />
                    Is public?
                  </label>
                  <div className="mt-4 flex items-center justify-end gap-x-4">
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
