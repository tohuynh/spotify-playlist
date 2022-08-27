import type { NextPage } from "next";
import { useSession } from "next-auth/react";

import Layout from "../components/layout";
import NewPlaylist from "../components/new-playlist";
import Welcome from "../components/welcome";

const Home: NextPage = () => {
  const { data, status } = useSession();
  if (status === "loading") {
    return null;
  }

  return (
    <>
      <Layout title="Tiny Mixtapes" description="Create Spotify mixtapes">
        {data ? <NewPlaylist /> : <Welcome />}
      </Layout>
    </>
  );
};

export default Home;
