import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  ChangeEventHandler,
  Dispatch,
  FormEventHandler,
  SetStateAction,
} from "react";

import { AudioFeatures } from "../../server/router/output-types";
import { UserAction, UserActionType } from "./new-playlist-state";

type ModifyPlaylistProps = {
  disabled: boolean;
  audioFeaturesForDisplay: Partial<AudioFeatures>;
  setAudioFeaturesForDisplay: Dispatch<SetStateAction<Partial<AudioFeatures>>>;
  dispatchUserAction: Dispatch<UserAction>;
};
export default function ModifyPlaylist({
  disabled,
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
    <div className="w-full rounded-md bg-background text-foreground">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex h-14 w-full items-center justify-between rounded-md p-4 text-base md:text-lg">
              <span className="text-base md:text-lg">
                Modify mood of mixtape
              </span>
              <ChevronDownIcon
                className={`${
                  open ? "rotate-180 transform" : ""
                } h-4 w-4 text-foreground/50`}
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
              <form onSubmit={handleSubmit}>
                <fieldset
                  className="group grid grid-cols-[auto_minmax(0,1fr)_auto] gap-2"
                  disabled={disabled}
                >
                  <label
                    className="text-right text-foreground/70"
                    htmlFor="energy"
                  >
                    Chill
                  </label>
                  <input
                    className="focusable group-disabled:cursor-not-allowed"
                    type="range"
                    id="energy"
                    name="energy"
                    min={0}
                    max={100}
                    value={audioFeaturesForDisplay.energy || 0}
                    onChange={handleChange}
                  />
                  <label className="text-foreground/70" htmlFor="energy">
                    Intense
                  </label>

                  <label
                    className="text-right text-foreground/70"
                    htmlFor="danceability"
                  >
                    Unrhythmic
                  </label>
                  <input
                    className="focusable group-disabled:cursor-not-allowed"
                    type="range"
                    id="danceability"
                    name="danceability"
                    min={0}
                    max={100}
                    value={audioFeaturesForDisplay.danceability || 0}
                    onChange={handleChange}
                  />
                  <label className="text-foreground/70" htmlFor="danceability">
                    Danceable
                  </label>

                  <label
                    title="sad, depressed, angry"
                    className="text-right text-foreground/70"
                    htmlFor="valence"
                  >
                    Negative
                  </label>
                  <input
                    className="focusable group-disabled:cursor-not-allowed"
                    type="range"
                    id="valence"
                    name="valence"
                    min={0}
                    max={100}
                    value={audioFeaturesForDisplay.valence || 0}
                    onChange={handleChange}
                  />
                  <label
                    className="text-foreground/70"
                    title="happy, cheerful, euphoric"
                    htmlFor="valence"
                  >
                    Positive
                  </label>
                  <div className="col-span-full mt-1">
                    <label className="text-foreground/70">
                      Beats per minute (BPM):
                      <input
                        className="focusable mt-1 h-10 w-full rounded border border-neutral-400/10 bg-background p-3 text-sm group-disabled:cursor-not-allowed"
                        type="number"
                        name="tempo"
                        min={0}
                        value={audioFeaturesForDisplay.tempo || 0}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <div className="col-span-full mt-4">
                    <button
                      className="rounded-md border border-neutral-400/25 px-4 py-2 text-base font-medium group-disabled:cursor-not-allowed"
                      type="submit"
                    >
                      Modify
                    </button>
                  </div>
                </fieldset>
              </form>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
