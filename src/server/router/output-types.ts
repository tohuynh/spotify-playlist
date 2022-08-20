import { z } from "zod";
import { ArrayElement } from "../../types/utility-types";
import { inferQueryOutput } from "../../utils/trpc";

export const PlaylistTracksSchema = z.array(
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
    danceability: z.number().min(0).max(100).optional(),
    instrumentalness: z.number().min(0).max(100).optional(),
    valence: z.number().min(0).max(100).optional(),
    energy: z.number().min(0).max(100).optional(),
  })
);

export type TrackSeed = ArrayElement<inferQueryOutput<"spotify.search">>;

export type PlaylistTrack = ArrayElement<
  inferQueryOutput<"spotify.getRecommendations">
>;

export type AudioFeatures = Pick<
  PlaylistTrack,
  "danceability" | "instrumentalness" | "valence" | "energy"
>;
