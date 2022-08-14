import { z } from "zod";
import { createSpotifyRouter } from "./spotify-router";

const SEARCH_ENDPOINT = "https://api.spotify.com/v1/search";

export const spotifyRouter = createSpotifyRouter().query("search", {
  input: z.object({ q: z.string(), offset: z.number(), limit: z.number() }),
  output: z.array(
    z.object({
      trackId: z.string(),
      trackName: z.string(),
      albumName: z.string(),
      artists: z.array(z.string()),
    })
  ),
  async resolve({ ctx, input }) {
    if (!input.q.trim()) {
      return;
    }
    const res = await fetch(
      `${SEARCH_ENDPOINT}?${new URLSearchParams({
        q: input.q,
        type: "track",
        offset: `${input.offset}`,
        limit: `${input.limit}`,
      })}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ctx.session.accessToken}`,
        },
      }
    ).then((res) => res.json());
    const tracks = res.tracks.items.map((track: any) => {
      return {
        trackId: track.id,
        trackName: track.name,
        albumName: track.album.name,
        artists: track.artists.map((artist: any) => artist.name),
      };
    });
    console.log(tracks);
    return tracks;
  },
});
