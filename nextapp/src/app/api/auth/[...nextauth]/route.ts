import NextAuth, { NextAuthOptions } from "next-auth";
// import { Account, User as AuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import dbConnect from "@/lib/connectDB";
import UserModal from "@/models/user";
import { verifyPassword } from "@/utils/bcrypt";

const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        await dbConnect();
        try {
          const user = await UserModal.findOne({ email: credentials?.email });
          if (user) {
            const isPasswordCorrect = await verifyPassword(credentials ? credentials.password : "", user.password);
            if (isPasswordCorrect) {
              return user;
            }
          }
          return null
        } catch (err) {
          console.log(err);
          throw new Error("auth failed");
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
    // ...add more providers here
  ],
  callbacks: {
    async redirect(params) {
      console.log("redirect params", params)
      return params.baseUrl
    },
    async jwt({ token, trigger, session }) {
      // console.log("from jwt callback", token, trigger, session);
      if (trigger === "update") {
        token.email = session.email
      }
      return token
    },
    async signIn({ account, profile }) {
      if (!account) return false;
      if (account?.provider == "credentials") {
        return true;
      }
      if (account?.provider === "google") {
        if (!profile) return false
        console.log("what is profile", profile);
        const { picture } = profile as GoogleProfile
        try {
          await dbConnect();
          const existingUser = await UserModal.findOne({ email: profile.email });
          if (!existingUser) {
            await UserModal.create({ 
              email: profile.email, 
              username: profile.name, 
              picture: {
                url: picture, 
              },
              authType: "google" 
            });
            return true
          }
          return true
        } catch (error) {
          console.log(error);
          return false;
        }
      }
    },
    // session: async({ session, token }: { session: any, token: any}) => {
    //   console.log(token);
    //   if (session?.user) {
    //     session.user.id = token.sub;
    //   }
    //   return session
    // }
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };