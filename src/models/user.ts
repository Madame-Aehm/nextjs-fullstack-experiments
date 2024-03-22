import { ContextUser } from "@/@types/user";
import mongoose from "mongoose";

const schema = new mongoose.Schema<ContextUser>({
  email: { type: String, required: [true, "Email address is required"], unique: true },
  username: { type: String, required: [true, "You must provide a username"] },
  password: String
});

const UserModal = mongoose.models.user || mongoose.model<ContextUser>("user", schema);

export default UserModal