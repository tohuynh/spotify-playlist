import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

import Layout from "../components/layout";
import Spinner from "../components/new-playlist/spinner";
import Welcome from "../components/welcome";
import { inferQueryOutput, trpc } from "../utils/trpc";

type Playlists = inferQueryOutput<"spotify.getPlaylists">["items"];

const Playlists: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    trpc.useInfiniteQuery(
      [
        "spotify.getPlaylists",
        {
          limit: 20,
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
  const [listRef] = useAutoAnimate<HTMLUListElement>();

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
        <>
          <div className="flex justify-center py-4">
            <Spinner
              isLoading={
                isFetching && !isFetchingNextPage && data?.pages.length === 0
              }
            />
          </div>
          <ul
            ref={listRef}
            className="grid grid-cols-1 gap-20 md:grid-cols-2 2xl:grid-cols-4"
          >
            {playlists?.map((playlist) => {
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
                    <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                      <label className="text-sm text-zinc-700" htmlFor="energy">
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
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <Welcome />
      )}
    </Layout>
  );
};

export default Playlists;
