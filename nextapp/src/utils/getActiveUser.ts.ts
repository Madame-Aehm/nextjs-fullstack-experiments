import jwt from "jsonwebtoken"
import { User } from "@/@types/user";
import { cookies } from "next/headers";
import UserModal from "@/models/user";

const getActiveUser = async(): Promise<User | null> => {
  const cookie = cookies().get("token");
  if (!cookie) return null
  const token = cookie.value;
  const verified = jwt.verify(token, process.env.JWT_SECRET || "");
  try {
    const user = await UserModal.findById(verified.sub);
    return user
  } catch (error) {
    cookies().delete("token");
    return null
  }
}

export default getActiveUser