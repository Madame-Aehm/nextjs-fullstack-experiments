"use client";
import React, { PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface Props extends PropsWithChildren {
  session: Session | null
}

const SessionWrapper = ({ children, session }: Props) => {
  return <SessionProvider session={session}>{ children }</SessionProvider>;
};

export default SessionWrapper;