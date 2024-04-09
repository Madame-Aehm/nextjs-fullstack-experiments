import mongoose from "mongoose";

const schema = new mongoose.Schema({
  email: { type: String, required: [true, "Email address is required"], unique: true },
  username: { type: String, required: [true, "You must provide a username"] },
  authType: { type: String, enum: ["credentials", "google"], required: true },
  password: { type: String, required: function() {
    return this.authType === "credentials"
  }},
  picture: { 
    url: { type: String, default: "/defaultProfile.png" },
    public_id: { type: String }
   }
});

const UserModal = mongoose.models.user || mongoose.model("user", schema);

export default UserModal