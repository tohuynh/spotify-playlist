import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import Layout from "../components/layout";
import Spinner from "../components/new-playlist/spinner";
import Welcome from "../components/welcome";
import { inferQueryOutput, trpc } from "../utils/trpc";

type Playlists = inferQueryOutput<"spotify.getPlaylists">["items"];

const Playlists: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const [playlists, setPlaylists] = useState<Playlists>([]);
  const { fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    trpc.useInfiniteQuery(
      [
        "spotify.getPlaylists",
        {
          limit: 5,
        },
      ],
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
          console.log(playlists);
          console.log(data);
          const lastPage = data.pages.at(-1);
          if (lastPage && playlists.length < lastPage.total) {
            if (data.pages.length == 1) {
              setPlaylists([...lastPage.items]);
            } else {
              setPlaylists((prev) => [...prev, ...lastPage.items]);
            }
          }
        },
      }
    );
  const [listRef] = useAutoAnimate<HTMLDivElement>();

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
            <Spinner isLoading={isFetching && !isFetchingNextPage} />
          </div>
          <div
            ref={listRef}
            className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4"
          >
            {playlists.map((playlist) => {
              return (
                <div className="bg-white" key={playlist.id}>
                  <div className="relative aspect-video w-full">
                    <Image
                      alt={`Covert of ${playlist.name}`}
                      src={playlist.image.url}
                      layout="fill"
                    />
                  </div>
                  <div className="p-4 pt-2">
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
                    <div className="mt-4 grid grid-cols-1 gap-1">
                      <label className="block">
                        Intensity:
                        <input
                          readOnly
                          className="w-full accent-spotify-green outline-none"
                          type="range"
                          min={0}
                          max={100}
                          value={playlist.audioFeatures.energy}
                        />
                      </label>
                      <label className="block">
                        Danceability:
                        <input
                          readOnly
                          className="w-full accent-spotify-green outline-none"
                          type="range"
                          min={0}
                          max={100}
                          value={playlist.audioFeatures.danceability}
                        />
                      </label>
                      <label className="block">
                        Positivity:
                        <input
                          readOnly
                          className="w-full accent-spotify-green outline-none"
                          type="range"
                          min={0}
                          max={100}
                          value={playlist.audioFeatures.valence}
                        />
                      </label>
                      <div>
                        {`Beats per minute: ${playlist.audioFeatures.tempo}`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <Welcome />
      )}
    </Layout>
  );
};

export default Playlists;
