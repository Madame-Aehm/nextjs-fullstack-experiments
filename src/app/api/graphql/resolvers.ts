import { loginValues, signUpValues } from "@/@types/user";
import dbConnect from "@/lib/connectDB";
import UserModal from "@/models/user";
import { verifyPassword } from "@/utils/bcrypt";
import { generateToken } from "@/utils/jwt";
import { GraphQLError } from "graphql";
import { MyContext } from "./route";
import { cookies } from "next/headers";

const resolvers = {
  Query: {
    users: async () => {
      try {
        await dbConnect();
        const users = await UserModal.find({});
        return users
      } catch (error) {
        console.log(error);
      }
    }
  },
  Mutation: {
    signUp: async (_: undefined, args: signUpValues) => {
      try {
        await dbConnect();
        const newUser = await UserModal.create(args.signUpValues);
        if (!newUser) {
          return new GraphQLError("User couldn't be created");
        }
        const token = generateToken(newUser);
        return { token, user: newUser }
      } catch (error) {
        console.log(error);
        let { message } = error as Error
        if (message.includes("E11000")) message = "Already registered";
        return new GraphQLError(message ? message : "Something went wrong");
      }
    },
    login: async (_: undefined, args: loginValues, contextValue: MyContext) => {
      try {
        await dbConnect();
        const user = await UserModal.findOne({ email: args.loginValues.email });
        if (!user) {
          return new GraphQLError("Not registered");
        }
        const pwValid = await verifyPassword(args.loginValues.password, user.password);
        if (!pwValid) {
          return new GraphQLError("Passwords don't match");
        }
        const token = generateToken(user);
        cookies().set("token", token);
        return user
      } catch (error) {
        console.log(error);
        let { message } = error as Error
        return new GraphQLError(message ? message : "Something went wrong");
      }
    }
  }
};

export default resolvers