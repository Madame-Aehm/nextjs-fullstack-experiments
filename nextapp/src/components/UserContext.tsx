'use client'
import { User } from "@/@types/user";
import { gql, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"

interface UserContext {
  user: User | null
}

type getMeRes = {
  getMe: User
}
const userContext = createContext({} as UserContext);

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const session = useSession();
  const [user, setUser] = useState<User | null>(null);

  const getMeQuery = gql`
  query getMe {
    getMe {
      _id
      email
      username
      picture {
        url
      }
    }
  }`

  const { data, refetch } = useQuery<getMeRes>(getMeQuery);
  // console.log("session", session, "data", data)
  // // const user = data?.getMe;
  // console.log("user on context", user)
  console.log("context is rendering")

  useEffect(() => {
    if (session.status === "authenticated") refetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status])

  useEffect(() => { 
    if (data?.getMe) setUser(data.getMe);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.getMe._id])


  return <userContext.Provider value={{ user }}>{ children }</userContext.Provider>
}

export const useAuth = () => {
  return useContext(userContext);
}