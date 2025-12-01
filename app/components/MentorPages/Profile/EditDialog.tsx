"use client";

import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";

export default function EditDialog({ profile, onSave, close }: any) {
  
  const [form, setForm] = useState({
    // USER FIELDS
    full_name: profile.full_name || "",
    phoneNumber: profile.phoneNumber || "",
    Country: profile.Country || "",
    linkedin_url: profile.linkedin_url || "",
    short_bio: profile.short_bio || "",

    // MENTOR FIELDS
    headline: profile.headline || "",
    bio: profile.bio || "",
    hourlyRate: profile.hourlyRate || "",
    yearsOfExperience: profile.yearsOfExperience || "",
    focusArea: profile.focusArea || "",
    availabilityType: profile.availabilityType || "",

    // ARRAYS
    languages: (profile.languages || []).join(", "),
    industries: (profile.industries || []).join(", "),
    expertise: (profile.expertise || []).join(", "),
    sessionTypes: (profile.sessionTypes || []).join(", "),

    // SOCIAL
    github: profile.social?.github || "",
    website: profile.social?.website || "",
    twitter: profile.social?.twitter || "",
  });

  const update = (key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    const cleaned = {
      
      // USER
      full_name: form.full_name,
      phoneNumber: form.phoneNumber,
      Country: form.Country,
      linkedin_url: form.linkedin_url,
      short_bio: form.short_bio,

      // MENTOR
      headline: form.headline,
      bio: form.bio,
      hourlyRate: Number(form.hourlyRate),
      yearsOfExperience: Number(form.yearsOfExperience),
      focusArea: form.focusArea,
      availabilityType: form.availabilityType,

      // ARRAYS convert back from CSV → array
      languages: form.languages.split(",").map((x: string) => x.trim()).filter(Boolean),
      industries: form.industries.split(",").map((x: string) => x.trim()).filter(Boolean),
      expertise: form.expertise.split(",").map((x: string) => x.trim()).filter(Boolean),
      sessionTypes: form.sessionTypes.split(",").map((x: string) => x.trim()).filter(Boolean),

      social: {
        github: form.github,
        website: form.website,
        twitter: form.twitter,
      },
    };

    onSave(cleaned);
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-4">

        {/* USER FIELDS */}
        <Section title="Personal Information">

          <Field
            label="Full Name"
            value={form.full_name}
            onChange={(v) => update("full_name", v)}
          />

          <Field
            label="Phone Number"
            value={form.phoneNumber}
            onChange={(v) => update("phoneNumber", v)}
          />

          <Field
            label="Country"
            value={form.Country}
            onChange={(v) => update("Country", v)}
          />

          <Field
            label="LinkedIn URL"
            value={form.linkedin_url}
            onChange={(v) => update("linkedin_url", v)}
          />

          <TextareaField
            label="Short Bio"
            value={form.short_bio}
            onChange={(v) => update("short_bio", v)}
          />

        </Section>

        {/* MENTOR FIELDS */}
        <Section title="Mentor Details">

          <Field
            label="Headline"
            value={form.headline}
            onChange={(v) => update("headline", v)}
          />

          <TextareaField
            label="Mentor Bio"
            value={form.bio}
            onChange={(v) => update("bio", v)}
          />

          <Field
            label="Hourly Rate (USD)"
            value={form.hourlyRate}
            onChange={(v) => update("hourlyRate", v)}
          />

          <Field
            label="Years of Experience"
            value={form.yearsOfExperience}
            onChange={(v) => update("yearsOfExperience", v)}
          />

          <Field
            label="Focus Area"
            value={form.focusArea}
            onChange={(v) => update("focusArea", v)}
          />

          <Field
            label="Availability Type"
            value={form.availabilityType}
            onChange={(v) => update("availabilityType", v)}
          />

        </Section>

        {/* ARRAYS */}
        <Section title="Expertise & Skills">

          <Field
            label="Languages (comma separated)"
            value={form.languages}
            onChange={(v) => update("languages", v)}
          />

          <Field
            label="Industries (comma separated)"
            value={form.industries}
            onChange={(v) => update("industries", v)}
          />

          <Field
            label="Expertise Areas (comma separated)"
            value={form.expertise}
            onChange={(v) => update("expertise", v)}
          />

          <Field
            label="Session Types (comma separated)"
            value={form.sessionTypes}
            onChange={(v) => update("sessionTypes", v)}
          />

        </Section>

        {/* SOCIAL */}
        <Section title="Social Links">

          <Field
            label="GitHub"
            value={form.github}
            onChange={(v) => update("github", v)}
          />

          <Field
            label="Website"
            value={form.website}
            onChange={(v) => update("website", v)}
          />

          <Field
            label="Twitter"
            value={form.twitter}
            onChange={(v) => update("twitter", v)}
          />

        </Section>

        <Button
          onClick={handleSubmit}
          className="w-full bg-purple-600 text-white"
        >
          Save Changes
        </Button>

      </div>
    </DialogContent>
  );
}

/* ---------- Helper Components ---------- */

function Section({ title, children }: any) {
  return (
    <div className="border p-4 rounded-xl mb-4" style={{ borderColor: "var(--border)" }}>
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1"
      />
    </div>
  );
}

function TextareaField({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <Textarea
        value={value}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1"
      />
    </div>
  );
}
