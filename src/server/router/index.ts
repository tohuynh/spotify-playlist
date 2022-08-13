// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { playlistRouter } from "./playlist";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("spotify.", playlistRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
