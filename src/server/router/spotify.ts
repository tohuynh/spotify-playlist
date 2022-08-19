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
        //albumName: z.string(),
        artists: z.array(z.string()),
      })
    ),
    async resolve({ ctx, input }) {
      let url = `${API_BASE_URL}/search?${new URLSearchParams({
        q: input.q,
        type: "track",
        offset: `${input.offset}`,
        limit: `${input.limit}`,
      })}`;
      if (!input.q.trim()) {
        url = `${API_BASE_URL}/me/top/tracks?${new URLSearchParams({
          limit: `${input.limit}`,
        })}`;
      }
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ctx.session.accessToken}`,
        },
      }).then((res) => res.json());
      const tracks = !input.q.trim() ? res.items : res.tracks.items;
      return tracks.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          artists: item.artists.map((artist: any) => artist.name),
        };
      });
    },
  })
  .query("getRecommendations", {
    input: z.object({
      trackSeeds: z.array(z.string()).max(5),
      limit: z.number().min(1).max(100),
    }),
    output: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        previewUrl: z.string().nullable(),
        artists: z.array(z.string()),
        albumName: z.string(),
        image: z.object({
          height: z.number(),
          width: z.number(),
          url: z.string(),
        }),
        duration: z.number(),
      })
    ),
    async resolve({ ctx, input }) {
      if (input.trackSeeds.length === 0) {
        return [];
      }
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

      return res.tracks.map((track: any) => {
        return {
          id: track.uri,
          name: track.name,
          previewUrl: track.preview_url,
          artists: track.artists.map((artist: any) => artist.name),
          albumName: track.album.name,
          image: track.album.images.at(-1),
          duration: track.duration_ms,
        };
      });
    },
  })
  .mutation("createPlaylist", {
    input: z.object({
      uris: z.array(z.string()).min(1),
      name: z.string(),
      isPublic: z.boolean(),
      description: z.string().optional(),
    }),
    output: z.object({
      name: z.string(),
      url: z.string(),
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

      await fetch(`${API_BASE_URL}/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ctx.session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          position: 0,
          uris: input.uris,
        }),
      }).then((res) => res.json());

      return {
        name: input.name,
        url: `https://open.spotify.com/playlist/${playlistId}`,
      };
    },
  });
