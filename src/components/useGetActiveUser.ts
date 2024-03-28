import { User } from "@/@types/user";
import { gql, useQuery } from "@apollo/client";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

type getMeRes = {
  getMe: User | null
}

const useGetActiveUser = () => {
  const session = useSession();
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

  // useEffect(() => {
  //   if ((session.data?.user.email && data?.getMe?.email) && (data?.getMe?.email !== session.data?.user.email)) {
  //     signOut();
  //   }
  // }, [session.data?.user.email, data?.getMe?.email])

  return { user: data?.getMe || null, refetch }
}

export default useGetActiveUser