import * as trpc from "@trpc/server";
import { getToken } from "next-auth/jwt";
import { createRouter } from "./context";
import { env } from "../../env/server.mjs";

const SPOTIFY_ACCESS_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SPOTIFY_AUTHORIZATION = Buffer.from(
  `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
).toString("base64");

/**
 * Creates a tRPC router that asserts all queries and mutations are from an authorized user. Will throw an unauthorized error if a user is not signed in.
 */
export function createProtectedRouter() {
  return createRouter()
    .middleware(({ ctx, next }) => {
      if (!ctx.session || !ctx.session.user || !ctx.req) {
        throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
      }
      return next({
        ctx: {
          res: ctx.res,
          // infers that `session` and `req` is non-nullable to downstream resolvers
          req: ctx.req,
          session: { ...ctx.session, user: ctx.session.user },
        },
      });
    })
    .middleware(async ({ ctx, next }) => {
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

        return next({
          ctx: {
            ...ctx,
            // infers that `accessToken`` is non-nullable to downstream resolvers
            session: { ...ctx.session, accessToken },
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
