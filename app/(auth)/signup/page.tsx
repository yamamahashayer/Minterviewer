'use client';

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Eye, EyeOff, CheckCircle2, XCircle, AlertCircle, Sparkles,
  UserCircle, ArrowLeft, ArrowRight, Briefcase, Upload,
  User, Mail, Lock, Github
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

  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ========================== USER FIELDS ========================== */
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    linkedin_url: '',
    github: '',
    area_of_expertise: [] as string[],
    country: '',
    short_bio: '',
    phoneNumber: '',
  });

  /* ========================== MENTOR EXTRA FIELDS ========================== */
  const [mentorFields, setMentorFields] = useState({
    yearsOfExperience: '',
    focusAreas: [] as string[],
    availabilityType: '',
    languages: [] as string[],
  });

  /* ========================== PREVIEW PHOTO ========================== */
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

  /* ========================== VALIDATION ========================== */
  const validateStep = (step: number) => {
    const e: Record<string, string> = {};

    if (step === 1) {
      if (!role) e.role = 'Please choose a role';
    }

    if (step === 2) {
      if (!form.full_name.trim()) e.full_name = 'Full name is required';
      if (!validateEmail(form.email)) e.email = 'Valid email is required';
      if (!form.phoneNumber.trim()) e.phoneNumber = 'Phone number is required';
      if (!form.password || passwordStrength.score < 2) e.password = 'Use 8+ chars incl. uppercase/lowercase/number';
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

  /* ========================== BUILD PAYLOAD ========================== */
      const buildPayload = () => {
  const payload: any = {
    full_name: form.full_name,
    email: form.email,
    password: form.password,
    role: role as Role,

    linkedin_url: form.linkedin_url || undefined,
    github: form.github || undefined,

    area_of_expertise: form.area_of_expertise,

    short_bio: form.short_bio || undefined,
    Country: form.country || undefined,
    phoneNumber: form.phoneNumber,
  };

  if (role === "mentor") {
    payload.yearsOfExperience = mentorFields.yearsOfExperience
      ? Number(mentorFields.yearsOfExperience)
      : 0;

    payload.focusAreas = mentorFields.focusAreas;

    payload.availabilityType = mentorFields.availabilityType || "";
    payload.languages = mentorFields.languages || [];
  }

  return payload;
};

  /* ========================== FETCH HELPERS ========================== */
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

  /* ========================== SUBMIT ========================== */
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
      /* ---- 1) Create USER ---- */
      const userData = await sendJSON(buildPayload());

      if (!userData?.user?.id) {
        throw new Error("User created but no ID returned.");
      }

      const userId = userData.user.id;

      /* ---- 2) If MENTOR → create Mentor document ---- */
      if (role === "mentor") {
         const mentorPayload = {
        user: userId,
        yearsOfExperience: mentorFields.yearsOfExperience
          ? Number(mentorFields.yearsOfExperience)
          : 0,

        focusAreas: mentorFields.focusAreas,   
        availabilityType: mentorFields.availabilityType || "",
        languages: mentorFields.languages || [],
      };



        await fetch("/api/mentors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mentorPayload),
        });
      }

      alert("Account created successfully!");
    } catch (err: any) {
      alert(err?.message || "Failed to sign up");
    } finally {
      setSubmitting(false);
    }
  };

  /* ========================== STEPS ========================== */
  const prevStep = () => {
    setCurrentStep(s => Math.max(s - 1, 1));
    setErrors({});
  };

  /* ========================== RENDER ========================== */
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4">
      <NeuralNetworkBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >


          <div className="relative z-10 w-full max-w-lg pt-4">
          <img
            src="/Covring2.png"
            alt="Minterviewer Logo"
            className="mx-auto mb-8 w-80  h-auto opacity-95"
          />
          </div>
        <Card className="bg-[#0d1425]/90 backdrop-blur-xl border border-[#00FFB2]/20 shadow-2xl rounded-2xl p-8">


         
          {/* HEADER */}
          <div className="text-center mb-6">
            
            <p className="text-gray-300 text-sm">
              Create your account — Step {currentStep} of 3
            </p>
          </div>

          {/* PROGRESS BAR */}
          <div className="mb-6">
            <Progress value={progress} className="h-2 bg-[#1a1f35]/60" />
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span className={currentStep >= 1 ? 'text-[#00FFB2]' : ''}>Role</span>
              <span className={currentStep >= 2 ? 'text-[#00FFB2]' : ''}>Basic</span>
              <span className={currentStep >= 3 ? 'text-[#00FFB2]' : ''}>Optional</span>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={onSubmit} className="space-y-6">
            <AnimatePresence mode="wait">

              {/* STEP 1 */}
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
                    {/* MENTEE CARD */}
                    <button
                      type="button"
                      onClick={() => setRole('mentee')}
                      className={`relative p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 group ${
                        role === 'mentee'
                          ? 'border-[#00FFB2] bg-[#00FFB2]/10 shadow-lg shadow-[#00FFB2]/20'
                          : 'border-[#00FFB2]/20 bg-[#1a1f35]/40 hover:border-[#00FFB2]/40 hover:bg-[#1a1f35]/60'
                      }`}
                    >
                      <UserCircle className={`w-12 h-12 ${
                        role === 'mentee' ? 'text-[#00FFB2]' : 'text-gray-400 group-hover:text-[#00FFB2]/60'
                      }`} />
                      <div className="text-center">
                        <p className={`mb-1 ${
                          role === 'mentee' ? 'text-[#00FFB2]' : 'text-gray-300'
                        }`}>Mentee</p>
                        <p className="text-xs text-gray-500">I want to learn</p>
                      </div>
                      {role === 'mentee' && (
                        <CheckCircle2 className="w-5 h-5 text-[#00FFB2] absolute top-3 right-3" />
                      )}
                    </button>

                    {/* MENTOR CARD */}
                    <button
                      type="button"
                      onClick={() => setRole('mentor')}
                      className={`relative p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 group ${
                        role === 'mentor'
                          ? 'border-[#00FFB2] bg-[#00FFB2]/10 shadow-lg shadow-[#00FFB2]/20'
                          : 'border-[#00FFB2]/20 bg-[#1a1f35]/40 hover:border-[#00FFB2]/40 hover:bg-[#1a1f35]/60'
                      }`}
                    >
                      <Briefcase className={`w-12 h-12 ${
                        role === 'mentor' ? 'text-[#00FFB2]' : 'text-gray-400 group-hover:text-[#00FFB2]/60'
                      }`} />
                      <div className="text-center">
                        <p className={`mb-1 ${
                          role === 'mentor' ? 'text-[#00FFB2]' : 'text-gray-300'
                        }`}>Mentor</p>
                        <p className="text-xs text-gray-500">I want to share</p>
                      </div>
                      {role === 'mentor' && (
                        <CheckCircle2 className="w-5 h-5 text-[#00FFB2] absolute top-3 right-3" />
                      )}
                    </button>
                  </div>

                  {errors.role && (
                    <p className="text-xs text-red-400 text-center">{errors.role}</p>
                  )}

                </motion.div>
              )}

              {/* STEP 2 */}
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

                  {/* Full Name */}
                  <div className="space-y-1">
                    <Label className="text-gray-200">
                      Full Name <span className="text-[#00FFB2]">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        name="full_name"
                        value={form.full_name}
                        onChange={onChange}
                        placeholder="John Doe"
                        className="pl-9 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white"
                      />
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.full_name && (
                      <p className="text-xs text-red-400">{errors.full_name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <Label className="text-gray-200">
                      Email <span className="text-[#00FFB2]">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="you@example.com"
                        className="pl-9 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white"
                      />
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-400">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <Label className="text-gray-200">
                      Phone Number <span className="text-[#00FFB2]">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        name="phoneNumber"
                        type="tel"
                        value={form.phoneNumber}
                        onChange={onChange}
                        placeholder="059-000-0000"
                        className="pl-9 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white"
                      />
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-400">{errors.phoneNumber}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <Label className="text-gray-200">
                      Password <span className="text-[#00FFB2]">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        name="password"
                        type={showPass ? 'text' : 'password'}
                        value={form.password}
                        onChange={onChange}
                        placeholder="••••••••"
                        className="pl-9 pr-9 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white"
                      />
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <button type="button" onClick={() => setShowPass(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2">
                        {showPass ? <EyeOff className="w-4 h-4 text-gray-400" /> :
                          <Eye className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>

                    {form.password && (
                      <div className="flex items-center gap-2 text-xs">
                        {passwordStrength.score <= 1 && (
                          <XCircle className="w-3 h-3 text-red-400" />
                        )}
                        {passwordStrength.score === 2 && (
                          <AlertCircle className="w-3 h-3 text-yellow-400" />
                        )}
                        {passwordStrength.score >= 3 && (
                          <CheckCircle2 className="w-3 h-3 text-[#00FFB2]" />
                        )}
                        <span className={passwordStrength.color}>
                          Password strength: {passwordStrength.label}
                        </span>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-xs text-red-400">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <Label className="text-gray-200">
                      Confirm Password <span className="text-[#00FFB2]">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        name="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={onChange}
                        placeholder="••••••••"
                        className="pl-9 pr-9 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white"
                      />
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <button type="button" onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2">
                        {showConfirm ? <EyeOff className="w-4 h-4 text-gray-400" /> :
                          <Eye className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>

                    {!passwordsMatch && form.confirmPassword && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Passwords don't match
                      </p>
                    )}
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-400">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                </motion.div>
              )}

              {/* STEP 3 */}
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

                  {/* COUNTRY */}
                  <div className="space-y-1">
                    <Label className="text-gray-200">Country</Label>
                    <Select value={form.country}
                      onValueChange={(v) => setForm(p => ({ ...p, country: v }))}>
                      <SelectTrigger className="bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1f35] border-[#00FFB2]/30 text-white max-h-56">
                        {COUNTRIES.map(c => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                    {/* AREA OF EXPERTISE — Multi Select */}
                    <div className="space-y-1">
                      <Label className="text-gray-200">Area of Expertise</Label>

                      <Select
                        onValueChange={(v) =>
                          setForm((prev) => ({
                            ...prev,
                            area_of_expertise: prev.area_of_expertise.includes(v)
                              ? prev.area_of_expertise
                              : [...prev.area_of_expertise, v],
                          }))
                        }
                      >
                        <SelectTrigger className="bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white">
                          <SelectValue placeholder="Select expertise areas" />
                        </SelectTrigger>

                        <SelectContent className="bg-[#1a1f35] border-[#00FFB2]/30 text-white max-h-56">
                          {EXPERTISE.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* BADGES */}
                      {form.area_of_expertise.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {form.area_of_expertise.map((exp, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 text-xs rounded-md bg-[#00FFB2]/10 border border-[#00FFB2]/30 text-[#00FFB2]"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                  {/* LINKEDIN */}
                  <div className="space-y-1">
                    <Label className="text-gray-200">LinkedIn</Label>
                    <Input
                      name="linkedin_url"
                      type="url"
                      value={form.linkedin_url}
                      onChange={onChange}
                      placeholder="https://linkedin.com/in/yourname"
                      className="bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white"
                    />
                  </div>

                  {/* GITHUB */}
                  <div className="space-y-1">
                    <Label className="text-gray-200">GitHub</Label>
                    <Input
                      name="github"
                      type="url"
                      value={form.github}
                      onChange={onChange}
                      placeholder="https://github.com/yourname"
                      className="bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white"
                    />
                  </div>

                  {/* PROFILE PHOTO */}
                  <div className="space-y-2">
                    <Label className="text-gray-200">Profile Photo</Label>
                    <div className="flex items-center gap-3">
                      <input
                        id="profilePhoto"
                        name="profilePhoto"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setProfilePhoto(e.target.files[0]);
                        }}
                      />
                      <label
                        htmlFor="profilePhoto"
                        className="flex items-center gap-2 px-4 py-2 bg-[#1a1f35]/60 border border-[#00FFB2]/30 rounded-md text-gray-300 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">
                          {profilePhoto ? profilePhoto.name : 'Choose file'}
                        </span>
                      </label>
                      {photoPreview && (
                        <img
                          src={photoPreview}
                          className="w-10 h-10 rounded-md object-cover border border-[#00FFB2]/30"
                        />
                      )}
                    </div>
                  </div>

                  {/* BIO */}
                  <div className="space-y-1">
                    <Label className="text-gray-200">Short Bio</Label>
                    <Textarea
                      name="short_bio"
                      value={form.short_bio}
                      onChange={onChange}
                      placeholder="Tell us a bit about yourself..."
                      className="bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white min-h-[80px]"
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-500 text-right">
                      {form.short_bio.length}/200
                    </p>
                  </div>

                  {/* ======================== MENTOR FIELDS ONLY ======================== */}
                  {role === "mentor" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">

                      {/* FOCUS AREA */}
                       <div className="space-y-1 md:col-span-2">
                      <Label className="text-gray-200">Mentor Focus Areas</Label>
                      <Select
                        onValueChange={(v) =>
                          setMentorFields((prev) => ({
                            ...prev,
                            focusAreas: prev.focusAreas.includes(v)
                              ? prev.focusAreas
                              : [...prev.focusAreas, v],
                          }))
                        }
                      >
                        <SelectTrigger className="bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white">
                          <SelectValue placeholder="Select focus areas" />
                        </SelectTrigger>

                        <SelectContent className="bg-[#1a1f35] border-[#00FFB2]/30 text-white max-h-56">
                          {[
                            "Interview Preparation",
                            "System Design Coaching",
                            "Mock Interviews",
                            "Career Guidance",
                            "Resume / CV Review",
                            "Portfolio Review",
                            "Coding Interview Coaching",
                            "Job Search Strategy",
                            "Technical Skill Upskilling",
                            "Career Roadmap Planning",
                            "Leadership & Communication",
                            "Tech Industry Insights",
                          ].map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                    {/* BADGES */}
                    {mentorFields.focusAreas.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {mentorFields.focusAreas.map((fa, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-xs rounded-md bg-[#00FFB2]/10 border border-[#00FFB2]/30 text-[#00FFB2]"
                          >
                            {fa}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>


                      {/* YEARS + AVAILABILITY */}
                      {mentorFields.focusAreas && (
                        <>
                          {/* YEARS */}
                          <div className="space-y-1">
                            <Label className="text-gray-200">Years of Experience</Label>
                            <Input
                              type="number"
                              min={0}
                              value={mentorFields.yearsOfExperience}
                              onChange={(e) =>
                                setMentorFields(s => ({
                                  ...s,
                                  yearsOfExperience: e.target.value,
                                }))
                              }
                              placeholder="2"
                              className="bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white"
                            />
                          </div>

                          {/* AVAILABILITY */}
                          <div className="space-y-1">
                            <Label className="text-gray-200">Availability</Label>
                            <Select
                              value={mentorFields.availabilityType}
                              onValueChange={(v) =>
                                setMentorFields(s => ({
                                  ...s,
                                  availabilityType: v,
                                }))
                              }>
                              <SelectTrigger className="bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white">
                                <SelectValue placeholder="Select availability" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1a1f35] border-[#00FFB2]/30 text-white">
                                {[
                                  "Full-Time",
                                  "Part-Time",
                                  "Weekends Only",
                                  "Evenings Only",
                                  "Flexible",
                                ].map(x => (
                                  <SelectItem key={x} value={x}>{x}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* LANGUAGES */}
                          <div className="space-y-1 md:col-span-2">
                            <Label className="text-gray-200">Languages</Label>
                            <Select
                              onValueChange={(v) =>
                                setMentorFields(s => ({
                                  ...s,
                                  languages: [...s.languages, v],
                                }))
                              }>
                              <SelectTrigger className="bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white">
                                <SelectValue placeholder="Select languages" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1a1f35] border-[#00FFB2]/30 text-white max-h-64">
                                {["Arabic", "English", "French", "Turkish", "Spanish", "German"].map(lang => (
                                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {mentorFields.languages.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {mentorFields.languages.map((l, i) => (
                                  <span key={i}
                                    className="px-3 py-1 text-xs rounded-md bg-[#00FFB2]/10 border border-[#00FFB2]/30 text-[#00FFB2]">
                                    {l}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      )}

                    </div>
                  )}

                </motion.div>
              )}

            </AnimatePresence>

            {/* NAVIGATION BUTTONS */}
            <div className="flex gap-3 pt-4">

              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1 bg-[#1a1f35]/60 border-[#00FFB2]/30 text-white hover:bg-[#1a1f35]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="submit"
                  disabled={!canGoNext}
                  className="flex-1 bg-gradient-to-r from-[#00FFB2] to-[#00d4a0] text-[#0d1425] shadow-lg"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-[#00FFB2] to-[#00d4a0] text-[#0d1425] shadow-lg"
                >
                  {submitting ? 'Creating account…' : 'Create Account'}
                </Button>
              )}

            </div>

          </form>

          {/* FOOTER */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-[#00FFB2] hover:underline">
                Sign in
              </a>
            </p>
          </div>

        </Card>
      </motion.div>
    </div>
  );
}
