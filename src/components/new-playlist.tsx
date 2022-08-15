import { Combobox } from "@headlessui/react";
import { useRef, useState } from "react";
import { trpc } from "../utils/trpc";

function NewTrackTrip() {
  //add track
  //share combo box feature
  //but add track adds to list of chips state
}

function TrackChip() {
  // edit track
  // open popover to combo box input populate with track's name

  // remove track
  // callback to remove track
  return <div></div>;
}

function TrackChips() {
  // has maintain list of chips state
  // pass callbacks to add/edit/remove track for TrackChip
  // display or remove NewTrackTrip
  return <div></div>;
}

function MixTapes() {}

const plus = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

export default function CreatePlaylist() {
  /*   const [query, setQuery] = useState("");
  const queryRef = useRef("");
  const searchQuery = trpc.useQuery([
    "spotify.search",
    { q: query, offset: 0, limit: 2 },
  ]); */

  const getRecommendationsQuery = trpc.useQuery([
    "spotify.getRecommendations",
    { trackSeeds: ["51R5mPcJjOnfv9lKY1u5sW"], limit: 1 },
  ]);

  /*  const createPlayList = trpc.useMutation(["spotify.createPlaylist"]);

  const onCreate = () =>
    createPlayList.mutate({
      ids: ["51R5mPcJjOnfv9lKY1u5sW"],
      name: "My test pl",
      description: "test pl",
      isPublic: false,
    }); */

  // maintain list of chips state
  // provide callbacks to add/edit/remove track to TrakcChips
  // use list of chips state to generate list of recommended tracks
  return (
    <div className="lg:flex lg:flex-row lg:gap-x-4">
      <div className="basis-32 flex justify-center items-center">
        <button
          className="fixed lg:relative h-16 w-16 m-4 lg:m-0 bottom-0 right-0 flex justify-center items-center bg-green-300 rounded-2xl shadow-lg"
          aria-label="New mixtape"
        >
          {plus}
        </button>
      </div>
      <div>
        <div>
          <h2 className="text-lg">
            Select up to 5 tracks to generate a mixtape
          </h2>
          <div>list of chips</div>
        </div>
        <div>list of tracks</div>
      </div>
    </div>
  );
}

{
  /* <Combobox value="" onChange={(e) => console.log(e)}>
          <Combobox.Input
            className="w-full"
            onChange={(e) => setQuery(e.target.value)}
          />
          <Combobox.Options>
            {searchQuery.data?.map((track) => (
              <Combobox.Option key={track.id} value={track.id}>
                {track.name}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
 */
}
