'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { NeuralNetworkBackground } from "@/app/components/publicPages/backgrounds/NeuralNetworkBackground";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { Brain } from "lucide-react";
import Link from 'next/link';

type ApiUser = {
  id: string;
  email: string;
  role: string;
  full_name: string;
  mentorId?: string;
  menteeId?: string;
  companyId?: string;
  isVerified?: boolean;
};

type ApiResponse = {
  message?: string;
  token?: string;
  redirectUrl?: string;
  user?: ApiUser;
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        setError(data?.message ?? 'Login failed');
        setLoading(false);
        return;
      }

      // Save TOKEN
      if (data.token) {
        sessionStorage.setItem('token', data.token);
      }

      // Save USER Object including companyId & isVerified
      if (data.user) {
        sessionStorage.setItem(
          'user',
          JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.full_name,
            role: data.user.role,

            menteeId: data.user.menteeId || null,
            mentorId: data.user.mentorId || null,
            companyId: data.user.companyId || null,

            isVerified: data.user.isVerified ?? null,
          })
        );
      }

      // Redirect based on role
      router.push(data.redirectUrl || '/');

    } catch (e) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0d3d56] flex items-center justify-center p-4">

      <NeuralNetworkBackground />

      <div className="relative z-10 w-full max-w-md">

        <div className="relative z-10 w-full max-w-md pt-20">
  
          <img
            src="/Covring2.png"
            alt="Minterviewer Logo"
            className="mx-auto mb-8 w-72 h-auto opacity-95"
          />


        </div>

        <Card className="border-[#00FFB2]/20 bg-[#0a192f]/80 backdrop-blur-xl shadow-2xl shadow-[#00FFB2]/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Welcome back!</CardTitle>
            <CardDescription className="text-gray-400">
              Ready to ace your next interview?
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleSignIn} className="space-y-4">

              <div>
                <Label className="text-gray-300">Email</Label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#112240] border-gray-700 text-white focus:bg-[#112240]/70 focus:border-[#00FFB2]"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <Label className="text-gray-300">Password</Label>
                  <Link href="/forgot-password" className="text-[#00FFB2] text-sm">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#112240] border-gray-700 text-white focus:bg-[#112240]/70 focus:border-[#00FFB2]"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <Button
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#00FFB2] to-teal-500 text-[#0a192f] hover:from-[#00cc8f] hover:to-teal-600"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <Separator className="bg-gray-700" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 bg-[#0a192f] px-2 text-sm">
                or
              </span>
            </div>

          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-gray-400 text-sm">
              Don’t have an account?
              <Link href="/signup" className="text-[#00FFB2] ml-1">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
