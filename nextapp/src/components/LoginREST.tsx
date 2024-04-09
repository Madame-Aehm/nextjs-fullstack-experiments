'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { User } from "@/@types/user"

type NotOk = {
  error: string
}

const LoginREST = () => {
  const router = useRouter();
  const [inputValues, setInputValues] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async() => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/rest/users/login", { method: "POST", body: JSON.stringify(inputValues) });
      console.log(response);
      if (!response.ok) {
        const result = await response.json() as NotOk;
        console.log(result);
        setError(result.error);
        setLoading(false);
      }
      const result = await response.json() as User;
      console.log(result);
      router.replace("/");
    } catch (error) {
      const { message } = error as Error;
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Login REST</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}>
        <input type="email" placeholder="email" onChange={(e) => setInputValues({ ...inputValues, email: e.target.value })} />
        <input type="password" placeholder="password" onChange={(e) => setInputValues({ ...inputValues, password: e.target.value })} />
        { loading ? <button>Loading...</button> : <button type="submit">Login</button> }
      </form>
      { error && <small style={{ color: "red" }}>{ error }</small> }
    </div>
  )
}

export default LoginREST