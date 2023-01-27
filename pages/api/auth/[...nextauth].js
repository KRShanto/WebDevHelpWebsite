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

  // Set a `id` property on the session to use as a unique identifier instead of using the email address.
  // This is useful if we want to use a different property to identify the user, such as a username.
  callbacks: {
    session: async (session) => {
      if (session?.user) {
        session.session.user._id = session.user.id;
      }
      return session.session;
    },
  },
};

export default NextAuth(authOptions);
