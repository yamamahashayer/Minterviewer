"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Separator } from "@/app/components/ui/separator";

import SettingCard from "./SettingCard";

export default function SecurityTab({ theme = "dark" }: { theme?: "dark" | "light" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <SettingCard>
        <h3 className="text-[var(--foreground)] mb-6">Security Settings</h3>

        <div className="space-y-6">
          <div>
            <Label>Current Password</Label>
            <Input type="password" placeholder="Enter current password" />
          </div>

          <div>
            <Label>New Password</Label>
            <Input type="password" placeholder="Enter new password" />
          </div>

          <div>
            <Label>Confirm New Password</Label>
            <Input type="password" placeholder="Confirm new password" />
          </div>

          <Separator />

          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[var(--foreground)] mb-1">
                  Two-Factor Authentication
                </h4>
                <p className="text-[var(--foreground-muted)] text-sm mb-3">
                  Add an extra layer of security to your account
                </p>
                <Button
                  variant="outline"
                  className="border-purple-500/50 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
                >
                  Enable 2FA
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            Update Password
          </Button>
        </div>
      </SettingCard>
    </motion.div>
  );
}
