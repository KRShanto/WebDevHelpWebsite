import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../lib/clientPromise";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // TODO: add github and facebook
  ],
  adapter: MongoDBAdapter(clientPromise),
  theme: {
    colorScheme: "dark",
  },
};

export default NextAuth(authOptions);
