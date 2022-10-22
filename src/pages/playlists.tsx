import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ChangeEventHandler, useEffect, useState } from "react";

import Layout from "../components/layout";
import Status from "../components/status";
import Welcome from "../components/welcome";
import { inferQueryOutput, trpc } from "../utils/trpc";

type Playlists = inferQueryOutput<"spotify.getPlaylists">["items"];

const PLAYLIST_BATCH_NUM = 20;

const Playlists: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const [isCreatorOnly, setIsCreatorOnly] = useState(false);
  const {
    data,
    status: getPlaylistsStatus,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    error,
    refetch,
  } = trpc.useInfiniteQuery(
    [
      "spotify.getPlaylists",
      {
        limit: PLAYLIST_BATCH_NUM,
        isCreatorOnly,
      },
    ],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    }
  );
  const playlists = data?.pages.reduce((acc, curr) => {
    return [...acc, ...curr.items];
  }, [] as Playlists);
  const totalCount = data?.pages[0]?.total;
  const [listRef] = useAutoAnimate<HTMLUListElement>();

  const onToggleIsCreatorOnly: ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsCreatorOnly(e.target.checked);
    refetch();
  };

  useEffect(() => {
    function onScroll() {
      if (
        window.innerHeight + Math.ceil(window.pageYOffset) >=
          document.body.offsetHeight - 100 &&
        hasNextPage &&
        !isFetching &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [hasNextPage, isFetching, isFetchingNextPage, fetchNextPage]);

  if (status === "loading") {
    return null;
  }

  return (
    <Layout title="Tiny Mixtapes" description="Discover Spotify mixtapes">
      {sessionData ? (
        <div className="flex flex-col gap-4 pt-6">
          <label className="text-lg text-zinc-800">
            <input
              className="mr-2 h-5 w-5 accent-spotify-green outline-none"
              type="checkbox"
              checked={isCreatorOnly}
              onChange={onToggleIsCreatorOnly}
            />
            Show only my mixtapes
          </label>
          <ul
            ref={listRef}
            className="grid grid-cols-1 gap-20 md:grid-cols-2 2xl:grid-cols-4"
          >
            {playlists?.map((playlist) => {
              const hasAudioFeatures = Object.values(
                playlist.audioFeatures
              ).every((val) => val !== 0);
              return (
                <li className="rounded-md bg-white" key={playlist.id}>
                  <div className="relative aspect-video w-full">
                    <Image
                      className="rounded-t-md"
                      alt={`Cover art of ${playlist.name}`}
                      src={playlist.image.url}
                      layout="fill"
                    />
                  </div>
                  <div className="relative p-4">
                    <span className="absolute top-6 right-0">
                      <svg
                        aria-hidden
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1333.33 1333.3"
                        shapeRendering="geometricPrecision"
                        textRendering="geometricPrecision"
                        imageRendering="optimizeQuality"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      >
                        <path
                          d="M666.66 0C298.48 0 0 298.47 0 666.65c0 368.19 298.48 666.65 666.66 666.65 368.22 0 666.67-298.45 666.67-666.65C1333.33 298.49 1034.88.03 666.65.03l.01-.04zm305.73 961.51c-11.94 19.58-37.57 25.8-57.16 13.77-156.52-95.61-353.57-117.26-585.63-64.24-22.36 5.09-44.65-8.92-49.75-31.29-5.12-22.37 8.84-44.66 31.26-49.75 253.95-58.02 471.78-33.04 647.51 74.35 19.59 12.02 25.8 37.57 13.77 57.16zm81.6-181.52c-15.05 24.45-47.05 32.17-71.49 17.13-179.2-110.15-452.35-142.05-664.31-77.7-27.49 8.3-56.52-7.19-64.86-34.63-8.28-27.49 7.22-56.46 34.66-64.82 242.11-73.46 543.1-37.88 748.89 88.58 24.44 15.05 32.16 47.05 17.12 71.46V780zm7.01-189.02c-214.87-127.62-569.36-139.35-774.5-77.09-32.94 9.99-67.78-8.6-77.76-41.55-9.98-32.96 8.6-67.77 41.56-77.78 235.49-71.49 626.96-57.68 874.34 89.18 29.69 17.59 39.41 55.85 21.81 85.44-17.52 29.63-55.89 39.4-85.42 21.8h-.03z"
                          fill="#1DB954"
                          fillRule="nonzero"
                        />
                      </svg>
                    </span>
                    <a
                      className="block truncate text-lg font-semibold text-blue-900 underline underline-offset-4 md:text-2xl"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={playlist.uri}
                    >
                      {playlist.name}
                    </a>
                    <div className="truncate text-sm text-zinc-500 md:text-base">
                      {playlist.description}
                    </div>
                    {hasAudioFeatures && (
                      <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                        <label
                          className="text-sm text-zinc-700"
                          htmlFor="energy"
                        >
                          Intensity:
                        </label>
                        <input
                          readOnly
                          className="accent-spotify-green"
                          id="energy"
                          type="range"
                          min={0}
                          max={100}
                          value={playlist.audioFeatures.energy}
                        />
                        <label
                          className="text-sm text-zinc-700"
                          htmlFor="danceability"
                        >
                          Danceability:
                        </label>
                        <input
                          readOnly
                          className="accent-spotify-green outline-none"
                          id="danceability"
                          type="range"
                          min={0}
                          max={100}
                          value={playlist.audioFeatures.danceability}
                        />
                        <label
                          className="text-sm text-zinc-700"
                          htmlFor="valence"
                        >
                          Positivity:
                        </label>
                        <input
                          readOnly
                          className="accent-spotify-green outline-none"
                          id="valence"
                          type="range"
                          min={0}
                          max={100}
                          value={playlist.audioFeatures.valence}
                        />
                        <div className="col-span-full text-sm text-zinc-700">
                          {`Beats per minute: ${playlist.audioFeatures.tempo}`}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <Status
            isVisible={true}
            status={getPlaylistsStatus}
            successMessage={
              totalCount === 0
                ? "No mixtapes found"
                : `Fetched ${playlists?.length} of ${totalCount} mixtapes`
            }
            errorMessage={error?.message}
          />
        </div>
      ) : (
        <Welcome />
      )}
    </Layout>
  );
};

export default Playlists;
