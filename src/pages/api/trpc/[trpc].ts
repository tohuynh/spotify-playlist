// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next";

import { appRouter } from "../../../server/router";
import { createContext } from "../../../server/router/context";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createContext,
  responseMeta({ ctx, paths, type, errors }) {
    // only search path is public
    const allPublic = paths && paths.every((path) => path.includes("search"));
    // checking that no procedures errored
    const allOk = errors.length === 0;
    // checking we're doing a query request
    const isQuery = type === "query";

    if (ctx?.res && allPublic && allOk && isQuery) {
      // cache request for 1 day + revalidate once 30 minutes
      // is fresh for 30 minutes. after 30 minutes it's stale, but is allowed to reuse stale response for 1 day, while revalidating the response in the background
      const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
      const THIRTY_MINUTES_IN_SECONDS = 30 * 60;
      return {
        headers: {
          "cache-control": `s-maxage=${THIRTY_MINUTES_IN_SECONDS}, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
        },
      };
    }
    return {};
  },
  batching: {
    enabled: false,
  },
});
