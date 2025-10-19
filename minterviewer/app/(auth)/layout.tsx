"use client";

import { Toaster } from '@/components/ui/sonner'
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (user) {
    return null; 
  }

  return (
    <div className='auth-layout'>{children}</div>
  )
}

export default AuthLayout