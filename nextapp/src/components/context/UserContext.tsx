'use client'
import { User } from "@/@types/user";
import { gql, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useState } from "react"

interface UserContext {
  user: User | null
  setUser: React.Dispatch<SetStateAction<User>>
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

  const { refetch } = useQuery<getMeRes>(getMeQuery);

  useEffect(() => {
    if (session.status === "authenticated") {
      const triggerRefetch = async () => {
        console.log("refetch triggered")
        try {
          const result = await refetch();
          if (result.data.getMe) {
            setUser(result.data.getMe);
          }
        } catch (error) {
          console.log(error);
        }
      }
      triggerRefetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status])


  return <userContext.Provider value={{ user, setUser }}>{ children }</userContext.Provider>
}

export const useAuth = () => {
  return useContext(userContext);
}