import { z } from "zod";

import { ArrayElement } from "../../types/utility-types";
import { inferQueryOutput } from "../../utils/trpc";

export const PlaylistTracksSchema = z.array(
  z.object({
    id: z.string(),
    uri: z.string(),
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
    tempo: z.number().optional(),
    valence: z.number().min(0).max(100).optional(),
    energy: z.number().min(0).max(100).optional(),
  })
);

export type PlaylistTrack = ArrayElement<
  inferQueryOutput<"spotify.getRecommendations">
>;

export type AudioFeatures = Pick<
  PlaylistTrack,
  "danceability" | "tempo" | "valence" | "energy"
>;
