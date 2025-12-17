"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Mail, Phone } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Separator } from "@/app/components/ui/separator";
import SettingCard from "./SettingCard";

export default function ProfileTab({
  theme = "dark",
  user,
  mentor,
}: {
  theme?: "dark" | "light";
  user: any;
  mentor: any;
}) {
  const [stripeAccountId, setStripeAccountId] = useState(mentor?.stripeAccountId || "");
  const [savingStripe, setSavingStripe] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<string | null>(null);

  const handleSaveStripeAccount = async () => {
    try {
      setSavingStripe(true);
      setStripeStatus(null);

      if (typeof window === "undefined") {
        console.error("Stripe manual save: window is undefined");
        return;
      }

      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No auth token found for saving Stripe Account ID");
        setStripeStatus("Auth token is missing.");
        return;
      }

      if (!mentor?._id) {
        console.error("No mentor id available for saving Stripe Account ID");
        setStripeStatus("Mentor ID not found.");
        return;
      }

      const res = await fetch(`/api/mentors/${mentor._id}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profile: {
            stripeAccountId: stripeAccountId.trim(),
          },
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.ok === false) {
        console.error("Failed to save Stripe Account ID", data);
        setStripeStatus(data?.message || "Failed to save Stripe Account ID.");
        return;
      }

      setStripeStatus("Stripe Account ID saved successfully.");
    } catch (err) {
      console.error("Error saving Stripe Account ID:", err);
      setStripeStatus("Error while saving Stripe Account ID.");
    } finally {
      setSavingStripe(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <SettingCard theme={theme}>
        <h3 className="text-[var(--foreground)] mb-6">Profile Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Full Name */}
          <div>
            <Label>Full Name</Label>
            <Input defaultValue={user?.full_name || ""} />
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 
              text-[var(--foreground-muted)]" />
              <Input defaultValue={user?.email || ""} className="pl-10" />
            </div>
          </div>

          {/* Phone */}
          <div>
            <Label>Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 
              w-4 h-4 text-[var(--foreground-muted)]" />
              <Input defaultValue={user?.phoneNumber || ""} className="pl-10" />
            </div>
          </div>

          {/* Area of Expertise */}
          <div>
            <Label>Areas of Expertise</Label>
            <Input
              defaultValue={(user?.area_of_expertise || []).join(", ")}
              placeholder="e.g. Frontend, System Design"
            />
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <Label>Bio</Label>
            <Input defaultValue={user?.short_bio || ""} />
          </div>

          {/* Years of Experience */}
          <div>
            <Label>Years of Experience</Label>
            <Input defaultValue={mentor?.yearsOfExperience || 0} />
          </div>

          {/* Focus Areas */}
          <div>
            <Label>Focus Areas</Label>
            <Input
              defaultValue={(mentor?.focusAreas || []).join(", ")}
              placeholder="e.g. Interview Prep, Mock Interviews"
            />
          </div>

          {/* Languages */}
          <div>
            <Label>Languages</Label>
            <Input
              defaultValue={(mentor?.languages || []).join(", ")}
              placeholder="English, Arabic..."
            />
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>

        <Separator className="my-6" />

        {/* Stripe Connect Section */}
        <div>
          <h3 className="text-[var(--foreground)] mb-4">Payment Settings</h3>
          <div className="space-y-3 p-4 border border-[var(--border)] rounded-lg bg-[var(--background-muted)]">
            <div>
              <h4 className="font-medium text-[var(--foreground)]">Stripe Account ID</h4>
              <Input
                value={stripeAccountId}
                onChange={(e) => setStripeAccountId(e.target.value)}
                placeholder="acct_..."
              />
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                Paste your Stripe account ID from your Stripe dashboard (e.g. acct_1234...).
              </p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Button
                onClick={handleSaveStripeAccount}
                disabled={savingStripe}
                className="bg-[#635BFF] hover:bg-[#534be0] text-white"
              >
                {savingStripe ? "Saving..." : "Save Stripe Account"}
              </Button>
              {stripeStatus && (
                <p className="text-xs text-[var(--foreground-muted)]">
                  {stripeStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      </SettingCard>
    </motion.div>
  );
}
