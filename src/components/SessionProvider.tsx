"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const SessionProvider = ({ children }: Props) => {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
};
