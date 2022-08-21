import {
  ChangeEventHandler,
  Dispatch,
  FormEventHandler,
  SetStateAction,
} from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Transition, Disclosure } from "@headlessui/react";
import { AudioFeatures } from "../../server/router/output-types";
import { UserAction, UserActionType } from "./new-playlist-state";

type ModifyPlaylistProps = {
  audioFeaturesForDisplay: Partial<AudioFeatures>;
  setAudioFeaturesForDisplay: Dispatch<SetStateAction<Partial<AudioFeatures>>>;
  dispatchUserAction: Dispatch<UserAction>;
};
export default function ModifyPlaylist({
  audioFeaturesForDisplay,
  setAudioFeaturesForDisplay,
  dispatchUserAction,
}: ModifyPlaylistProps) {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      danceability: { value: string };
      tempo: { value: string };
      valence: { value: string };
      energy: { value: string };
    };
    dispatchUserAction({
      type: UserActionType.MODIFY_AUDIO_FEATURES,
      payload: {
        danceability: parseInt(target.danceability.value, 10),
        tempo: parseInt(target.tempo.value, 10),
        valence: parseInt(target.valence.value, 10),
        energy: parseInt(target.energy.value, 10),
      },
    });
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setAudioFeaturesForDisplay((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };
  return (
    <div className="w-full pt-16">
      <div className="mx-auto w-full md:w-2/3 lg:w-1/2 rounded-md bg-white shadow-md">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="h-14 flex w-full justify-between items-center px-4 py-2 text-base md:text-lg">
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
              <Disclosure.Panel className="px-4 py-2 text-xs md:text-base">
                <form
                  className="grid grid-cols-[auto_1fr_auto] gap-2"
                  onSubmit={handleSubmit}
                >
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
                    value={audioFeaturesForDisplay.energy || 0}
                    onChange={handleChange}
                  />
                  <label htmlFor="energy">Intense</label>

                  <label className="text-right" htmlFor="danceability">
                    Unrhythmic
                  </label>
                  <input
                    className="spotify-accent"
                    type="range"
                    id="danceability"
                    name="danceability"
                    min={0}
                    max={100}
                    value={audioFeaturesForDisplay.danceability || 0}
                    onChange={handleChange}
                  />
                  <label htmlFor="danceability">Danceable</label>

                  <label
                    title="sad, depressed, angry"
                    className="text-right"
                    htmlFor="valence"
                  >
                    Negative
                  </label>
                  <input
                    className="spotify-accent"
                    type="range"
                    id="valence"
                    name="valence"
                    min={0}
                    max={100}
                    value={audioFeaturesForDisplay.valence || 0}
                    onChange={handleChange}
                  />
                  <label title="happy, cheerful, euphoric" htmlFor="valence">
                    Positive
                  </label>
                  <div className="mt-1 col-span-full">
                    <label>
                      Beats per minute (BPM):
                      <input
                        className="h-10 w-full p-3 mt-1 text-sm border-2 border-gray-200 rounded outline-none"
                        type="number"
                        name="tempo"
                        min={0}
                        value={audioFeaturesForDisplay.tempo || 0}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <div className="mt-4 col-span-full">
                    <button
                      className="rounded-md border border-transparent bg-gray-300 px-4 py-2 text-base font-medium"
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
