import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover' as any,
});

export async function POST(req: Request) {
    try {
        const { sessionId, mentorId, price, title, mentorName, mentorPhoto } = await req.json();

        if (!sessionId || !mentorId || !price) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Fetch mentor to get stripeAccountId
        // We need to import Mentor model and dbConnect if we want to fetch it here, 
        // OR we can pass it from frontend if we trust it (less secure), 
        // OR we can just fetch it here. Let's fetch it for security.
        // But wait, this is a route handler, let's import.
        // Actually, let's keep it simple and fetch it.

        // Dynamic import to avoid circular deps if any, though unlikely here
        const { default: dbConnect } = await import('@/lib/mongodb');
        const { default: Mentor } = await import('@/models/Mentor');

        await dbConnect();
        const mentor = await Mentor.findById(mentorId);

        if (!mentor || !mentor.stripeAccountId) {
            return NextResponse.json(
                { error: 'Mentor has not connected their Stripe account yet.' },
                { status: 400 }
            );
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Mentorship Session: ${title}`,
                            description: `Session with ${mentorName}`,
                            images: mentorPhoto ? [mentorPhoto] : [],
                        },
                        unit_amount: Math.round(price),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/mentee/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/mentee/booking/cancel`,
            payment_intent_data: {
                transfer_data: {
                    destination: mentor.stripeAccountId,
                },
                // Optional: Application fee
                // application_fee_amount: Math.round(price * 0.1), // 10% fee
            },
            metadata: {
                sessionId,
                mentorId,
            },
        });

        return NextResponse.json({ sessionId: checkoutSession.id });
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
