import { Dispatch, FormEventHandler } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Transition, Disclosure } from "@headlessui/react";
import { AudioFeatures } from "../../server/router/output-types";
import { UserAction, UserActionType } from "./new-playlist-state";

type ModifyPlaylistProps = {
  audioFeaturesForDisplay: Partial<AudioFeatures>;
  dispatchUserAction: Dispatch<UserAction>;
};
export default function ModifyPlaylist({
  audioFeaturesForDisplay,
  dispatchUserAction,
}: ModifyPlaylistProps) {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      danceability: { value: string };
      instrumentalness: { value: string };
      valence: { value: string };
      energy: { value: string };
    };
    dispatchUserAction({
      type: UserActionType.MODIFY_AUDIO_FEATURES,
      payload: {
        danceability: parseInt(target.danceability.value, 10),
        instrumentalness: parseInt(target.instrumentalness.value, 10),
        valence: parseInt(target.valence.value, 10),
        energy: parseInt(target.energy.value, 10),
      },
    });
  };
  return (
    <div className="w-full pt-16">
      <div className="mx-auto w-full lg:w-1/2 rounded-xl bg-white shadow-md p-2">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-2 text-left text-lg font-medium">
                <span>Modify mood of mixtape</span>
                <ChevronDownIcon
                  className={`${open ? "rotate-180 transform" : ""} h-6 w-6`}
                />
              </Disclosure.Button>
              <Transition
                show={open}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              />
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm md:text-base lg:text-base font-light">
                <form
                  className="grid grid-cols-[auto_1fr_auto] gap-2"
                  onSubmit={handleSubmit}
                >
                  <label className="text-right" htmlFor="danceability">
                    Relaxed
                  </label>
                  <input
                    className="spotify-accent"
                    type="range"
                    id="danceability"
                    name="danceability"
                    min={0}
                    max={100}
                    defaultValue={audioFeaturesForDisplay.danceability || 0}
                  />
                  <label htmlFor="danceability">Danceable</label>

                  <label className="text-right" htmlFor="valence">
                    Negative
                  </label>
                  <input
                    className="spotify-accent"
                    type="range"
                    id="valence"
                    name="valence"
                    min={0}
                    max={100}
                    defaultValue={audioFeaturesForDisplay.valence || 0}
                  />
                  <label htmlFor="valence">Positive</label>

                  <label className="text-right" htmlFor="energy">
                    Chill
                  </label>
                  <input
                    className="spotify-accent"
                    type="range"
                    id="energy"
                    name="energy"
                    min={0}
                    max={100}
                    defaultValue={audioFeaturesForDisplay.energy || 0}
                  />
                  <label htmlFor="valence">Intense</label>

                  <label className="text-right" htmlFor="instrumentalness">
                    Vocal
                  </label>
                  <input
                    className="spotify-accent"
                    type="range"
                    id="instrumentalness"
                    name="instrumentalness"
                    min={0}
                    max={100}
                    defaultValue={audioFeaturesForDisplay.instrumentalness || 0}
                  />
                  <label htmlFor="instrumentalness">Instrumental</label>
                  <div className="mt-4 col-span-full ">
                    <button
                      className="rounded-md border border-transparent bg-gray-300 px-4 py-2 text-base font-medium focus:outline-none"
                      type="submit"
                    >
                      Modify
                    </button>
                  </div>
                </form>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
