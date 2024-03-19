import { User } from "@/@types/user";
import jwt from "jsonwebtoken";

export const generateToken = (user: User) => {
  const secret = process.env.JWT_SECRET as string;
  const payload = {
    sub: user._id
  }
  const options = {
    expiresIn: "5d",
  };
  const token = jwt.sign(payload, secret, options)
  return token
}