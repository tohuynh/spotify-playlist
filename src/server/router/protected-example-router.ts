import { createProtectedRouter } from "./protected-router";

const SPOTIFY_GET_PLAYLISTS_ENDPOINT =
  "https://api.spotify.com/v1/me/playlists";

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedExampleRouter = createProtectedRouter().query(
  "getSession",
  {
    async resolve({ ctx }) {
      const res = await fetch(SPOTIFY_GET_PLAYLISTS_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${ctx.session.accessToken}`,
        },
      }).then((res) => res.json());
      console.log("playlists", res);
      return res;
    },
  }
);
