"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";

type Props = {
  editedProfile: any;
  setEditedProfile: (v: any) => void;
  isEditing: boolean;
  saving: boolean;
  isDark: boolean;
  onSave: () => void;
  onCancel: () => void;
};

export default function EditDialog({
  editedProfile,
  setEditedProfile,
  isEditing,
  saving,
  isDark,
  onSave,
  onCancel,
}: Props) {
  if (!editedProfile) return null;

  return (
    <Dialog open={isEditing} onOpenChange={onCancel}>
      <DialogContent
        className={`${
          isDark ? "bg-[#0a0f1e] text-white" : "bg-white"
        } border rounded-xl`}
      >
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Full Name */}
          <div>
            <label className="text-sm">Full Name</label>
            <Input
              value={editedProfile.name || ""}
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, name: e.target.value })
              }
              className={isDark ? "bg-[#0f172a] text-white" : ""}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm">Bio</label>
            <Textarea
              value={editedProfile.bio || ""}
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, bio: e.target.value })
              }
              className={isDark ? "bg-[#0f172a] text-white" : ""}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm">Phone</label>
            <Input
              value={editedProfile.phone || ""}
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, phone: e.target.value })
              }
              className={isDark ? "bg-[#0f172a] text-white" : ""}
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm">Location</label>
            <Input
              value={editedProfile.location || ""}
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, location: e.target.value })
              }
              className={isDark ? "bg-[#0f172a] text-white" : ""}
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={saving} onClick={onSave}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
