import UsersCCGQL from "@/components/usersCCGQL";
import UsersCCRest from "@/components/usersCCRest";
import UsersSC from "@/components/usersSC";
import { Suspense } from "react";


export default async function Home () {
  return (
    <main style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
      <h1>These are the users</h1>
      
      <Suspense fallback={<p>Loading...</p>}>
        <UsersSC />
      </Suspense>

      <UsersCCRest />

      <UsersCCGQL />

    </main>
  );
}
