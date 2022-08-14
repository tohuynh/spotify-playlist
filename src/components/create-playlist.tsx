import { Combobox } from "@headlessui/react";
import { useRef, useState } from "react";
import { trpc } from "../utils/trpc";

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
  const [query, setQuery] = useState("");
  const queryRef = useRef("");
  const searchQuery = trpc.useQuery([
    "spotify.search",
    { q: query, offset: 0, limit: 2 },
  ]);

  const getRecommendationsQuery = trpc.useQuery([
    "spotify.getRecommendations",
    { trackSeeds: ["51R5mPcJjOnfv9lKY1u5sW"], limit: 1 },
  ]);

  const createPlayList = trpc.useMutation(["spotify.createPlaylist"]);

  const onCreate = () =>
    createPlayList.mutate({
      ids: ["51R5mPcJjOnfv9lKY1u5sW"],
      name: "My test pl",
      description: "test pl",
      isPublic: false,
    });

  return (
    <div className="relative pb-18">
      <h2>Select up to 5 tracks to generate a mixtape</h2>
      <div className="w-full">
        <Combobox value="" onChange={(e) => console.log(e)}>
          <Combobox.Input onChange={(e) => setQuery(e.target.value)} />
          <Combobox.Options>
            {searchQuery.data?.map((track) => (
              <Combobox.Option key={track.id} value={track.id}>
                {track.name}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
      </div>
      <button
        className="fixed h-16 w-16 m-2 lg:absolute bottom-0 lg:top-0 flex left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 justify-center items-center bg-green-400 rounded-full shadow-lg"
        aria-label="Create mixtape"
      >
        {plus}
      </button>
    </div>
  );
}
