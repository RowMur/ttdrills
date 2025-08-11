import { PropsWithChildren } from "react";

export const Main = ({ children }: PropsWithChildren<object>) => {
  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
  );
};
