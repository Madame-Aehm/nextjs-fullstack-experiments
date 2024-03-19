"use client"
import { User } from '@/@types/user';
import React, { useEffect, useState } from 'react'

type NotOk = {
  error: string
}

const UsersCC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async() => {
      setError("");
      setLoading(true);
      try {
        const response = await fetch("/api/rest/users");
        
        if (!response.ok) {
          const result = await response.json() as NotOk;
          setError(result.error)
          setLoading(false);
          return
        }
        const result = await response.json() as User[];
        setUsers(result);
        setLoading(false);
      } catch (error) {
        console.log(error);
        const { message } = error as Error;
        setError(message);
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);
  
  return (
    <div style={{ border: "solid black 1px", padding: "0 1rem" }}>
      <h3>This is a Client Component using Rest</h3>
      { loading && <p>Loading...</p> }
      { error && <p>{ error }</p> }
      <ul>
        { users.map((user) => {
          return <li key={user._id.toString()}>{user.email}</li>
        }) }
      </ul>
    </div>
  )
}

export default UsersCC