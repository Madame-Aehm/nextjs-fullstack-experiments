import dbConnect from "@/lib/connectDB";
import UserModal from "@/models/user";
import { verifyPassword } from "@/utils/bcrypt";
import { generateToken } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 405 });
    }
    await dbConnect();
    const user = await UserModal.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Email not registered" }, { status: 404 });
    }
    const pwValid = await verifyPassword(password, user.password);
    if (!pwValid) {
      return NextResponse.json({ error: "Password doesn't match" }, { status: 405 });
    }
    const token = generateToken(user);
    return NextResponse.json(user, { status: 200, headers: { "Set-Cookie": `token=${token}` } });
  } catch (error) {
    return NextResponse.error();
  }
}