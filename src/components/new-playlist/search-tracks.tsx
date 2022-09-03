import { Combobox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import debounce from "lodash.debounce";
import { Dispatch, Fragment, useMemo, useState } from "react";

import { PlaylistTrack } from "../../server/router/output-types";
import { trpc } from "../../utils/trpc";
import Status from "../status";
import { UserAction, UserActionType } from "./new-playlist-state";

type Props = {
  placeholderText: string;
  disabled: boolean;
  onSelectUserActionType:
    | UserActionType.ADD_TRACK
    | UserActionType.SELECT_TRACK;
  dispatchUserAction: Dispatch<UserAction>;
};
export default function SearchTracks({
  placeholderText,
  disabled,
  onSelectUserActionType,
  dispatchUserAction,
}: Props) {
  const [selected, setSelected] = useState<PlaylistTrack | undefined>(
    undefined
  );
  const [query, setQuery] = useState("");
  const { data, status, error, isSuccess } = trpc.useQuery(
    ["spotify.search", { q: query, offset: 0, limit: 5 }],
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000 /**5 mins */,
      retry: false,
    }
  );

  const handleSearch = useMemo(
    () =>
      debounce((q: string) => {
        setSelected(undefined);
        setQuery(q);
      }, 100),
    []
  );

  const onSelectTrack = (track: PlaylistTrack) => {
    dispatchUserAction({ type: onSelectUserActionType, payload: track });
    setSelected(track);
  };

  return (
    <Combobox value={selected} onChange={onSelectTrack} disabled={disabled}>
      <div className="relative">
        <div className="relative cursor-default overflow-hidden rounded-md bg-white">
          <Combobox.Input
            className="h-14 w-full truncate py-2 px-10 text-base outline-none disabled:cursor-not-allowed md:text-lg lg:px-14"
            displayValue={(track: PlaylistTrack) =>
              track ? `${track.name} • ${track.artists.join(", ")}` : query
            }
            onChange={(e) => handleSearch(e.target.value)}
            title={placeholderText}
            placeholder={placeholderText}
          />
          <div className="absolute inset-y-0 left-0 flex items-center px-2">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-zinc-400"
              aria-hidden
            />
          </div>
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-zinc-400" aria-hidden />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options
            className={`${
              query.trim().length === 0 ? "py-0" : "py-2"
            } absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-md sm:text-sm lg:text-base`}
          >
            {isSuccess ? (
              <>
                {data.map((track) => (
                  <Combobox.Option
                    key={track.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 text-zinc-700 ${
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
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 text-spotify-green`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))}
              </>
            ) : (
              <li className="pl-10 pr-4">
                <Status
                  isVisible={!isSuccess}
                  status={status}
                  heightClass="w-5"
                  widthClass="w-5"
                  errorMessage={error?.message}
                />
              </li>
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
