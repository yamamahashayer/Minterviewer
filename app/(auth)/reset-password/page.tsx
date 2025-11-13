'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { NeuralNetworkBackground } from '@/app/components/publicPages/backgrounds/NeuralNetworkBackground';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get('token');
  const [password, setPassword] = useState('');
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0d3d56] relative overflow-hidden p-4">
        <NeuralNetworkBackground />
        <div className="fixed top-20 left-20 w-96 h-96 bg-[#00FFB2] rounded-full blur-[120px] opacity-10" />
        <div className="fixed bottom-20 right-20 w-80 h-80 bg-teal-500 rounded-full blur-[100px] opacity-10" />
        <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 text-center text-white">
          Invalid or missing token. <Link href="/forgot-password" className="underline text-[#00FFB2]">Request a new link</Link>.
        </div>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (password.length < 8) return setErr('Password must be at least 8 characters.');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (res.ok) setOk(true); else setErr('Could not reset password. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0d3d56] flex items-center justify-center p-4">
      <NeuralNetworkBackground />
      <div className="fixed top-20 left-20 w-96 h-96 bg-[#00FFB2] rounded-full blur-[120px] opacity-10" />
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-teal-500 rounded-full blur-[100px] opacity-10" />
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8">
        {ok ? (
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-2">Password updated</h1>
            <p className="text-gray-300 mb-6">You can now log in with your new password.</p>
            <Link href="/login" className="text-[#00FFB2] underline">Back to Login</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white text-center mb-2">Set a new password</h1>
            <p className="text-gray-300 text-center mb-6">Choose a strong password to secure your account.</p>

            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block text-sm text-gray-200">New Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#112240] border border-gray-700 text-white placeholder:text-gray-500 outline-none focus:border-[#00FFB2]"
                placeholder="••••••••"
                required
              />
              {err && <p className="text-sm text-red-400">{err}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-md bg-gradient-to-r from-[#00FFB2] to-teal-500 text-[#0a192f] font-medium hover:scale-[1.01] transition disabled:opacity-60"
              >
                {loading ? 'Updating…' : 'Reset Password'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-gray-300 hover:text-white">Back to Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
