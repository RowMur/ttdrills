import { PropsWithChildren } from "react";

export const Main = ({ children }: PropsWithChildren<object>) => {
  return <main className="max-w-3xl mx-auto p-8">{children}</main>;
};
