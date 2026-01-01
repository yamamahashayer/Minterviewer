import Activity from "@/models/Activity";

type LogActivityInput = {
  ownerId: string;
  ownerModel?: "Mentee" | "Mentor";
  type?: string;
  title: string;
  score?: number;
};

export async function logActivity({
  ownerId,
  ownerModel = "Mentee",
  type = "custom",
  title,
  score,
}: LogActivityInput) {
  try {
    await Activity.create({
      ownerModel,
      owner: ownerId,
      type,
      title,
      score,
    });
  } catch (e) {
    console.error("Activity log failed", e);
  }
}
