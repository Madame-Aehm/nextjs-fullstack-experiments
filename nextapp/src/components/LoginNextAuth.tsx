'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { signIn } from "next-auth/react"
import useGetActiveUser from "./useGetActiveUser"

const LoginNextAuth = () => {
  const router = useRouter();
  const { refetch } = useGetActiveUser();
  const [inputValues, setInputValues] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async() => {
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email: inputValues.email,
        password: inputValues.password
      })
      console.log(result);
      if (!result) {
        setError("Something went wrong");
        setLoading(false);
        return
      }
      if (result?.error) {
        setError("Credentials don't match");
        setLoading(false);
        return
      }
      refetch();
      router.replace("/");
    } catch (error) {
      const { message } = error as Error;
      setError(message);
      setLoading(false);
    }
  }

  const handleGoogleAuth = async() => {
    try {
      const result = await signIn("google");
      refetch();
      console.log("we did it", result);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>Login Next-Auth</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}>
        <input type="email" placeholder="email" onChange={(e) => setInputValues({ ...inputValues, email: e.target.value })} />
        <input type="password" placeholder="password" onChange={(e) => setInputValues({ ...inputValues, password: e.target.value })} />
        { loading ? <button>Loading...</button> : <button type="submit">Login</button> }
      </form>
      <button style={{ margin: "1rem" }} onClick={() => handleGoogleAuth()}>Login with Google</button>
      { error && <small style={{ color: "red" }}>{ error }</small> }
    </div>
  )
}

export default LoginNextAuth