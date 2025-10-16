import { Toaster } from '@/components/ui/sonner'
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/dist/client/components/navigation';
import React from 'react'

const Authlayout = async ({ children }: { children: React.ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();

  if (isUserAuthenticated) {
    redirect("/");
  }

  return (
    <div className='auth-layout'>{children}</div>

  )
}

export default Authlayout