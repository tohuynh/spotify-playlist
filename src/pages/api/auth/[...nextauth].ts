import NextAuth, { type NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.refreshToken = account.refresh_token
      }
      return token
    },
  },
  providers: [
    SpotifyProvider({
      authorization:
      "https://accounts.spotify.com/authorize?scope=playlist-modify-public",
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
