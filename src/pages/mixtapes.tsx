import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ChangeEventHandler, useEffect, useState } from "react";

import Layout from "../components/layout";
import SpotifyIcon from "../components/spotify-icon";
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
    <Layout title="Tiny Mixtape" description="Discover Spotify mixtapes">
      {sessionData ? (
        <div className="flex flex-col gap-4 pt-6">
          <label className="text-lg text-foreground">
            <input
              className="mr-2 h-5 w-5 accent-primary"
              type="checkbox"
              checked={isCreatorOnly}
              onChange={onToggleIsCreatorOnly}
            />
            Show only my mixtapes
          </label>
          <ul
            ref={listRef}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10 2xl:grid-cols-4 2xl:gap-14"
          >
            {playlists?.map((playlist) => {
              const hasAudioFeatures = Object.values(
                playlist.audioFeatures
              ).every((val) => val !== 0);
              return (
                <li
                  className="relative rounded-md bg-background"
                  key={playlist.id}
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      className="rounded-t-md"
                      alt={`Cover art of ${playlist.name}`}
                      src={playlist.image.url}
                      layout="fill"
                    />
                  </div>
                  <div className="p-4">
                    <a
                      className="block truncate px-1 text-lg font-semibold text-primary underline underline-offset-2 before:absolute before:inset-0 before:content-[''] md:text-2xl"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={playlist.uri}
                      title={playlist.name}
                    >
                      {playlist.name}
                    </a>
                    <div
                      className="truncate text-sm text-foreground/60 md:text-base"
                      title={playlist.description}
                    >
                      {playlist.description}
                    </div>
                    {hasAudioFeatures && (
                      <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-1">
                        <label
                          className="text-xs text-foreground/70 sm:text-sm"
                          htmlFor="energy"
                        >
                          Intensity:
                        </label>
                        <meter
                          className="h-2 w-full"
                          id="energy"
                          min={0}
                          max={100}
                          value={playlist.audioFeatures.energy}
                        />
                        <label
                          className="text-xs text-foreground/70 sm:text-sm"
                          htmlFor="danceability"
                        >
                          Danceability:
                        </label>
                        <meter
                          className="h-2 w-full"
                          id="danceability"
                          min={0}
                          max={100}
                          value={playlist.audioFeatures.danceability}
                        />
                        <label
                          className="text-xs text-foreground/70 sm:text-sm"
                          htmlFor="valence"
                        >
                          Positivity:
                        </label>
                        <meter
                          className="h-2 w-full"
                          id="valence"
                          min={0}
                          max={100}
                          value={playlist.audioFeatures.valence}
                        />
                        <div className="col-span-full text-xs text-foreground/70 sm:text-sm">
                          <span>Beats per minute:</span>
                          <span className="ml-1 font-semibold">
                            {playlist.audioFeatures.tempo}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="grid justify-end">
                      <span className="pt-2">
                        <SpotifyIcon heightClass="h-5" widthClass="w-5" />
                      </span>
                    </div>
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
