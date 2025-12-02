"use client";

import { motion } from "framer-motion";
import { Save, Mail, Phone } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Separator } from "@/app/components/ui/separator";

import SettingCard from "./SettingCard";

export default function ProfileTab({ theme = "dark" }: { theme?: "dark" | "light" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <SettingCard>
        <h3 className="text-[var(--foreground)] mb-6">Profile Information</h3>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Full Name</Label>
            <Input defaultValue="Dr. Michael Chen" />
          </div>

          <div>
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
              <Input defaultValue="michael.chen@minterviewer.com" className="pl-10" />
            </div>
          </div>

          <div>
            <Label>Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
              <Input defaultValue="+1 (555) 123-4567" className="pl-10" />
            </div>
          </div>

          <div>
            <Label>Specialization</Label>
            <Input defaultValue="Senior Software Architect" />
          </div>

          <div className="md:col-span-2">
            <Label>Bio</Label>
            <Input defaultValue="Experienced software engineer..." />
          </div>

          <div>
            <Label>Time Zone</Label>
            <Select defaultValue="pst">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pst">Pacific Time</SelectItem>
                <SelectItem value="est">Eastern Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Language</Label>
            <Select defaultValue="en">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
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
