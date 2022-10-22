import type { NextPage } from "next";

import Layout from "../components/layout";
import Welcome from "../components/welcome";

const Home: NextPage = () => {
  return (
    <>
      <Layout
        title="Tiny Mixtape"
        description="Discover and Create Spotify Mixtapes"
      >
        <Welcome />
      </Layout>
    </>
  );
};

export default Home;
