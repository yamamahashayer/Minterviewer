// models/Notification.js
import mongoose from 'mongoose';
import { NotificationType } from './enums.js';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: Object.values(NotificationType), default: 'SYSTEM' },
    is_read: { type: Boolean, default: false },
    related_entity_id: { type: mongoose.Schema.Types.ObjectId },
    related_entity_type: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: true } }
);

export default mongoose.model('Notification', notificationSchema);
