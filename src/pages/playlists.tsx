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
          limit: 1,
        },
      ],
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
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

  useEffect(() => {
    function onScroll(e: Event) {
      console.log(e);
    }
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  });

  if (status === "loading") {
    return null;
  }

  return (
    <>
      <Layout title="Tiny Mixtapes" description="Create Spotify mixtapes">
        {sessionData ? (
          <>
            {isFetching && !isFetchingNextPage && (
              <div className="flex justify-center">
                <Spinner isLoading={true} />
              </div>
            )}
            <div className="grid grid-cols-4">
              {playlists.map((playlist) => {
                return (
                  <div key={playlist.id} className="border border-red-900">
                    <Image
                      alt={`Covert of ${playlist.name}`}
                      src={playlist.image.url}
                      layout="fixed"
                      height={playlist.image.height}
                      width={playlist.image.width}
                    />
                    <a
                      className="block font-semibold text-2xl underline underline-offset-4 truncate"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={playlist.uri}
                    >
                      {playlist.name}
                    </a>
                    <div className="text-zinc-500 text-lg truncate">
                      {playlist.description}
                    </div>
                    <pre>{JSON.stringify(playlist.audioFeatures, null, 4)}</pre>
                  </div>
                );
              })}
            </div>
            <button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
              Fetch
            </button>
          </>
        ) : (
          <Welcome />
        )}
      </Layout>
    </>
  );
};

export default Playlists;
