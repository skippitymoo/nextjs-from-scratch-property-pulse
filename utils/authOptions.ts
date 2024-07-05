import connectDB from "@/config/database";
import User from "@/models/User";
import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    // Invoked on successful signin
    async signIn({ profile }) {
      // 1. Connect to database
      await connectDB();
      // 2. Check if use loggin in exists
      const userExists = await User.findOne({ email: profile?.email });
      // 3. If not, then add user to database
      if (!userExists) {
        // Truncate user name if too long
        const username = profile?.name?.slice(0, 20);

        await User.create({
          email: profile?.email,
          username,
          image: profile?.image,
        });
      }
      // 4. Return true to allow signin
      return true;
    },
    // Modifies the session object
    async session({ session }) {
      // 1. Get the user from the database
      const user = await User.findOne({ email: session.user?.email });
      // 2. Assign the user id to the session
      if (session?.user && user) {
        session.user.id = user._id.toString();
      }
      // 3. Return the session

      return session;
    },
  },
};
