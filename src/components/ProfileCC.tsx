'use client'

import { ChangeEvent, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { User } from "@/@types/user";
import { useSession } from "next-auth/react";
import useGetActiveUser from "./useGetActiveUser";
import Image from "next/image";
import { convertToBase64 } from "@/utils/convertToBase64";

type UpdateUserRes = {
  updateProfile: User
}

type Props = {
  currentUser: User
}

const ProfileCC = ({ currentUser }: Props) => {
  const { refetch } = useGetActiveUser();
  const { update } = useSession();
  
  const [inputValues, setInputValues] = useState({ ...currentUser });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues(prev => {
      if (!prev) return prev;
      return { ...prev, [e.target.name]: e.target.value}
    })
  }

  const handleImageChange = async(e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    let value = "";
    if (file) {
      const base64 = await convertToBase64(file);
      if (typeof base64 === "string") value = base64;
    }
    setInputValues(prev => {
      return {
        ...prev,
        picture: {
          url: value
        }
      }
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
        email: inputValues.email,
        username: inputValues.username,
        picture: inputValues.picture.url
      }
    }
  });

  const handleUpdate = async() => {
    console.log("submitting", inputValues);
    if (!inputValues.email || !inputValues.username) return alert("Fields can't be empty");
    if ((inputValues.email !== currentUser.email) && (currentUser.authType !== "credentials")) {
      return alert(`You can't update the email of a ${currentUser.authType} account`);
    }
    try {
      const result = await updateUser();
      console.log("result from handleUpdate", result);
      // if (currentUser.email !== result.data?.updateProfile.email) update({ email: result.data?.updateProfile.email });
      if (currentUser.email !== result.data?.updateProfile.email) await update({ email: result.data?.updateProfile.email });
      // still can't get session to update with new email address...................................................
      console.log(result);
      refetch();
    } catch (error) {
      console.log(error);
      alert("user couldn't be updated");
    }
  }
  
  return (
    <div>
      <h1>Profile Client Component</h1>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <Image 
          src={inputValues.picture.url ? inputValues.picture.url : currentUser.picture.url} 
          alt="My profile picture" 
          height={150} 
          width={150} 
          priority />
        <input type="file" name="picture" onChange={handleImageChange} />
        <input type="email" name="email" value={inputValues.email} onChange={handleChange} />
        <input name="username" value={inputValues.username} onChange={handleChange} />
        <button onClick={() => handleUpdate()}>{ loading ? "loading.." : "Save" }</button>
      </div>
      { error && <p style={{ color: "tomato" }}>{ error.message }</p> }
    </div>
  )
}

export default ProfileCC