import { z } from "zod";
import { PlaylistTracksSchema } from "./output-types";
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
  .query("searchForPlaylistTrack", {
    input: z.object({
      q: z.string(),
      offset: z.number().min(0).max(1000),
      limit: z.number().min(0).max(50),
    }),
    output: PlaylistTracksSchema,
    async resolve({ ctx, input }) {
      if (!input.q.trim()) {
        return [];
      }
      let url = `${API_BASE_URL}/search?${new URLSearchParams({
        q: input.q,
        type: "track",
        offset: `${input.offset}`,
        limit: `${input.limit}`,
      })}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ctx.session.accessToken}`,
        },
      }).then((res) => res.json());
      return res.tracks.items.map((item: any) => {
        return {
          id: item.uri,
          name: item.name,
          artists: item.artists.map((artist: any) => artist.name),
          previewUrl: item.preview_url,
          albumName: item.album.name,
          image: item.album.images.at(-1),
          duration: item.duration_ms,
        };
      });
    },
  })
  .query("getRecommendations", {
    input: z.object({
      trackSeeds: z.array(z.string()).max(5),
      limit: z.number().min(1).max(100),
      danceability: z.number().min(0).max(100).optional(),
      instrumentalness: z.number().min(0).max(100).optional(),
      valence: z.number().min(0).max(100).optional(),
      energy: z.number().min(0).max(100).optional(),
    }),
    output: PlaylistTracksSchema,
    async resolve({ ctx, input }) {
      if (input.trackSeeds.length === 0) {
        return [];
      }

      const searchParams = new URLSearchParams({
        seed_tracks: input.trackSeeds.join(","),
        limit: `${100}`,
      });
      if (input.danceability !== undefined) {
        searchParams.append(
          "target_danceability",
          `${input.danceability / 100}`
        );
      }
      if (input.instrumentalness !== undefined) {
        searchParams.append(
          "target_instrumentalness",
          `${input.instrumentalness / 100}`
        );
      }
      if (input.valence !== undefined) {
        searchParams.append("target_valence", `${input.valence / 100}`);
      }
      if (input.energy !== undefined) {
        searchParams.append("target_energy", `${input.energy / 100}`);
      }

      const res = await fetch(
        `${API_BASE_URL}/recommendations?${searchParams}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${ctx.session.accessToken}`,
          },
        }
      ).then((res) => res.json());

      //get only previewable tracks
      const tracks = res.tracks
        .filter((track: any) => track.preview_url)
        .slice(0, input.limit);

      //get audio features of each track
      const audioFeaturesRes = await fetch(
        `${API_BASE_URL}/audio-features?${new URLSearchParams({
          ids: tracks.map((track: any) => track.id).join(","),
        })}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${ctx.session.accessToken}`,
          },
        }
      ).then((res) => res.json());

      return tracks.map((track: any, i: number) => {
        return {
          id: track.uri,
          name: track.name,
          previewUrl: track.preview_url,
          artists: track.artists.map((artist: any) => artist.name),
          albumName: track.album.name,
          image: track.album.images.at(-1),
          duration: track.duration_ms,
          danceability: Math.floor(
            audioFeaturesRes.audio_features[i].danceability * 100
          ),
          instrumentalness: Math.floor(
            audioFeaturesRes.audio_features[i].instrumentalness * 100
          ),
          valence: Math.floor(audioFeaturesRes.audio_features[i].valence * 100),
          energy: Math.floor(audioFeaturesRes.audio_features[i].energy * 100),
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
