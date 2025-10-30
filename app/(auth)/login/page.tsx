'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { NeuralNetworkBackground } from "@/app/components/backgrounds/NeuralNetworkBackground";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { Brain } from "lucide-react";
import Link from 'next/link';

type ApiOk = {
  message: string;
  redirectUrl?: string;
  user?: { id: string; email: string; full_name: string; role: string };
};
type ApiErr = { message?: string };

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

      const data: ApiOk & ApiErr = await res.json();

      if (!res.ok) {
        setError(data?.message ?? 'Login failed');
        return;
      }

      router.push(data.redirectUrl || '/');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign in clicked");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0d3d56] flex items-center justify-center p-4">
      {/* Animated background effect */}
      <NeuralNetworkBackground />

      {/* Glowing orbs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-[#00FFB2] rounded-full blur-[120px] opacity-10 pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-teal-500 rounded-full blur-[100px] opacity-10 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00FFB2] blur-xl opacity-50 rounded-full" />
              <div className="relative bg-gradient-to-br from-[#00FFB2] to-teal-500 p-3 rounded-2xl">
                <Brain className="w-8 h-8 text-[#0a192f]" />
              </div>
            </div>
            <h1 className="text-white text-3xl tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Minterviewer
            </h1>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-[#00FFB2]/20 bg-[#0a192f]/80 backdrop-blur-xl shadow-2xl shadow-[#00FFB2]/10">
          <CardHeader className="space-y-2 text-center pb-4">
            <CardTitle className="text-2xl text-white">Welcome back!</CardTitle>
            <CardDescription className="text-gray-400">Ready to ace your next interview?</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#112240] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00FFB2] focus:ring-[#00FFB2]/20 transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <a href="/forgot-password" className="text-sm text-[#00FFB2] hover:text-[#00FFB2]/80 transition-colors">Forgot password?</a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#112240] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00FFB2] focus:ring-[#00FFB2]/20 transition-all"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              {/* Sign In */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#00FFB2] to-teal-500 text-[#0a192f] hover:shadow-lg hover:shadow-[#00FFB2]/30 transition-all duration-300 hover:scale-[1.02]"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <Separator className="bg-gray-700" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a192f] px-3 text-sm text-gray-400">
                or
              </span>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full bg-transparent border-gray-700 text-white hover:bg-[#112240] hover:border-[#00FFB2]/50 transition-all"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </Button>
          </CardContent>


          <CardFooter className="flex justify-center pt-2">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#00FFB2] hover:text-[#00FFB2]/80 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>


        </Card>

        {/* Footer text */}
        <p className="text-center text-gray-500 text-sm mt-6">Powered by AI • Secure & Private</p>
      </div>
    </div>
  );
}
