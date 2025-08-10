import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { upsertUser, getUserByEmail } from "@/lib/database";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Upsert user in our database
          await upsertUser({
            email: user.email!,
            name: user.name!,
            image: user.image!,
          });
        } catch (error) {
          console.error("Error syncing user to database:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        // Get user from our database to include our custom ID
        const dbUser = await getUserByEmail(session.user.email);

        if (dbUser) {
          return {
            ...session,
            user: {
              ...session.user,
              id: dbUser.id,
            },
          };
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export { handler as GET, handler as POST };
