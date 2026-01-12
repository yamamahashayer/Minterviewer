"use client";

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/app/components/ui/select";

import {
  Building2,
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  Flag,
  Globe,
} from "lucide-react";

export default function CompanySignup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    workEmail: "",
    industry: "",
    website: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  function onChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // =============================
  // INDUSTRIES
  // =============================
  const COMPANY_INDUSTRIES = [
    "Software Development",
    "Artificial Intelligence",
    "Cybersecurity",
    "Information Technology",
    "Cloud Computing",
    "DevOps",
    "Data Science",
    "Networking",
    "Web Development",
    "Mobile Development",
    "Blockchain",
    "IoT / Embedded",
    "Robotics",
    "FinTech",
    "EdTech",
    "HealthTech",
    "SaaS",
    "Consulting & IT Services",
    "Other",
  ];

  // =============================
  // SUBMIT
  // =============================
  async function submit(e: any) {
    e.preventDefault();

    if (step === 1) return setStep(2);

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/company/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          role: "company",

          // USER ACCOUNT (login)
          full_name: form.companyName, // placeholder
          email: form.workEmail, // login email
          password: form.password,
          country: form.location,

          // COMPANY DATA
          name: form.companyName,
          workEmail: form.workEmail,
          industry: form.industry,
          website: form.website,
          location: form.location,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        alert("Error: " + data.message);
        setLoading(false);
        return;
      }

      alert("Company Account Created Successfully ✔");
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#0B0F19] text-white">

      {/* LEFT PANEL */}
      <div className="hidden md:flex flex-col justify-center px-20 border-r border-white/10">
        <div className="max-w-md">
          <img
          src="/Covring2.png"
          alt="Minterviewer"
          className="w-95 mb-8"
        />


          <h2 className="text-4xl font-bold leading-tight mb-4">
            Create Your <span className="text-[#00E5C1]">Company Account</span>
          </h2>

          <p className="text-gray-300 text-lg mb-8">
            Hire smarter with AI-powered candidate matching and a secure
            professional dashboard for managing your recruitment.
          </p>

          <ul className="space-y-4 text-gray-300">
            <li className="flex items-center gap-3">
              <span className="w-3 h-3 bg-[#00E5C1] rounded-full" />
             Candidate–Job Matching Based on Skills
            </li>
            <li className="flex items-center gap-3">
              <span className="w-3 h-3 bg-[#00E5C1] rounded-full" />
              Interview Reviews & Performance Insights
            </li>
            <li className="flex items-center gap-3">
              <span className="w-3 h-3 bg-[#00E5C1] rounded-full" />
             Centralized Hiring Dashboard
            </li>
          </ul>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-lg bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold">
              {step === 1 && "Company Details"}
              {step === 2 && "Account Setup"}
            </h1>
            <p className="text-gray-400 mt-1">Step {step} of 2</p>
          </div>

          <form onSubmit={submit} className="space-y-6">

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div>
                  <Label>Company Name *</Label>
                  <Input
                    name="companyName"
                    required
                    onChange={onChange}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Techstars"
                  />
                </div>

                <div>
                  <Label>Company Email *</Label>
                  <Input
                    name="workEmail"
                    type="email"
                    required
                    onChange={onChange}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="hr@company.com"
                  />
                </div>

                <div>
                  <Label>Industry *</Label>
                  <Select onValueChange={(v) => setForm({ ...form, industry: v })}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select Industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B0F19] text-white">
                      {COMPANY_INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Website (Optional)</Label>
                  <Input
                    name="website"
                    onChange={onChange}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="https://company.com"
                  />
                </div>

                <div>
                  <Label>Location *</Label>
                  <Input
                    name="location"
                    required
                    onChange={onChange}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Amman, Jordan"
                  />
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <div>
                  <Label>Password *</Label>
                  <Input
                    name="password"
                    type="password"
                    required
                    onChange={onChange}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <Label>Confirm Password *</Label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    required
                    onChange={onChange}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="••••••••"
                  />
                </div>
              </>
            )}

            {/* BUTTONS */}
            <div className="flex gap-3 pt-3">
              {step === 2 && (
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white/10 border border-white/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#00E5C1] text-[#0B0F19] font-semibold"
              >
                {loading
                  ? "Creating..."
                  : step === 1
                  ? (
                    <>
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )
                  : "Create Account"}
              </Button>
            </div>

            <p className="text-center text-gray-400 text-sm mt-6">
              Already have an account?{" "}
              <a href="/login" className="text-[#00E5C1] hover:underline">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
