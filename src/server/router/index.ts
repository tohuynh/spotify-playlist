// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { spotifyRouter } from "./spotify";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("spotify.", spotifyRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
