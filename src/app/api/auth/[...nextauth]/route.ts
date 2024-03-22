import NextAuth from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
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
        // console.log("credentials", credentials);
        await dbConnect();
        try {
          const user = await UserModal.findOne({ email: credentials?.email });
          if (user) {
            const isPasswordCorrect = await verifyPassword(credentials ? credentials.password : "", user.password);
            if (isPasswordCorrect) {
              return user;
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn(params: any) {   //{ user, account }: { user: ContextUser, account: Account }
      // console.log("params", params);
      // console.log("user in signIn", user, "account", account);
      if (params.account?.provider == "credentials") {
        return true;
      }
      // if (account?.provider == "github") {
      //   await connect();
      //   try {
      //     const existingUser = await User.findOne({ email: user.email });
      //     if (!existingUser) {
      //       const newUser = new User({
      //         email: user.email,
      //       });

      //       await newUser.save();
      //       return true;
      //     }
      //     return true;
      //   } catch (err) {
      //     console.log("Error saving user", err);
      //     return false;
      //   }
      // }
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };