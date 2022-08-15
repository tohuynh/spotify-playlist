import type { NextPage } from "next";
import Head from "next/head";
import AppBar from "../components/app-bar";
import { useSession } from "next-auth/react";
import NewPlaylist from "../components/new-playlist";
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
        <meta name="description" content="Create Spotify mixtapes" />
      </Head>
      <main className="min-h-screen bg-slate-50">
        <AppBar />
        <div className="p-4">{data ? <NewPlaylist /> : <Welcome />}</div>
      </main>
    </>
  );
};

export default Home;
