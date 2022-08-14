import { Combobox } from "@headlessui/react";
import { useRef, useState } from "react";
import { trpc } from "../utils/trpc";

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
  );
}
