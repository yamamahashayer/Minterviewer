'use client';

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import {
  Eye, EyeOff, CheckCircle2, XCircle, AlertCircle, Sparkles,
  UserCircle, ArrowLeft, ArrowRight, Briefcase, Upload,
  User, Mail, Lock
} from 'lucide-react';

import { NeuralNetworkBackground } from '@/app/components/publicPages/backgrounds/NeuralNetworkBackground';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@radix-ui/react-progress';

type Role = 'mentor' | 'mentee';
type ApiResponse = { message?: string; user?: { id: string; email: string; role: string } };

const COUNTRIES = [
  { code: 'Palestine', label: 'Palestine' },
  { code: 'Jordan', label: 'Jordan' },
  { code: 'Egypt', label: 'Egypt' },
  { code: 'Lebanon', label: 'Lebanon' },
  { code: 'Syria', label: 'Syria' },
  { code: 'Iraq', label: 'Iraq' },
  { code: 'Saudi Arabia', label: 'Saudi Arabia' },
  { code: 'United Arab Emirates', label: 'United Arab Emirates' },
  { code: 'Qatar', label: 'Qatar' },
  { code: 'Kuwait', label: 'Kuwait' },
  { code: 'Bahrain', label: 'Bahrain' },
  { code: 'Oman', label: 'Oman' },
  { code: 'Yemen', label: 'Yemen' },
  { code: 'Morocco', label: 'Morocco' },
  { code: 'Algeria', label: 'Algeria' },
  { code: 'Tunisia', label: 'Tunisia' },
  { code: 'Libya', label: 'Libya' },
  { code: 'Sudan', label: 'Sudan' },
  { code: 'United States', label: 'United States' },
  { code: 'Canada', label: 'Canada' },
  { code: 'United Kingdom', label: 'United Kingdom' },
  { code: 'Germany', label: 'Germany' },
  { code: 'France', label: 'France' },
  { code: 'Turkey', label: 'Turkey' },
  { code: 'India', label: 'India' },
  { code: 'Japan', label: 'Japan' },
  { code: 'Other', label: 'Other' },
];

const EXPERTISE = [
  'Frontend Development','Backend Development','Full-Stack Development','Mobile Development (iOS/Android)',
  'Data Science','Machine Learning / AI','MLOps','Data Engineering','DevOps / SRE',
  'Cloud (AWS/Azure/GCP)','Cybersecurity','QA / Testing / Automation','Database Administration',
  'Systems & Infrastructure','Embedded Systems / IoT','Game Development','AR / VR',
  'Blockchain / Web3','Computer Vision','NLP','Software Architecture','Other',
];

