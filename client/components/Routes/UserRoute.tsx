"use client";

import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

type UserRouteProps = {
  children: ReactNode;
};

type AuthType = {
  user?: unknown; // replace `unknown` with your actual user type if available
};

const UserRoute = ({ children }: UserRouteProps) => {
  const [auth] = useAuth() as [AuthType];
  const router = useRouter();

  useEffect(() => {
    if (!auth?.user) {
      router.push("/login");
    }
  }, [auth, router]);

  return auth?.user ? <>{children}</> : null;
};

export default UserRoute;