import { ContextUser } from "@/@types/user";
import mongoose from "mongoose";

const schema = new mongoose.Schema<ContextUser>({
  email: { type: String, required: [true, "Email address is required"], unique: true },
  username: { type: String, required: [true, "You must provide a username"] },
  authType: { type: String, enum: ["credentials", "google"], required: true },
  password: { type: String, required: function() {
    return this.authType === "credentials"
  }},
  picture: { 
    url: { type: String, default: "/defaultProfile.png" },
    public_id: { type: String, required: function() { 
      return this.picture.url !== "/defaultProfile.png"
     } }
   }
});

const UserModal = mongoose.models.user || mongoose.model<ContextUser>("user", schema);

export default UserModal