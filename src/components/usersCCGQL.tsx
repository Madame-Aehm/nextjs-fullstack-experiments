"use client"
import { User } from '@/@types/user';
import { useQuery, gql } from '@apollo/client';
import React from 'react'

type Data = {
  users: User[]
}

const UsersCCGQL = () => {

  const query = gql`
    query {
      users {
        email
        username
        _id
      }
    }
  `
  const { data, loading, error } = useQuery<Data>(query);
  
  return (
    <div style={{ border: "solid black 1px", padding: "0 1rem" }}>
      <h3>This is a Client Component using GraphQL</h3>
      { loading && <p>Loading....</p> }
      { error && <p>{ error.message }</p> }
      <ul>
        { data && data.users.map((user) => {
          return <li key={user._id.toString()}>{user.email}</li>
        }) }
      </ul>
    </div>
  )
}

export default UsersCCGQL