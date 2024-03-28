'use client'

import { convertToBase64 } from '@/utils/convertToBase64';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react'

type Props = {
  signUp: (email: string, password: string, username: string, base64?: string) => Promise<{
    success: boolean;
    message: string;
  }>
}

const SignUpForm = ({ signUp }: Props) => {
  const [inputValues, setInputValues] = useState({
    email: "", password: "", username: "", picture: ""
  })
  const handleChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | undefined = e.target.value;
    if (e.target.name === "picture") {
      const file = e.target.files ? e.target.files[0] : null;
      if (file) {
        const base64 = await convertToBase64(file);
        console.log(base64)
        if (typeof base64 === "string") value = base64;
        else value = undefined
      }
    }
    setInputValues(prev => {
      return {
        ...prev,
        [e.target.name]: value
      }
    })
  }
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("values before submission", inputValues)
    try {
      const signedUp = await signUp(inputValues.email, inputValues.password, inputValues.username, inputValues.picture);
      if (signedUp.success) {
        await signIn("credentials", {
          email: inputValues.email,
          password: inputValues.password,
          callbackUrl: "/"
        })
      }
      else alert(signedUp.message)
    } catch (error) {
      console.log(error);
      alert("Something went wrong...")
    }
  }
  return (
    <>
      <h1>Sign Up</h1>
      {/* <form action={signUp}> */}
      <form onSubmit={(e) => handleSubmit(e)}>
        <input type='email' name="email" placeholder='email' onChange={handleChange} />
        <input type="password" name="password" placeholder='password' onChange={handleChange} />
        <input placeholder='username' name="username" onChange={handleChange} />
        <input type='file' name='picture' onChange={handleChange} />
        <button type="submit">Sign up</button>
      </form>
    </>
  )
}

export default SignUpForm