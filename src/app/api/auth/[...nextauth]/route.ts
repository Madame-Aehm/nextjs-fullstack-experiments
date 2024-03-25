import NextAuth, { Profile } from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import dbConnect from "@/lib/connectDB";
import UserModal from "@/models/user";
import { verifyPassword } from "@/utils/bcrypt";
import { ContextUser } from "@/@types/user";

export const authOptions: any = {
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
        } catch (err: any) {
          throw new Error(err);
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
    async signIn({ user, account, profile }: { user: AuthUser, account: Account, profile: GoogleProfile }) {
      // console.log("what is user", user);
      // console.log("what is account", account);
      console.log("what is profile", profile);
      if (account?.provider == "credentials") {
        return true;
      }
      if (account.provider === "google") {
        console.log("we are here")
        try {
          await dbConnect();
          const existingUser = await UserModal.findOne({ email: profile.email });
          if (!existingUser) {
            await UserModal.create({ 
              email: profile.email, 
              username: profile.name, 
              picture: profile.picture, 
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

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };