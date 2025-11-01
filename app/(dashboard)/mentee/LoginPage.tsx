import { useState } from "react";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  Award
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Practice",
      description: "Get real-time feedback from advanced AI"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Visualize your improvement over time"
    },
    {
      icon: Award,
      title: "Earn Achievements",
      description: "Unlock badges as you master skills"
    }
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#0a0f1e] to-[#000000]">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-300 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/50">
              <span className="text-3xl">🎯</span>
            </div>
            <div>
              <h1 className="text-white text-3xl">Minterviewer</h1>
              <p className="text-teal-300 text-sm">Your AI Career Coach</p>
            </div>
          </div>

          {/* Tagline */}
          <h2 className="text-white text-4xl mb-4">
            Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400">Interview Skills</span>
          </h2>
          <p className="text-[#99a1af] text-lg mb-12">
            Practice with AI, track your progress, and land your dream job with confidence.
          </p>

          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-teal-500/30 flex items-center justify-center shrink-0">
                    <Icon className="text-teal-300" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white mb-1">{feature.title}</h3>
                    <p className="text-[#99a1af] text-sm">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-[rgba(94,234,212,0.1)]">
            <div>
              <div className="text-teal-300 text-2xl mb-1">10K+</div>
              <p className="text-[#99a1af] text-sm">Active Users</p>
            </div>
            <div>
              <div className="text-emerald-400 text-2xl mb-1">50K+</div>
              <p className="text-[#99a1af] text-sm">Interviews</p>
            </div>
            <div>
              <div className="text-teal-300 text-2xl mb-1">98%</div>
              <p className="text-[#99a1af] text-sm">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-300 to-emerald-400 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h2 className="text-white text-xl">Minterviewer</h2>
              <p className="text-teal-300 text-xs">Your AI Career Coach</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] border border-[rgba(94,234,212,0.2)] rounded-2xl p-8 backdrop-blur-sm">
            <div className="mb-8">
              <h2 className="text-white text-2xl mb-2">Welcome Back!</h2>
              <p className="text-[#99a1af]">Sign in to continue your journey</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="text-[#d1d5dc] text-sm mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6a7282]" size={18} />
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="text-[#d1d5dc] text-sm mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6a7282]" size={18} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[rgba(255,255,255,0.05)] border-[rgba(94,234,212,0.3)] text-white pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6a7282] hover:text-teal-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" className="border-[rgba(94,234,212,0.3)]" />
                  <label htmlFor="remember" className="text-[#d1d5dc] text-sm cursor-pointer">
                    Remember me
                  </label>
                </div>
                <button type="button" className="text-teal-300 text-sm hover:text-teal-200 transition-colors">
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20 h-12"
              >
                Sign In
                <ArrowRight size={18} className="ml-2" />
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[rgba(94,234,212,0.1)]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#0f172b] px-2 text-[#6a7282]">OR</span>
                </div>
              </div>

              {/* Demo Login */}
              <Button
                type="button"
                onClick={onLogin}
                className="w-full bg-[rgba(255,255,255,0.08)] border-2 border-[rgba(94,234,212,0.4)] text-white hover:bg-[rgba(255,255,255,0.12)] hover:border-[rgba(94,234,212,0.5)] h-12"
              >
                <CheckCircle2 size={18} className="mr-2" />
                Continue as Demo User
              </Button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center mt-6 text-[#99a1af] text-sm">
              Don't have an account?{" "}
              <button className="text-teal-300 hover:text-teal-200 transition-colors">
                Sign up for free
              </button>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center mt-6 text-[#6a7282] text-xs">
            By signing in, you agree to our{" "}
            <button className="text-teal-400 hover:text-teal-300 transition-colors">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-teal-400 hover:text-teal-300 transition-colors">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
