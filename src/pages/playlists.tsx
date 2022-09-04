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
          document.body.offsetHeight &&
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
                  <div className="p-4">
                    <a
                      className="block truncate text-lg font-semibold underline underline-offset-4 md:text-2xl"
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
