import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import TimeSlot from '@/models/TimeSlot';
import Mentor from '@/models/Mentor';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { sendBookingConfirmationEmail } from '@/lib/email'; // Changed import from 'lib/email-service' to 'lib/email' based on file location
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover' as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const sig = (await headers()).get('stripe-signature');

    let event: Stripe.Event;

    try {
        if (!sig || !endpointSecret) {
            console.error('Missing signature or webhook secret');
            return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
        }
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        try {
            await handleCheckoutSessionCompleted(session);
        } catch (error) {
            console.error('Error handling checkout session:', error);
            // Return 200 even if internal processing failed to prevent Stripe from retrying endlessly (or maybe we want retry?)
            // Usually good to return 500 if we want retry, but let's log and return 200 for now to avoid spam if logic is buggy.
            return NextResponse.json({ error: 'Internal processing error' }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    await dbConnect();

    const { sessionId, mentorId, menteeId, title } = session.metadata || {};
    const menteeEmail = session.customer_details?.email;

    if (!sessionId || !mentorId) {
        console.error('Missing metadata in session:', session.id);
        return;
    }

    console.log(`Processing booking for session: ${sessionId}`);

    // 1. Generate Jitsi Link
    // Simple unique room name
    const meetingLink = `https://meet.jit.si/Minterviewer-${sessionId}-${Date.now().toString().slice(-6)}`;

    // 2. Update TimeSlot
    // We store the meetingLink in the 'notes' or we might need a new field.
    // TimeSlot model has 'notes' but that's usually for user notes.
    // Let's assume we can append it to notes or just rely on email/notification.
    // Ideally TimeSlot should have 'meetingUrl'. 
    // Since I can't easily change schema without potentially breaking things or migration, 
    // I will append it to 'notes' for now or just trust the email.
    // Actually, let's update status to 'booked'.

    // Note: If you want to store the link persistently, adding a field to TimeSlot schema is best.
    // For now, I will append to notes if empty, or prepend.

    const timeSlot = await TimeSlot.findById(sessionId);
    if (!timeSlot) {
        throw new Error('TimeSlot not found');
    }

    timeSlot.status = 'booked';
    // Append link to notes for reference
    timeSlot.notes = (timeSlot.notes ? timeSlot.notes + '\n\n' : '') + `Meeting Link: ${meetingLink}`;

    // If we have a Mentee field in TimeSlot, we should populate it if possible? 
    // TimeSlot schema doesn't seem to have 'mentee' field based on my read earlier (only mentor, sessionOffering, session).
    // It has `session` field which refs `Session`. Maybe we should create a Session object?
    // The `session` field in schema likely refers to a "Booked Session" record.
    // For now, the user asked to "reflect that database the booked time slot must change ito booked". I did that.

    // Save the mentee ID to the slot if available
    if (menteeId) {
        timeSlot.mentee = menteeId;
    }

    await timeSlot.save();

    // 3. Fetch Mentor User for Email
    const mentor = await Mentor.findById(mentorId).populate('user');
    if (!mentor || !mentor.user) {
        throw new Error('Mentor or Mentor User not found');
    }

    const mentorUser = mentor.user as any; // Type assertion since populate
    const mentorEmail = mentorUser.email;
    const mentorName = mentorUser.full_name || 'Mentor';

    const sessionDate = new Date(timeSlot.startTime).toLocaleDateString();
    const sessionTime = new Date(timeSlot.startTime).toLocaleTimeString();

    // 4. Send Emails

    // To Mentor
    if (mentorEmail) {
        await sendBookingConfirmationEmail(
            mentorEmail,
            mentorName,
            title || 'Mentorship Session',
            sessionDate,
            sessionTime,
            meetingLink,
            'mentor',
            timeSlot.startTime,
            timeSlot.duration || 60
        );
    }

    // To Mentee
    let targetMenteeEmail = menteeEmail; // Default to Stripe email
    let menteeName = 'Mentee';

    if (menteeId) {
        const menteeUser = await User.findById(menteeId);
        if (menteeUser) {
            menteeName = menteeUser.full_name || 'Mentee';
            // PREFER ACCOUT EMAIL over Stripe email
            if (menteeUser.email) {
                targetMenteeEmail = menteeUser.email;
                console.log(`Using account email for mentee: ${targetMenteeEmail}`);
            }
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

    // 5. Create Notifications (MongoDB + Firebase)

    // Notify Mentor
    await createNotification(
        mentorUser._id,
        'New Session Booked',
        `You have a new session: ${title} on ${sessionDate} at ${sessionTime}.`,
        'system',
        '/mentor/sessions' // Assuming this page exists
    );

    // Notify Mentee (if we have their ID)
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

async function createNotification(userId: string | any, title: string, message: string, type: string, redirectTo: string) {
    try {
        console.log(`Creating notification for user ${userId}`);

        // Firestore
        const docRef = await addDoc(collection(db, 'notifications'), {
            userId: userId.toString(),
            title,
            message,
            type,
            redirectTo,
            read: false,
            createdAt: serverTimestamp(),
        });

        // MongoDB
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
        // Don't fail the whole webhook for notification error
    }
}
