"use client";

import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

type User = {
  role?: string;
  // add other user fields here if needed
};

type AuthType = {
  user?: User | null;
};

type AdminRouteProps = {
  children: ReactNode;
};

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [auth] = useAuth() as [AuthType];
  const router = useRouter();

  useEffect(() => {
    if (!auth?.user || auth.user.role !== "Admin") {
      router.push("/");
    }
  }, [auth, router]);

  return auth?.user?.role === "Admin" ? <>{children}</> : null;
};

export default AdminRoute;