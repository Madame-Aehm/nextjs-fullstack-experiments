import SignUpForm from "@/components/SignUpForm";
import cloudinary from "@/config/cloudinary";
import dbConnect from "@/lib/connectDB";
import UserModal from "@/models/user";
import { encryptPassword } from "@/utils/bcrypt";

const page = () => {
  const signUp = async(email: string, password: string, username: string, base64?: string) => {
    'use server'
    if (!email || !password || !username) return { success: false, message: "Email, password, and username fields are required" }
    try {
      const hashedPW = await encryptPassword(password);
      let picture
      if (base64) {
        const result = await cloudinary.uploader.upload(base64, { folder: "travelbuddy" });
        picture = result;
      }
      await dbConnect();
      const newUser = await UserModal.create({ 
        email, 
        username, 
        password: hashedPW, 
        picture: {
          url: picture?.secure_url ? picture.secure_url : undefined,
          public_id: picture?.public_id ? picture.public_id : undefined
        }, 
        authType: "credentials" });
      if (!newUser) return { success: false, message: "User couldn't be created" }
      return { success: true, message: "User created!" }
    } catch (error) {
      console.log(error);
      const { message } = error as Error;
      return { success: false, message }
    }
  }

  return (
    <div>
      <SignUpForm signUp={signUp} />
    </div>
  )
}

export default page