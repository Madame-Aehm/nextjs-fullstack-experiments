import LoginGQL from "@/components/LoginGQL"
import LoginNextAuth from "@/components/LoginNextAuth";
import LoginREST from "@/components/LoginREST";


const page = () => {
  return (
    <div>
      <LoginGQL />
      <LoginREST />
      <LoginNextAuth />
    </div>
  )
}

export default page