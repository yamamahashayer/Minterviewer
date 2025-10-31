// models/User.js
import mongoose from 'mongoose';
import { UserRole } from './enums.js';

const userSchema = new mongoose.Schema(
  {
    full_name: String,
    email: { type: String, unique: true, required: true, index: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    profile_photo: String,
    linkedin_url: String,
    area_of_expertise: String,
    short_bio: String,
    phoneNumber: String,
    Country: String,
    // Password reset fields
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// Fix: Check if model exists before creating it
// This prevents the "Cannot overwrite model" error in development
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;