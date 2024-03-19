import dbConnect from "@/lib/connectDB";
import UserModal from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, username } = await req.json()
    if (!id) {
      return NextResponse.json({ error: "Id is required" }, { status: 404 });
    }
    await dbConnect();
    const user = await UserModal.findByIdAndUpdate(id, {
      username
    }, { new: true });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.error();
  }
}