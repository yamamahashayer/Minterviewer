'use client';

import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, CheckCircle2, XCircle, AlertCircle, Sparkles, Plus, Trash2, ChevronDown } from 'lucide-react';

import { NeuralNetworkBackground } from '@/app/components/backgrounds/NeuralNetworkBackground';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

type Role = 'mentor' | 'mentee';
type ApiResponse = { message?: string; user?: { id: string; email: string; role: string } };
type Strength = { score: number; label: string; color: string };

const COUNTRIES = [
  { code: 'PS', label: 'Palestine' }, { code: 'JO', label: 'Jordan' }, { code: 'EG', label: 'Egypt' },
  { code: 'LB', label: 'Lebanon' }, { code: 'SY', label: 'Syria' }, { code: 'IQ', label: 'Iraq' },
  { code: 'SA', label: 'Saudi Arabia' }, { code: 'AE', label: 'United Arab Emirates' }, { code: 'QA', label: 'Qatar' },
  { code: 'KW', label: 'Kuwait' }, { code: 'BH', label: 'Bahrain' }, { code: 'OM', label: 'Oman' },
  { code: 'YE', label: 'Yemen' }, { code: 'MA', label: 'Morocco' }, { code: 'DZ', label: 'Algeria' },
  { code: 'TN', label: 'Tunisia' }, { code: 'LY', label: 'Libya' }, { code: 'SD', label: 'Sudan' },
  { code: 'US', label: 'United States' }, { code: 'CA', label: 'Canada' }, { code: 'GB', label: 'United Kingdom' },
  { code: 'DE', label: 'Germany' }, { code: 'FR', label: 'France' }, { code: 'TR', label: 'Turkey' },
  { code: 'IN', label: 'India' }, { code: 'JP', label: 'Japan' },
  { code: 'OTHER', label: 'Other' },
];

const EXPERTISE = [
  'Frontend Development','Backend Development','Full-Stack Development','Mobile Development (iOS/Android)',
  'Data Science','Machine Learning / AI','MLOps','Data Engineering','DevOps / SRE',
  'Cloud (AWS/Azure/GCP)','Cybersecurity','QA / Testing / Automation','Database Administration',
  'Systems & Infrastructure','Embedded Systems / IoT','Game Development','AR / VR',
  'Blockchain / Web3','Computer Vision','NLP','Software Architecture','Other',
];

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] as const;

