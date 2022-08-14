import type { NextPage } from "next";
import Head from "next/head";
import AppBar from "../components/app-bar";
import { useSession } from "next-auth/react";
import CreatePlaylist from "../components/create-playlist";
import Welcome from "../components/welcome";

const Home: NextPage = () => {
  const { data, status } = useSession();
  if (status === "loading") {
    return null;
  }

  return (
    <>
      <Head>
        <title>Tiny Mixtapes</title>
        <meta name="description" content="Create Spotify Playlists" />
      </Head>
      <main className="min-h-screen">
        <AppBar />
        <div className="container mx-auto p-4">
          {data ? <CreatePlaylist /> : <Welcome />}
        </div>
      </main>
    </>
  );
};

export default Home;
