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
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
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
