'use client'
import { User } from "@/@types/user";
import { gql, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"

interface UserContext {
  user: User | undefined
}

type getMeRes = {
  getMe: User
}
const userContext = createContext({} as UserContext);

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const session = useSession();

  const getMeQuery = gql`
  query getMe {
    getMe {
      _id
      email
      username
    }
  }`

  const { data, loading, error, refetch } = useQuery<getMeRes>(getMeQuery);
  console.log("data", data)
  const user = data?.getMe;

  useEffect(() => {
    if (session.status === "authenticated") refetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status])


  return <userContext.Provider value={{ user }}>{ children }</userContext.Provider>
}

export const useAuth = () => {
  return useContext(userContext);
}