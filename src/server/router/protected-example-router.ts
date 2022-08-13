import { getToken } from "next-auth/jwt";
import { createProtectedRouter } from "./protected-router";

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedExampleRouter = createProtectedRouter()
  .query("getSession", {
    async resolve({ ctx }) {
      const jwt = await getToken(ctx);
      console.log("get session", jwt)
      return ctx.session;
    },
  })
  .query("getSecretMessage", {
    resolve({ ctx }) {
      return "He who asks a question is a fool for five minutes; he who does not ask a question remains a fool forever.";
    },
  });
