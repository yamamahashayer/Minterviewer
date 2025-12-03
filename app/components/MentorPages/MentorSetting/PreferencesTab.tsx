"use client";

import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/app/components/ui/select";
import { Separator } from "@/app/components/ui/separator";

import SettingCard from "./SettingCard";

export default function PreferencesTab({ theme = "dark" }: { theme?: "dark" | "light" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <SettingCard>
        <h3 className="text-[var(--foreground)] mb-6">Display Preferences</h3>

        <div className="space-y-6">
          <div>
            <Label>Theme</Label>
            <Select defaultValue="dark">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark Mode</SelectItem>
                <SelectItem value="light">Light Mode</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Default Session Duration</Label>
            <Select defaultValue="60">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Calendar View</Label>
            <Select defaultValue="week">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-end">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Save className="w-4 h-4 mr-2" /> Save Preferences
          </Button>
        </div>
      </SettingCard>
    </motion.div>
  );
}
