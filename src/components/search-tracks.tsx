import { Fragment, useCallback, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon, SearchIcon } from "@heroicons/react/solid";
import { ArrayElement } from "../types/utility-types";
import debounce from "lodash.debounce";
import { inferQueryOutput, trpc } from "../utils/trpc";

type Track = ArrayElement<inferQueryOutput<"spotify.search">>;

export default function SearchTracks() {
  const [selected, setSelected] = useState();
  const [query, setQuery] = useState("");
  const searchQuery = trpc.useQuery([
    "spotify.search",
    { q: query, offset: 0, limit: 5 },
  ]);

  const handleSearch = useCallback(
    debounce((q: string) => setQuery(q), 200),
    []
  );

  const { data, status } = searchQuery;

  const options =
    status === "error" || (status === "success" && data.length === 0) ? (
      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
        Nothing found.
      </div>
    ) : (
      <>
        {data?.map((track) => (
          <Combobox.Option
            key={track.id}
            className={({ active }) =>
              `relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900 ${
                active ? "bg-gray-100" : "bg-white"
              }`
            }
            value={track}
          >
            {({ selected }) => (
              <>
                <span
                  className={`block truncate ${
                    selected ? "font-medium" : "font-normal"
                  }`}
                >
                  {`${track.name} • ${track.artists.join(", ")}`}
                </span>
                {selected && (
                  <span
                    className={`absolute inset-y-0 left-0 flex items-center pl-3 text-green-700`}
                  >
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                )}
              </>
            )}
          </Combobox.Option>
        ))}
      </>
    );

  return (
    <Combobox value={selected} onChange={setSelected}>
      <Combobox.Label className="text-lg">
        Select up to 5 tracks to generate a mixtape:
      </Combobox.Label>
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className="w-full border-none py-2 pl-10 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            displayValue={(track: Track) => (track ? track.name : "")}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center px-2">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden />
          </div>
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => handleSearch("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
