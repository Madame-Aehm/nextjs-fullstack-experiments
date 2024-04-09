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

  // let first = true;

  const { data, refetch } = useQuery<getMeRes>(getMeQuery);

  // useEffect(() => {
  //   if (!first) {
  //     if (session.status === "authenticated" && !data) signOut();
  //   }
  //   first = false;
  // }, [data?.getMe?.email])

  return { user: data?.getMe || null, refetch }
}

export default useGetActiveUser