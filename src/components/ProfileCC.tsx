'use client'

import { ChangeEvent, useEffect, useState } from "react";
import { useAuth } from "./UserContext"
import { gql, useMutation } from "@apollo/client";
import { User } from "@/@types/user";
import { useSession } from "next-auth/react";

type UpdateUserRes = {
  updateProfile: User
}

const ProfileCC = () => {
  const { user } = useAuth();
  const { update } = useSession();
  
  const [inputValues, setInputValues] = useState<User>({ email: "", username: "", _id: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues(prev => {
      if (!prev) return prev;
      return { ...prev, [e.target.name]: e.target.value}
    })
  }

  const updateUserMutation = gql`
    mutation updateUser($updatableValues: updatableValues!) {
      updateProfile(updatableValues: $updatableValues) {
        _id
        email
        username
      }
    }
  `
  const [updateUser, { error, loading }] = useMutation<UpdateUserRes>(updateUserMutation, {
    variables: {
      updatableValues: {
        email: inputValues?.email,
        username: inputValues?.username
      }
    }
  });

  const handleUpdate = async() => {
    console.log("submitting", inputValues);
    if (!inputValues?.email || !inputValues?.username) return alert("Fields can't be empty")
    try {
      const result = await updateUser();
      console.log("result from handleUpdate", result);
      if (user?.email !== result.data?.updateProfile.email) update({ email: result.data?.updateProfile.email })
    } catch (error) {
      console.log(error);
      alert("user couldn't be updated");
    }
  }

  useEffect(() => {
    user && setInputValues(user);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id])

  
  return (
    <div>
      <h1>Profile Client Component</h1>
      <input type="email" name="email" value={inputValues.email} onChange={handleChange} />
      <input name="username" value={inputValues.username} onChange={handleChange} />
      <button onClick={() => handleUpdate()}>{ loading ? "loading.." : "Save" }</button>
      { error && <p style={{ color: "tomato" }}>{ error.message }</p> }
    </div>
  )
}

export default ProfileCC