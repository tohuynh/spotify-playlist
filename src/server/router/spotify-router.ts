import * as trpc from "@trpc/server";
import { getToken } from "next-auth/jwt";

import { env } from "../../env/server.mjs";
import { createProtectedRouter } from "./protected-router";

const SPOTIFY_ACCESS_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SPOTIFY_AUTHORIZATION = Buffer.from(
  `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
).toString("base64");

/**
 *
 * Creates a tRPC router that populate `session` with an Spotify API access token
 */
export function createSpotifyRouter() {
  return createProtectedRouter().middleware(async ({ ctx, next }) => {
    // get the refresh token
    const jwt = await getToken(ctx);
    if (!jwt) {
      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
        message: "No JWT found",
      });
    }
    const refreshToken = jwt.refreshToken as string;

    // See doc: https://developer.spotify.com/documentation/general/guides/authorization/code-flow/
    try {
      // get the access token
      const response = await fetch(SPOTIFY_ACCESS_TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Basic ${SPOTIFY_AUTHORIZATION}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      });
      const token = await response.json();
      if (token == null || token.access_token == null) {
        throw new Error("No access token found");
      }
      const accessToken = token.access_token as string;
      const userId = jwt.sub as string;
      const user = { ...ctx.session.user, id: userId };

      return next({
        ctx: {
          ...ctx,
          // infers that `accessToken`` is non-nullable to downstream resolvers
          session: { ...ctx.session, accessToken, user },
        },
      });
    } catch (e) {
      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
        message: "Unable to get access_token from Spotify",
      });
    }
  });
}
