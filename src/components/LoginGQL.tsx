'use client'

import { gql, useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'

const LoginGQL = () => {
  const router = useRouter();
  const [inputValues, setInputValues] = useState({ email: "", password: "" });

  const mutation = gql`
    mutation login ($loginValues: loginValues!) {
      login(loginValues: $loginValues) {
        _id
        email
        username
      }
    }
  `

  const [login, { data, error, loading }] = useMutation(mutation, {
    variables: {
      loginValues: {
        email: inputValues.email,
        password: inputValues.password
      }
    }
  });

  useEffect(() => {
    if (data) {
      router.replace('/')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <div>
      <h1>Login GQL</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        //validation
        login();
      }}>
        <input type="email" placeholder="email" onChange={(e) => setInputValues({ ...inputValues, email: e.target.value })} />
        <input type="password" placeholder="password" onChange={(e) => setInputValues({ ...inputValues, password: e.target.value })} />
        { loading ? <button>Loading...</button> : <button type="submit">Login</button> }
      </form>
      { error && <small style={{ color: "red" }}>{ error.message }</small> }
    </div>
  )
}

export default LoginGQL