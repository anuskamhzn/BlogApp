// components/Routes/AdminRoute.tsx
"use client";

import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";

type AdminRouteProps = {
  children: ReactNode;
};

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [auth] = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Read directly from localStorage like in your old React Router code
    const storedAuth = localStorage.getItem("auth");
    let isAdmin = false;

    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        const role = parsed?.user?.role?.toLowerCase();
        isAdmin = role === "admin";
      } catch (e) {
        console.error("Failed to parse auth from localStorage");
      }
    }

    if (!isAdmin) {
      router.push("/");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full" />
      </div>
    );
  }

  // If we reach here, user is admin
  return <>{children}</>;
};

export default AdminRoute;