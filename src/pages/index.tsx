import type { NextPage } from "next";
import Head from "next/head";
import AppBar from "../components/app-bar";
import { useSession } from "next-auth/react";
import NewPlaylist from "../components/new-playlist";
import Welcome from "../components/welcome";
import { Toaster } from "react-hot-toast";

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
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            success: {
              iconTheme: {
                primary: "#1db954",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#ffffff",
              },
            },
            ariaProps: {
              role: "status",
              "aria-live": "polite",
            },
          }}
        />
      </main>
    </>
  );
};

export default Home;
