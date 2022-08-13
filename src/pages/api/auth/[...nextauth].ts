import NextAuth, { type NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        console.log("jwt acc", account)
        token.refreshToken = account.refresh_token
      }
      return token
    },
  },
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      authorization:
      "https://accounts.spotify.com/authorize?scope=playlist-modify-public",
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
