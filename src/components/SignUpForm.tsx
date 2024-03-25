'use client'

import { signIn } from 'next-auth/react';
import React, { useState } from 'react'

type Props = {
  signUp: (email: string, password: string, username: string) => Promise<{
    success: boolean;
    message: string;
}>
}

const SignUpForm = ({ signUp }: Props) => {
  const [inputValues, setInputValues] = useState({
    email: "", password: "", username: ""
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues(prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(inputValues)
    try {
      const signedUp = await signUp(inputValues.email, inputValues.password, inputValues.username);
      if (signedUp.success) {
        await signIn("credentials", {
          email: inputValues.email,
          password: inputValues.password,
          callbackUrl: "/"
        })
      }
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
        <button type="submit">Sign up</button>
      </form>
    </>
  )
}

export default SignUpForm