export default function SignUp() {
  // الخطوات: 1) Role فقط  2) Basic (Name/Email/Password)  3) Optional
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    linkedin_url: '',
    area_of_expertise: '',
    country: '',
    short_bio: ''
  });

  const [mentorFields, setMentorFields] = useState({
    yearsOfExperience: '',   // Number
    field: '',               // string
  });

  useEffect(() => {
    if (!profilePhoto) return setPhotoPreview(null);
    const url = URL.createObjectURL(profilePhoto);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [profilePhoto]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordStrength = useMemo(() => {
    const p = form.password;
    if (!p) return { score: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^a-zA-Z\d]/.test(p)) score++;
    const mapping: Record<number, {label: string, color: string}> = {
      0: { label: 'Too short', color: 'text-red-400' },
      1: { label: 'Weak',      color: 'text-red-400' },
      2: { label: 'Medium',    color: 'text-yellow-400' },
      3: { label: 'Good',      color: 'text-blue-400' },
      4: { label: 'Strong',    color: 'text-[#00FFB2]' }
    };
    return { score, ...mapping[score] };
  }, [form.password]);

  const passwordsMatch = !!form.password && !!form.confirmPassword && form.password === form.confirmPassword;

  const validateStep = (step: number) => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!role) e.role = 'Please choose a role';
    }
    if (step === 2) {
      if (!form.full_name.trim()) e.full_name = 'Full name is required';
      if (!validateEmail(form.email)) e.email = 'Valid email is required';
      if (!form.password || passwordStrength.score < 2) e.password = 'Use 8+ chars, upper/lower, number';
      if (!passwordsMatch) e.confirmPassword = "Passwords don't match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const canGoNext = useMemo(() => {
    if (currentStep === 1) return !!role;
    if (currentStep === 2)
      return (
        form.full_name.trim() &&
        validateEmail(form.email) &&
        passwordStrength.score >= 2 &&
        passwordsMatch
      );
    return true;
  }, [currentStep, role, form, passwordStrength, passwordsMatch]);

  const progress = (currentStep / 3) * 100;

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
      phoneNumber?: string; // غير مستخدم بالواجهة الآن
      Country?: string;
      yearsOfExperience?: number;
      field?: string;
    } = {
      full_name: form.full_name,
      email: form.email,
      password: form.password,
      role: role as Role,
      profile_photo: undefined,
      linkedin_url: form.linkedin_url || undefined,
      area_of_expertise: form.area_of_expertise || undefined,
      short_bio: form.short_bio || undefined,
      Country: form.country || undefined,
    };

    if (role === 'mentor') {
      if (mentorFields.yearsOfExperience) payload.yearsOfExperience = Number(mentorFields.yearsOfExperience);
      if (mentorFields.field) payload.field = mentorFields.field;
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

    if (currentStep < 3) {
      if (validateStep(currentStep)) {
        setCurrentStep(s => s + 1);
        setErrors({});
      }
      return; 
    }

    if (!validateStep(2) || !role) {
      setCurrentStep(2);
      return;
    }

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

  const prevStep = () => {
    setCurrentStep(s => Math.max(s - 1, 1));
    setErrors({});
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4">
      <NeuralNetworkBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card className="bg-[#0d1425]/90 backdrop-blur-xl border border-[#00FFB2]/20 shadow-2xl rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00FFB2] to-[#00d4a0] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#0d1425]" />
              </div>
              <h1 className="text-white text-3xl tracking-tight">Minterviewer</h1>
            </div>
            <p className="text-gray-300 text-sm">Create your account — Step {currentStep} of 3</p>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <Progress value={progress} className="h-2 bg-[#1a1f35]/60" />
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span className={currentStep >= 1 ? 'text-[#00FFB2]' : ''}>Role</span>
              <span className={currentStep >= 2 ? 'text-[#00FFB2]' : ''}>Basic</span>
              <span className={currentStep >= 3 ? 'text-[#00FFB2]' : ''}>Optional</span>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="space-y-6"
          >
            <AnimatePresence mode="wait">
              {/* STEP 1: Role ONLY */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-2">
                    <h2 className="text-white text-xl mb-2">Choose Your Role</h2>
                    <p className="text-gray-400 text-sm">Are you a mentee or a mentor?</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole('mentee')}
                      className={`relative p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 group ${
                        role === 'mentee'
                          ? 'border-[#00FFB2] bg-[#00FFB2]/10 shadow-lg shadow-[#00FFB2]/20'
                          : 'border-[#00FFB2]/20 bg-[#1a1f35]/40 hover:border-[#00FFB2]/40 hover:bg-[#1a1f35]/60'
                      }`}
                    >
                      <UserCircle className={`w-12 h-12 ${role === 'mentee' ? 'text-[#00FFB2]' : 'text-gray-400 group-hover:text-[#00FFB2]/60'}`} />
                      <div className="text-center">
                        <p className={`mb-1 ${role === 'mentee' ? 'text-[#00FFB2]' : 'text-gray-300'}`}>Mentee</p>
                        <p className="text-xs text-gray-500">I want to learn</p>
                      </div>
                      {role === 'mentee' && <CheckCircle2 className="w-5 h-5 text-[#00FFB2] absolute top-3 right-3" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('mentor')}
                      className={`relative p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 group ${
                        role === 'mentor'
                          ? 'border-[#00FFB2] bg-[#00FFB2]/10 shadow-lg shadow-[#00FFB2]/20'
                          : 'border-[#00FFB2]/20 bg-[#1a1f35]/40 hover:border-[#00FFB2]/40 hover:bg-[#1a1f35]/60'
                      }`}
                    >
                      <Briefcase className={`w-12 h-12 ${role === 'mentor' ? 'text-[#00FFB2]' : 'text-gray-400 group-hover:text-[#00FFB2]/60'}`} />
                      <div className="text-center">
                        <p className={`mb-1 ${role === 'mentor' ? 'text-[#00FFB2]' : 'text-gray-300'}`}>Mentor</p>
                        <p className="text-xs text-gray-500">I want to share</p>
                      </div>
                      {role === 'mentor' && <CheckCircle2 className="w-5 h-5 text-[#00FFB2] absolute top-3 right-3" />}
                    </button>
                  </div>
                  {errors.role && <p className="text-xs text-red-400 text-center">{errors.role}</p>}
                </motion.div>
              )}

              {/* STEP 2: Basic (Name + Email + Password + Confirm) */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-2">
                    <h2 className="text-white text-xl mb-2">Basic Information</h2>
                    <p className="text-gray-400 text-sm">Enter your credentials</p>
                  </div>

                  {/* Name */}
                  <div className="space-y-1">
                    <Label htmlFor="full_name" className="text-gray-200">Full Name <span className="text-[#00FFB2]">*</span></Label>
                    <div className="relative">
                      <Input
                        id="full_name"
                        name="full_name"
                        value={form.full_name}
                        onChange={onChange}
                        placeholder="John Doe"
                        className="pl-9 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white placeholder:text-gray-500 focus:border-[#00FFB2] focus:ring-[#00FFB2]/30"
                      />
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.full_name && <p className="text-xs text-red-400">{errors.full_name}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-gray-200">Email <span className="text-[#00FFB2]">*</span></Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="you@example.com"
                        className="pl-9 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white placeholder:text-gray-500 focus:border-[#00FFB2] focus:ring-[#00FFB2]/30"
                      />
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-gray-200">Password <span className="text-[#00FFB2]">*</span></Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPass ? 'text' : 'password'}
                        value={form.password}
                        onChange={onChange}
                        placeholder="••••••••"
                        className="pl-9 pr-9 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white placeholder:text-gray-500 focus:border-[#00FFB2] focus:ring-[#00FFB2]/30"
                      />
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2">
                        {showPass ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                    {form.password && (
                      <div className="flex items-center gap-2 text-xs">
                        {passwordStrength.score <= 1 && <XCircle className="w-3 h-3 text-red-400" />}
                        {passwordStrength.score === 2 && <AlertCircle className="w-3 h-3 text-yellow-400" />}
                        {passwordStrength.score >= 3 && <CheckCircle2 className="w-3 h-3 text-[#00FFB2]" />}
                        <span className={passwordStrength.color}>Password strength: {passwordStrength.label}</span>
                      </div>
                    )}
                    {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
                  </div>

                  {/* Confirm */}
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword" className="text-gray-200">Confirm Password <span className="text-[#00FFB2]">*</span></Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={onChange}
                        placeholder="••••••••"
                        className="pl-9 pr-9 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white placeholder:text-gray-500 focus:border-[#00FFB2] focus:ring-[#00FFB2]/30"
                      />
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2">
                        {showConfirm ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                    {!passwordsMatch && form.confirmPassword && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Passwords don't match
                      </p>
                    )}
                    {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword}</p>}
                  </div>

                  {/* Mentor optional mini fields داخل Basic */}
                  {role === 'mentor' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                      <div className="space-y-1 md:col-span-1">
                        <Label className="text-gray-200">Years (opt.)</Label>
                        <Input
                          type="number" min={0}
                          value={mentorFields.yearsOfExperience}
                          onChange={(e) => setMentorFields(s => ({ ...s, yearsOfExperience: e.target.value }))}
                          placeholder="5"
                          className="bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-1">
                        <Label className="text-gray-200">Field (opt.)</Label>
                        <Input
                          value={mentorFields.field}
                          onChange={(e) => setMentorFields(s => ({ ...s, field: e.target.value }))}
                          placeholder="Software Architecture"
                          className="bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 3: Optional (Country/Expertise/LinkedIn/Photo/Bio) */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-2">
                    <h2 className="text-white text-xl mb-2">Additional (Optional)</h2>
                    <p className="text-gray-400 text-sm">This helps personalize your experience</p>
                  </div>

                  {/* Country (يرسل كـ Country بحرف كبير) */}
                  <div className="space-y-1">
                    <Label className="text-gray-200">Country</Label>
                    <Select value={form.country} onValueChange={(v) => setForm(p => ({ ...p, country: v }))}>
                      <SelectTrigger className="bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1f35] border-[#00FFB2]/30 text-white max-h-56">
                        {COUNTRIES.map(c => (
                          <SelectItem key={c.code} value={c.code} className="focus:bg-[#00FFB2]/10 focus:text-[#00FFB2]">
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Will be sent as <span className="text-[#00FFB2]">Country</span> (capital C).
                    </p>
                  </div>

                  {/* Expertise */}
                  <div className="space-y-1">
                    <Label className="text-gray-200">Area of Expertise</Label>
                    <Select value={form.area_of_expertise} onValueChange={(v) => setForm(p => ({ ...p, area_of_expertise: v }))}>
                      <SelectTrigger className="bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white">
                        <SelectValue placeholder="Select your expertise" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1f35] border-[#00FFB2]/30 text-white max-h-56">
                        {EXPERTISE.map(x => (
                          <SelectItem key={x} value={x}>
                            {x}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-1">
                    <Label htmlFor="linkedin_url" className="text-gray-200">LinkedIn / Portfolio</Label>
                    <Input
                      id="linkedin_url"
                      name="linkedin_url"
                      type="url"
                      value={form.linkedin_url}
                      onChange={onChange}
                      placeholder="https://linkedin.com/in/yourname"
                      className="bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white placeholder:text-gray-500"
                    />
                  </div>

                  {/* Profile Photo (اختياري — رفع لاحقاً) */}
                  <div className="space-y-2">
                    <Label htmlFor="profilePhoto" className="text-gray-200">Profile Photo</Label>
                    <div className="flex items-center gap-3">
                      <input
                        id="profilePhoto"
                        name="profilePhoto"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => { if (e.target.files?.[0]) setProfilePhoto(e.target.files[0]); }}
                      />
                      <label
                        htmlFor="profilePhoto"
                        className="flex items-center gap-2 px-4 py-2 bg-[#1a1f35]/60 border border-[#00FFB2]/30 rounded-md text-gray-300 hover:border-[#00FFB2]/50 hover:bg-[#1a1f35] cursor-pointer transition-all"
                      >
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">{profilePhoto ? profilePhoto.name : 'Choose file'}</span>
                      </label>
                      {photoPreview && <img src={photoPreview} alt="preview" className="w-10 h-10 rounded-md object-cover border border-[#00FFB2]/30" />}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1">
                    <Label htmlFor="short_bio" className="text-gray-200">Short Bio</Label>
                    <Textarea
                      id="short_bio"
                      name="short_bio"
                      value={form.short_bio}
                      onChange={onChange}
                      placeholder="Tell us a bit about yourself..."
                      className="bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white placeholder:text-gray-500 min-h-[80px] resize-none"
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-500 text-right">{form.short_bio.length}/200</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white hover:bg-[#1a1f35] hover:border-[#00FFB2]/50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="submit"               // ← Next صار submit
                  disabled={!canGoNext}       // ← تعطيل بحسب صحة الخطوة
                  className="flex-1 bg-gradient-to-r from-[#00FFB2] to-[#00d4a0] hover:from-[#00d4a0] hover:to-[#00FFB2] text-[#0d1425] transition-all shadow-lg hover:shadow-xl hover:shadow-[#00FFB2]/30"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-[#00FFB2] to-[#00d4a0] hover:from-[#00d4a0] hover:to-[#00FFB2] text-[#0d1425] transition-all shadow-lg hover:shadow-xl hover:shadow-[#00FFB2]/30"
                >
                  {submitting ? 'Creating account…' : 'Create Account'}
                </Button>
              )}
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Already have an account? <a href="/login" className="text-[#00FFB2] hover:text-[#00d4a0] underline-offset-4 hover:underline">Sign in</a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
