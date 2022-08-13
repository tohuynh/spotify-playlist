import * as trpc from "@trpc/server";
import { createRouter } from "./context";

/**
 * Creates a tRPC router that asserts all queries and mutations are from an authorized user. Will throw an unauthorized error if a user is not signed in.
 */
export function createProtectedRouter() {
  return createRouter().middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
    }
    if (!ctx.req) {
      throw new trpc.TRPCError({ code: "UNAUTHORIZED", message: "Not a Next request" });
    }
    return next({
      ctx: {
        res: ctx.res,
        // infers that `session` and `req` is non-nullable to downstream resolvers
        req: ctx.req,
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });
}
