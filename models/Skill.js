// models/Skill.js
import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    SkillName: { type: String, required: true },
    level: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Skill', skillSchema);
