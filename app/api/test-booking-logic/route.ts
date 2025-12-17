import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TimeSlot from '@/models/TimeSlot';
import Mentor from '@/models/Mentor';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { sendBookingConfirmationEmail } from '@/lib/email';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// THIS IS A TEST ROUTE TO VERIFY LOGIC WITHOUT STRIPE WEBHOOK
// Usage: POST /api/test-booking-logic
// Body: { sessionId: "...", mentorId: "...", menteeId: "..." }

export async function POST(req: Request) {
    try {
        const { sessionId, mentorId, menteeId, title, userEmail } = await req.json();

        if (!sessionId || !mentorId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        console.log(`TEST: Processing booking for session: ${sessionId}`);

        // 1. Generate Jitsi Link
        const meetingLink = `https://meet.jit.si/Minterviewer-${sessionId}-${Date.now().toString().slice(-6)}`;

        // 2. Update TimeSlot
        const timeSlot = await TimeSlot.findById(sessionId);
        if (!timeSlot) {
            return NextResponse.json({ error: 'TimeSlot not found' }, { status: 404 });
        }

        // Force status update for test
        timeSlot.status = 'booked';
        timeSlot.notes = (timeSlot.notes ? timeSlot.notes + '\n\n' : '') + `Meeting Link: ${meetingLink}`;

        await timeSlot.save();
        console.log('TEST: TimeSlot updated to booked');

        // 3. Fetch Mentor User for Email
        const mentor = await Mentor.findById(mentorId).populate('user');
        if (!mentor || !mentor.user) {
            return NextResponse.json({ error: 'Mentor or Mentor User not found' }, { status: 404 });
        }

        const mentorUser = mentor.user as any;
        const mentorEmail = mentorUser.email;
        const mentorName = mentorUser.full_name || 'Mentor';

        const sessionDate = new Date(timeSlot.startTime).toLocaleDateString();
        const sessionTime = new Date(timeSlot.startTime).toLocaleTimeString();

        const results = {
            mentorEmailSent: false,
            menteeEmailSent: false,
            notificationsCreated: false,
            meetingLink
        };

        // 4. Send Emails
        if (mentorEmail) {
            console.log('TEST: Sending email to mentor', mentorEmail);
            await sendBookingConfirmationEmail(
                mentorEmail,
                mentorName,
                title || 'Mentorship Session',
                sessionDate,
                sessionTime,
                meetingLink,
                'mentor'
            );
            results.mentorEmailSent = true;
        }

        // To Mentee (use passed email or fetch from DB)
        const menteeEmailTarget = userEmail; // Use the email from request body for testing easily

        if (menteeEmailTarget) {
            console.log('TEST: Sending email to mentee', menteeEmailTarget);
            await sendBookingConfirmationEmail(
                menteeEmailTarget,
                'Test Mentee',
                title || 'Mentorship Session',
                sessionDate,
                sessionTime,
                meetingLink,
                'mentee'
            );
            results.menteeEmailSent = true;
        }

        // 5. Create Notifications
        if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
            await createNotification(
                mentorUser._id,
                'New Session Booked (TEST)',
                `You have a new session: ${title} on ${sessionDate} (TEST)`,
                'system',
                '/mentor/sessions'
            );

            if (menteeId) {
                await createNotification(
                    menteeId,
                    'Booking Confirmed (TEST)',
                    `Your session "${title}" is confirmed (TEST)`,
                    'system',
                    '/mentee/sessions'
                );
            }
            results.notificationsCreated = true;
        }

        return NextResponse.json({ success: true, results });

    } catch (error: any) {
        console.error('TEST API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function createNotification(userId: string | any, title: string, message: string, type: string, redirectTo: string) {
    try {
        console.log(`Creating notification for user ${userId}`);
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
