"use client";

import { DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Camera } from "lucide-react";

export default function EditDialog({ mentorInfo, bio, setBio }: any) {
  return (
    <DialogContent className="max-w-2xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-4 max-h-[500px] overflow-y-auto">
        {/* Photo */}
        <div>
          <label className="text-sm mb-2 block" style={{ color: "var(--foreground)" }}>
            Profile Photo
          </label>

          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={mentorInfo.avatar} />
              <AvatarFallback>{mentorInfo.name[0]}</AvatarFallback>
            </Avatar>

            <Button size="sm" variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          </div>
        </div>

        {/* Name + Title */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm mb-2 block" style={{ color: "var(--foreground)" }}>
              Full Name
            </label>
            <Input defaultValue={mentorInfo.name} />
          </div>

          <div>
            <label className="text-sm mb-2 block" style={{ color: "var(--foreground)" }}>
              Title
            </label>
            <Input defaultValue={mentorInfo.title} />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="text-sm mb-2 block" style={{ color: "var(--foreground)" }}>
            Bio
          </label>

          <Textarea
            className="min-h-24"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Location + Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm mb-2 block" style={{ color: "var(--foreground)" }}>
              Location
            </label>
            <Input defaultValue={mentorInfo.location} />
          </div>

          <div>
            <label className="text-sm mb-2 block" style={{ color: "var(--foreground)" }}>
              Phone
            </label>
            <Input defaultValue={mentorInfo.phone} />
          </div>
        </div>

        <Button className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
          Save Changes
        </Button>
      </div>
    </DialogContent>
  );
}
