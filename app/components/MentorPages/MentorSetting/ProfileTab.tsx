"use client";

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
      </SettingCard>
    </motion.div>
  );
}
