import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import TimeSlot from '@/models/TimeSlot';
import Mentor from '@/models/Mentor';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { sendBookingConfirmationEmail } from '@/lib/email';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover' as any,
});

export async function POST(req: Request) {
    try {
        const { session_id } = await req.json();

        if (!session_id) {
            return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
        }

        // 1. Verify Payment with Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== 'paid') {
            return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
        }

        await dbConnect();

        const { sessionId: timeSlotId, mentorId, menteeId, title } = session.metadata || {};
        const menteeEmail = session.customer_details?.email;

        if (!timeSlotId) {
            return NextResponse.json({ error: 'Invalid session metadata' }, { status: 400 });
        }

        console.log(`CONFIRM API: Processing booking for slot: ${timeSlotId}`);

        const timeSlot = await TimeSlot.findById(timeSlotId);
        if (!timeSlot) {
            return NextResponse.json({ error: 'TimeSlot not found' }, { status: 404 });
        }

        // Check if already booked to avoid double emails
        if (timeSlot.status === 'booked') {
            console.log('Slot already booked, skipping logic.');
            return NextResponse.json({ success: true, message: 'Already confirmed' });
        }

        // 2. Logic (Same as webhook)
        const meetingLink = `https://meet.jit.si/Minterviewer-${timeSlotId}-${Date.now().toString().slice(-6)}`;

        timeSlot.status = 'booked';
        timeSlot.notes = (timeSlot.notes ? timeSlot.notes + '\n\n' : '') + `Meeting Link: ${meetingLink}`;

        // Save mentee ID
        if (menteeId) {
            timeSlot.mentee = menteeId;
        }

        await timeSlot.save();

        // 3. Fetch Mentor
        const mentor = await Mentor.findById(mentorId).populate('user');
        if (mentor && mentor.user) {
            const mentorUser = mentor.user as any;
            const sessionDate = new Date(timeSlot.startTime).toLocaleDateString();
            const sessionTime = new Date(timeSlot.startTime).toLocaleTimeString();

            // Email Mentor
            if (mentorUser.email) {
                await sendBookingConfirmationEmail(
                    mentorUser.email,
                    mentorUser.full_name || 'Mentor',
                    title || 'Mentorship Session',
                    sessionDate,
                    sessionTime,
                    meetingLink,
                    'mentor',
                    timeSlot.startTime,
                    timeSlot.duration || 60
                );
            }

            // Email Mentee
            let targetMenteeEmail = menteeEmail;
            let menteeName = 'Mentee';

            if (menteeId) {
                const menteeUser = await User.findById(menteeId);
                if (menteeUser) {
                    menteeName = menteeUser.full_name || 'Mentee';
                    if (menteeUser.email) targetMenteeEmail = menteeUser.email;
                }
            }

            if (targetMenteeEmail) {
                await sendBookingConfirmationEmail(
                    targetMenteeEmail,
                    menteeName,
                    title || 'Mentorship Session',
                    sessionDate,
                    sessionTime,
                    meetingLink,
                    'mentee',
                    timeSlot.startTime,
                    timeSlot.duration || 60
                );
            }

            // Notifications
            await createNotification(
                mentorUser._id,
                'New Session Booked',
                `You have a new session: ${title} on ${sessionDate} at ${sessionTime}.`,
                'system',
                '/mentor/sessions'
            );

            if (menteeId) {
                await createNotification(
                    menteeId,
                    'Booking Confirmed',
                    `Your session "${title}" is confirmed for ${sessionDate} at ${sessionTime}.`,
                    'system',
                    '/mentee/sessions'
                );
            }
        }

        return NextResponse.json({ success: true, meetingLink });

    } catch (error: any) {
        console.error('Confirm Booking Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function createNotification(userId: string | any, title: string, message: string, type: string, redirectTo: string) {
    try {
        const docRef = await addDoc(collection(db, 'notifications'), {
            userId: userId.toString(),
            title,
            message,
            type,
            redirectTo,
            read: false,
            createdAt: serverTimestamp(),
        });

        await Notification.create({
            user: userId,
            title,
            message,
            type,
            redirectTo,
            read: false,
            firebaseId: docRef.id,
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}
