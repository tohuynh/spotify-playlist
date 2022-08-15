import { z } from "zod";
import { createSpotifyRouter } from "./spotify-router";

const API_BASE_URL = "https://api.spotify.com/v1";

export const spotifyRouter = createSpotifyRouter()
  .query("search", {
    input: z.object({
      q: z.string(),
      offset: z.number().min(0).max(1000),
      limit: z.number().min(0).max(50),
    }),
    output: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        albumName: z.string(),
        artists: z.array(z.string()),
      })
    ),
    async resolve({ ctx, input }) {
      if (!input.q.trim()) {
        return;
      }
      const res = await fetch(
        `${API_BASE_URL}/search?${new URLSearchParams({
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
          id: track.uri,
          name: track.name,
          albumName: track.album.name,
          artists: track.artists.map((artist: any) => artist.name),
        };
      });
      //console.log(tracks);
      return tracks;
    },
  })
  .query("getRecommendations", {
    input: z.object({
      trackSeeds: z.array(z.string()).min(1).max(5),
      limit: z.number().min(1).max(100),
    }),
    async resolve({ ctx, input }) {
      const res = await fetch(
        `${API_BASE_URL}/recommendations?${new URLSearchParams({
          seed_tracks: input.trackSeeds.join(","),
          limit: `${input.limit}`,
        })}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${ctx.session.accessToken}`,
          },
        }
      ).then((res) => res.json());
      return res.tracks;
    },
  })
  .mutation("createPlaylist", {
    input: z.object({
      ids: z.array(z.string()).min(1),
      name: z.string(),
      isPublic: z.boolean(),
      description: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const createPlaylistRes = await fetch(
        `${API_BASE_URL}/users/${ctx.session.user.id}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ctx.session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: input.name,
            public: input.isPublic,
            description: input.description,
          }),
        }
      ).then((res) => res.json());

      const playlistId = createPlaylistRes.id;
      console.log("my id", playlistId);

      const addTracksRes = await fetch(
        `${API_BASE_URL}/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ctx.session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            position: 0,
            uris: input.ids.map((id) => `spotify:track:${id}`),
          }),
        }
      ).then((res) => res.json());
    },
  });
