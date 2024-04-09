import { loginValues, signUpValues, updatableValues } from "@/@types/user";
import dbConnect from "@/lib/connectDB";
import UserModal from "@/models/user";
import { verifyPassword } from "@/utils/bcrypt";
import { generateToken } from "@/utils/jwt";
import { GraphQLError } from "graphql";
import { MyContext } from "./route";
import { cookies } from "next/headers";
import cloudinary from "@/config/cloudinary";
import { SavedMessage, messageValuesType } from "@/@types/message";
import MessageModal from "@/models/message";


const resolvers = {
  Message: {
    sent: async(parent: SavedMessage) => {
      try {
        await dbConnect();
        const user = UserModal.findById(parent.sent).select("-password");
        return user
      } catch (error) {
        console.log(error);
        const { message } = error as Error
        return new GraphQLError(message ? message : "Something went wrong");
      }
    }
  },
  Query: {
    messages: async (_: undefined, args: { chatId: string, length?: number }, contextValue: MyContext) => {
      try {
        await dbConnect();
        const messages = MessageModal.find({ chatId: args.chatId }).sort({ createdAt: 1 });
        return messages;
      } catch (error) {
        console.log(error);
        const { message } = error as Error
        return new GraphQLError(message ? message : "Something went wrong");
      }
    },
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
      console.log("getMe", contextValue)
      if (!contextValue.session?.user) {
        return new GraphQLError("You must be logged in to do this");
      }
      try {
        await dbConnect();
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
    sendMessage: async(_: undefined, args: messageValuesType) => {
      try {
        await dbConnect();
        const message = await MessageModal.create(args.messageValues);
        return message
      } catch (error) {
        console.log(error);
        const { message } = error as Error
        return new GraphQLError(message ? message : "Something went wrong");
      }
    },
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
      if (!contextValue.session?.user) {
        return new GraphQLError("You must be logged in to do this");
      }
      const { email, username, picture } = args.updatableValues;
      if (!email || !username) {
        return new GraphQLError("Email and/or Username can't be empty");
      }
      try {
        const user = await UserModal.findOne({ email: contextValue.session.user.email });
        if (!user) new GraphQLError("No user could be found...");
        if (email !== user.email && user.authType !== "credentials") {
          return new GraphQLError(`Cannot overwrite email from ${user.authType} account`);
        }

        const newPicture = { ...user.picture };
        if (picture.includes("data:image/jpeg;base64,")) {
          const uploaded = await cloudinary.uploader.upload(picture, { folder: "travelbuddy" });
          if (user.picture.public_id) await cloudinary.uploader.destroy(user.picture.public_id);
          newPicture.url = uploaded.secure_url;
          newPicture.public_id = uploaded.public_id;
        }
        
        user.email = email;
        user.username = username;
        user.picture = newPicture;

        await user.save();

        return user
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