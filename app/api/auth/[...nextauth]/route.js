import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

async function login(credentials) {
  try {
    connectMongoDB();
    const foundUser = await User.findOne({ email: credentials.email });
    if (!foundUser) throw new Error("User not found!");
    const passwordIsCorrect = await bcrypt.compare(
      credentials.password,
      foundUser.password
    );
    if (!passwordIsCorrect) throw new Error("Incorrecr password");

    return foundUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const user = await login(credentials);
        try {
          return user;
        } catch (error) {
          console.log(user);

          throw new Error("Failed to log in");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user._id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
