import mongoose from "mongoose";

const schema = new mongoose.Schema({
  email: { type: String, required: [true, "Email address is required"], unique: true },
  username: { type: String, required: [true, "You must provide a username"] },
  password: { type: String, required: [true, "You must provide a password"] }
});

const UserModal = mongoose.models.user || mongoose.model("user", schema);

export default UserModal