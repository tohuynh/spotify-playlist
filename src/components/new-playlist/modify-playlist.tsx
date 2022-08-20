import { Dispatch, SetStateAction, FormEventHandler } from "react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { Transition, Dialog, Disclosure } from "@headlessui/react";
import { AudioFeatures } from "../../server/router/output-types";

type ModifyPlaylistProps = {
  audioFeaturesForDisplay: Partial<AudioFeatures>;
  setAudioFeaturesForRecommedations: Dispatch<
    SetStateAction<Partial<AudioFeatures>>
  >;
};
export default function ModifyPlaylist({
  audioFeaturesForDisplay,
  setAudioFeaturesForRecommedations,
}: ModifyPlaylistProps) {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      danceability: { value: string };
      instrumentalness: { value: string };
      valence: { value: string };
      energy: { value: string };
    };
    setAudioFeaturesForRecommedations({
      danceability: parseInt(target.danceability.value, 10),
      instrumentalness: parseInt(target.instrumentalness.value, 10),
      valence: parseInt(target.valence.value, 10),
      energy: parseInt(target.energy.value, 10),
    });
  };
  return (
    <div className="w-full px-4 pt-16">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>Modify</span>
                <ChevronUpIcon
                  className={`${open ? "rotate-180 transform" : ""} h-5 w-5`}
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
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <form
                  className="grid grid-cols-[auto_1fr_auto]"
                  onSubmit={handleSubmit}
                >
                  <label htmlFor="danceability">Relaxed</label>
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

                  <label htmlFor="valence">Negative</label>
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

                  <label htmlFor="energy">Chill</label>
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

                  <label htmlFor="instrumentalness">Vocal</label>
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

                  <button type="submit">Submit</button>
                </form>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
