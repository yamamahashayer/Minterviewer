'use client';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { NeuralNetworkBackground } from '@/app/components/publicPages/backgrounds/NeuralNetworkBackground';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!/\S+@\S+\.\S+/.test(email)) return setErr('Please enter a valid email address');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setOk(true); else setErr('Something went wrong. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0d3d56] flex items-center justify-center p-4">
      {/* نفس خلفية تسجيل الدخول */}
      <NeuralNetworkBackground />
      <div className="fixed top-20 left-20 w-96 h-96 bg-[#00FFB2] rounded-full blur-[120px] opacity-10 pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-teal-500 rounded-full blur-[100px] opacity-10 pointer-events-none" />

      {/* المحتوى */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-2xl">
          {ok ? (
            <div className="text-center">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
              <p className="text-gray-300 mb-6">We&apos;ve sent a password reset link to <b>{email}</b>.</p>
              <Link href="/login" className="inline-flex items-center gap-2 text-[#00FFB2] hover:opacity-80">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white text-center mb-2">Forgot Password?</h1>
              <p className="text-gray-300 text-center mb-6">
                No worries! Enter your email and we&apos;ll send you reset instructions.
              </p>
              <form onSubmit={onSubmit} className="space-y-4">
                <label className="block text-sm text-gray-200">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-md bg-[#112240] border border-gray-700 text-white placeholder:text-gray-500 outline-none focus:border-[#00FFB2]"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                {err && <p className="text-sm text-red-400">{err}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-md bg-gradient-to-r from-[#00FFB2] to-teal-500 text-[#0a192f] font-medium hover:scale-[1.01] transition disabled:opacity-60"
                >
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="inline-flex items-center gap-2 text-gray-300 hover:text-white">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
