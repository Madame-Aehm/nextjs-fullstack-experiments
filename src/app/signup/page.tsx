import SignUpForm from "@/components/SignUpForm";
import UserModal from "@/models/user";
import { encryptPassword } from "@/utils/bcrypt";

const page = () => {
  const signUp = async(email: string, password: string, username: string) => {
    'use server'
    if (!email || !password || !username) return { success: false, message: "all fields are required" }
    try {
      const hashedPW = await encryptPassword(password);
      const newUser = await UserModal.create({ email, username, password: hashedPW, authType: "credentials" });
      if (!newUser) return { success: false, message: "User couldn't be created" }
      return { success: true, message: "User created!" }
    } catch (error) {
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