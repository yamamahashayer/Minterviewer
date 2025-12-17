// models/TimeSlot.js
import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema(
    {
        mentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mentor',
            required: true,
            index: true
        },
        startTime: {
            type: Date,
            required: true,
            index: true
        },
        endTime: {
            type: Date,
            required: true
        },
        duration: {
            type: Number,
            required: true
        }, // minutes
        sessionOffering: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true
        }, // Reference to offering in Mentor's sessionOfferings array
        notes: {
            type: String,
            default: ''
        }, // Optional notes for this specific slot
        status: {
            type: String,
            enum: ['available', 'booked', 'blocked'],
            default: 'available',
            index: true
        },
        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Session'
        }, // Reference to session if booked
        mentee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        } // Reference to the user who booked this slot
    },
    { timestamps: true }
);

// Index for finding available slots
timeSlotSchema.index({ mentor: 1, startTime: 1, status: 1 });

export default mongoose.models.TimeSlot || mongoose.model('TimeSlot', timeSlotSchema);
