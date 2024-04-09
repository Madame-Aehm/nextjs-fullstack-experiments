import dbConnect from "@/lib/connectDB";
import UserModal from "@/models/user";

export async function GET() {
  try {
    await dbConnect();
    const users = await UserModal.find({});
    return Response.json(users);
  } catch (error) {
    return Response.json({ error: "Server error" });
  }
}