export default function SignUpPage() {
  const [role, setRole] = useState<Role>('mentee');
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // اختيارية:
    profile_photo: '',
    linkedin_url: '',
    area_of_expertise: '',
    short_bio: '',
    phoneNumber: '',
    country: '',
  });

  // mentor-only (اختياري بالكامل)
  const [mentorFields, setMentorFields] = useState({
    yearsOfExperience: '',
    field: '',
    availabilities: [] as string[],
  });

  // مؤقت لإضافة availability
  const [slot, setSlot] = useState<{day: typeof DAYS[number] | ''; start: string; end: string}>({
    day: '', start: '', end: '',
  });

  const markTouched = (name: string) => setTouched(prev => ({ ...prev, [name]: true }));
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const strength: Strength = useMemo(() => {
    const p = form.password;
    if (!p) return { score: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^a-zA-Z\d]/.test(p)) score++;
    const map: Record<number, { label: string; color: string }> = {
      0: { label: 'Too short', color: 'text-red-400' },
      1: { label: 'Weak', color: 'text-red-400' },
      2: { label: 'Medium', color: 'text-yellow-400' },
      3: { label: 'Good', color: 'text-blue-400' },
      4: { label: 'Strong', color: 'text-[#00FFB2]' },
    };
    return { score, ...map[score] };
  }, [form.password]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordsMatch = !!form.password && !!form.confirmPassword && form.password === form.confirmPassword;

  // ✅ المطلوب فقط: full_name, email, password, confirmPassword, role
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.full_name.trim()) e.full_name = 'Full name is required';
    if (!validateEmail(form.email)) e.email = 'Valid email is required';
    if (!form.password || strength.score < 2) e.password = 'Use 8+ chars, upper/lower, number';
    if (!passwordsMatch) e.confirmPassword = "Passwords don't match";
    if (!role) e.role = 'Choose a role';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // يطابق الباك: أسماء الحقول الأساسية + الاختيارية كما هي
  const buildPayload = () => {
    const payload: {
      full_name: string;
      email: string;
      password: string;
      role: Role;
      profile_photo?: string;
      linkedin_url?: string;
      area_of_expertise?: string;
      short_bio?: string;
      phoneNumber?: string;
      Country?: string; // C كبيرة
      yearsOfExperience?: number;
      field?: string;
      availabilities?: string[];
    } = {
      full_name: form.full_name,
      email: form.email,
      password: form.password,
      role,
      profile_photo: form.profile_photo || undefined,
      linkedin_url: form.linkedin_url || undefined,
      area_of_expertise: form.area_of_expertise || undefined,
      short_bio: form.short_bio || undefined,
      phoneNumber: form.phoneNumber || undefined,
      Country: form.country || undefined,
    };

    if (role === 'mentor') {
      if (mentorFields.yearsOfExperience) payload.yearsOfExperience = Number(mentorFields.yearsOfExperience);
      if (mentorFields.field || form.area_of_expertise) payload.field = mentorFields.field || form.area_of_expertise;
      if (mentorFields.availabilities.length) payload.availabilities = mentorFields.availabilities;
    }
    return payload;
  };

  const sendJSON = async (payload: unknown): Promise<ApiResponse> => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data: ApiResponse = await res.json().catch(() => ({} as ApiResponse));
    if (!res.ok) throw new Error(data?.message || 'Failed');
    return data;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const data = await sendJSON(buildPayload());
      alert(data?.message || 'Registered');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign up';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const addSlot = () => {
    if (!slot.day || !slot.start || !slot.end) return;
    const text = `${slot.day} ${slot.start}-${slot.end}`;
    setMentorFields(s => ({ ...s, availabilities: [...s.availabilities, text] }));
    setSlot({ day: '', start: '', end: '' });
  };
  const removeSlot = (i: number) => {
    setMentorFields(s => ({ ...s, availabilities: s.availabilities.filter((_, idx) => idx !== i) }));
  };

  const FieldError = ({ name }: { name: string }) =>
    errors[name] && touched[name] ? <p className="text-xs text-red-400 mt-1">{errors[name]}</p> : null;

  // وسم النجمة
  const Req = () => <span className="text-[#00FFB2] ml-0.5">*</span>;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <NeuralNetworkBackground variant="clean" />

      <div className="flex items-center justify-center p-6 lg:p-10">
        <Card className="w-full max-w-md bg-[#0d1425]/90 backdrop-blur-xl border border-[#00FFB2]/20 shadow-2xl rounded-2xl">
          <div className="p-6 lg:p-7">
            {/* رأس مبسّط */}
            <div className="text-center mb-5">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00FFB2] to-[#00d4a0] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#0d1425]" />
                </div>
                <h1 className="text-white text-xl tracking-tight">Minterviewer</h1>
              </div>
              <p className="text-gray-400 text-xs">Create your account</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* الدور (مطلوب) */}
              <div>
                <Label className="text-gray-200">I am a<Req /></Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(['mentee', 'mentor'] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      aria-pressed={role === r}
                      className={`px-3 py-2 rounded-lg border text-sm transition ${
                        role === r
                          ? 'border-[#00FFB2] bg-[#00FFB2]/10 text-[#00FFB2]'
                          : 'border-[#00FFB2]/20 bg-[#1a1f35]/40 text-gray-300 hover:border-[#00FFB2]/40'
                      }`}
                    >
                      {r === 'mentee' ? '👩‍💻 Mentee' : '👩‍🏫 Mentor'}
                    </button>
                  ))}
                </div>
                <FieldError name="role" />
              </div>

              {/* الاسم (مطلوب) */}
              <div>
                <Label htmlFor="full_name" className="text-gray-200">Full Name<Req /></Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={form.full_name}
                  onBlur={() => markTouched('full_name')}
                  onChange={onChange}
                  placeholder="John Doe"
                  className="mt-1 h-11 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white"
                />
                <FieldError name="full_name" />
              </div>

              {/* الإيميل (مطلوب) */}
              <div>
                <Label htmlFor="email" className="text-gray-200">Email<Req /></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onBlur={() => markTouched('email')}
                  onChange={onChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="mt-1 h-11 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white"
                />
                <FieldError name="email" />
              </div>

              {/* كلمة المرور (مطلوب) */}
              <div>
                <Label htmlFor="password" className="text-gray-200">Password<Req /></Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onBlur={() => markTouched('password')}
                    onChange={onChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="mt-1 h-11 pr-10 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center"
                    onClick={() => setShowPass(v => !v)}
                    aria-label="Toggle password"
                  >
                    {showPass ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>

                {/* مؤشر القوة */}
                <div className="mt-2 flex gap-1">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded ${strength.score > i ? 'bg-[#00FFB2]' : 'bg-[#1a1f35]'}`} />
                  ))}
                </div>
                {form.password && (
                  <div className="flex items-center gap-2 text-xs mt-1">
                    {strength.score <= 1 && <XCircle className="w-3 h-3 text-red-400" />}
                    {strength.score === 2 && <AlertCircle className="w-3 h-3 text-yellow-400" />}
                    {strength.score >= 3 && <CheckCircle2 className="w-3 h-3 text-[#00FFB2]" />}
                    <span className={strength.color}>{strength.label}</span>
                  </div>
                )}
                <FieldError name="password" />
              </div>

              {/* تأكيد كلمة المرور (مطلوب) */}
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-200">Confirm Password<Req /></Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onBlur={() => markTouched('confirmPassword')}
                    onChange={onChange}
                    placeholder="••••••••"
                    className="mt-1 h-11 pr-10 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center"
                    onClick={() => setShowConfirm(v => !v)}
                    aria-label="Toggle confirm"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
                {form.confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {"Passwords don't match"}
                  </p>
                )}
                <FieldError name="confirmPassword" />
              </div>

              {/* قسم متقدّم (اختياري بالكامل) */}
              <div className="border border-[#00FFB2]/15 rounded-lg">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-[#00FFB2]"
                  onClick={() => setShowAdvanced(v => !v)}
                >
                  <span>Advanced (optional)</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>

                {showAdvanced && (
                  <div className="px-3 pb-3 pt-1 space-y-3">
                    <div>
                      <Label htmlFor="area_of_expertise" className="text-gray-200">Area of Expertise</Label>
                      <Select value={form.area_of_expertise} onValueChange={(v) => setForm(p => ({ ...p, area_of_expertise: v }))}>
                        <SelectTrigger className="mt-1 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white">
                          <SelectValue placeholder="Select your expertise" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1f35] border-[#00FFB2]/30 text-white max-h-56">
                          {EXPERTISE.map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-gray-200">Country</Label>
                      <Select value={form.country} onValueChange={(v) => setForm(p => ({ ...p, country: v }))}>
                        <SelectTrigger className="mt-1 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1f35] border-[#00FFB2]/30 text-white max-h-56">
                          {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-gray-500 mt-1">Will be sent as <span className="text-[#00FFB2]">Country</span> (capital C).</p>
                    </div>

                    <div>
                      <Label htmlFor="phoneNumber" className="text-gray-200">Phone</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={form.phoneNumber}
                        onChange={onChange}
                        placeholder="+970 5X XXX XXXX"
                        className="mt-1 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="linkedin_url" className="text-gray-200">LinkedIn / Portfolio</Label>
                      <Input
                        id="linkedin_url"
                        name="linkedin_url"
                        type="url"
                        value={form.linkedin_url}
                        onChange={onChange}
                        placeholder="https://linkedin.com/in/yourname"
                        className="mt-1 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="profile_photo" className="text-gray-200">Profile Photo URL</Label>
                      <Input
                        id="profile_photo"
                        name="profile_photo"
                        type="url"
                        value={form.profile_photo}
                        onChange={onChange}
                        placeholder="https://drive.google.com/uc?export=view&id=FILE_ID"
                        className="mt-1 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white"
                      />
                      {form.profile_photo && (
                        <div className="mt-2">
                          <Image
                            src={form.profile_photo}
                            alt="preview"
                            width={44}
                            height={44}
                            className="rounded-md object-cover border border-[#00FFB2]/30"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="short_bio" className="text-gray-200">Short Bio</Label>
                      <Textarea
                        id="short_bio"
                        name="short_bio"
                        value={form.short_bio}
                        onChange={onChange}
                        placeholder="Tell us a bit about yourself..."
                        className="mt-1 min-h-[80px] bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white"
                        maxLength={200}
                      />
                      <p className="text-xs text-gray-500 text-right">{form.short_bio.length}/200</p>
                    </div>

                  
                  </div>
                )}
              </div>

              {/* إرسال */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-gradient-to-r from-[#00FFB2] to-[#00d4a0] text-[#0d1425] hover:opacity-90"
              >
                {submitting ? 'Creating account…' : 'Create account'}
              </Button>

              <p className="text-center text-gray-400 text-sm">
                Already have an account? <a href="/sign-in" className="text-[#00FFB2] hover:text-[#00d4a0] underline-offset-4 hover:underline">Sign in</a>
              </p>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
