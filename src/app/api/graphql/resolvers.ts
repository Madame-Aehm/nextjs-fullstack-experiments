import { loginValues, signUpValues, updatableValues } from "@/@types/user";
import dbConnect from "@/lib/connectDB";
import UserModal from "@/models/user";
import { verifyPassword } from "@/utils/bcrypt";
import { generateToken } from "@/utils/jwt";
import { GraphQLError } from "graphql";
import { MyContext } from "./route";
import { cookies } from "next/headers";


const resolvers = {
  Query: {
    users: async (_: undefined, __: {}, contextValue: MyContext ) => {
      try {
        await dbConnect();
        const users = await UserModal.find({});
        return users
      } catch (error) {
        console.log(error);
        const { message } = error as Error
        return new GraphQLError(message ? message : "Something went wrong");
      }
    },
    getMe: async (_: undefined, __: {}, contextValue: MyContext) => {
      if (!contextValue.session?.user) {
        return new GraphQLError("You must be logged in to do this");
      }
      try {
        const user = await UserModal.findOne({ email: contextValue.session.user.email });
        return user
      } catch (error) {
        console.log(error);
        const { message } = error as Error
        return new GraphQLError(message ? message : "Something went wrong");
      }
    }
  },
  Mutation: {
    signUp: async (_: undefined, args: signUpValues) => {
      try {
        await dbConnect();
        const newUser = await UserModal.create({ ...args.signUpValues, authType: "credentials" });
        if (!newUser) {
          return new GraphQLError("User couldn't be created");
        }
        // const token = generateToken(newUser);
        // return { token, user: newUser }
        return newUser
      } catch (error) {
        console.log(error);
        let { message } = error as Error
        if (message.includes("E11000")) message = "Already registered";
        return new GraphQLError(message ? message : "Something went wrong");
      }
    },
    updateProfile: async (_: undefined, args: updatableValues, contextValue: MyContext) => {
      console.log(contextValue)
      if (!contextValue.session?.user) {
        return new GraphQLError("You must be logged in to do this");
      }
      try {
        const updatedUser = await UserModal.findOneAndUpdate(
          { email: contextValue.session.user.email }, 
          { ...args.updatableValues },
          { new: true }
        );
        if (!updatedUser) {
          return new GraphQLError("User couldn't be updated");
        }
        // find a way to refresh session 
        return updatedUser
      } catch (error) {
        console.log(error);
        const { message } = error as Error
        return new GraphQLError(message ? message : "Something went wrong");
      }
    },
    login: async (_: undefined, args: loginValues) => {
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
        const { message } = error as Error
        return new GraphQLError(message ? message : "Something went wrong");
      }
    }
  }
};

export default resolvers