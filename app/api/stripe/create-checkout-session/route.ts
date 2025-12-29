import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover' as any,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('📥 Received checkout request:', body);

        const { sessionId, mentorId, menteeId, price, title, mentorName, mentorPhoto } = body;

        console.log('💰 Price value:', price, 'Type:', typeof price);
        console.log('🔑 Required fields check:', { sessionId, mentorId, price });

        if (!sessionId || !mentorId || !price) {
            console.error('❌ Missing required fields:', { sessionId, mentorId, price });
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
        console.log('📦 Importing database modules...');
        const { default: dbConnect } = await import('@/lib/mongodb');
        const { default: Mentor } = await import('@/models/Mentor');

        console.log('🔌 Connecting to database...');
        await dbConnect();
        console.log('🔍 Fetching mentor with ID:', mentorId);
        const mentor = await Mentor.findById(mentorId);
        console.log('👤 Mentor found:', mentor ? `${mentor.name} (Stripe: ${mentor.stripeAccountId || 'none'})` : 'NOT FOUND');

        if (!mentor) {
            return NextResponse.json(
                { error: 'Mentor not found' },
                { status: 404 }
            );
        }

        // Create checkout session with transfer if mentor has Stripe account
        console.log('🛠️ Building session config...');
        console.log('🌐 App URL:', process.env.NEXT_PUBLIC_APP_URL);

        const sessionConfig: any = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Mentorship Session: ${title}`,
                            description: `Session with ${mentorName}`,
                            // Only use valid HTTP(S) URLs, not base64 data (causes "request too large" error)
                            images: mentorPhoto && (mentorPhoto.startsWith('http://') || mentorPhoto.startsWith('https://'))
                                ? [mentorPhoto]
                                : [],
                        },
                        unit_amount: Math.round(price),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/mentee/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/mentee/booking/cancel`,
            metadata: {
                sessionId,
                mentorId,
                menteeId,
                mentorName,
                title,
            },
        };

        console.log('✅ Session config created:', JSON.stringify(sessionConfig, null, 2));

        // Add transfer_data if mentor has Stripe account
        if (mentor.stripeAccountId) {
            console.log('💸 Adding transfer to mentor Stripe account:', mentor.stripeAccountId);
            sessionConfig.payment_intent_data = {
                transfer_data: {
                    destination: mentor.stripeAccountId,
                },
            };
        } else {
            console.log('⚠️ No Stripe account for mentor, using platform account');
        }

        try {
            console.log('🚀 Creating Stripe checkout session...');
            const checkoutSession = await stripe.checkout.sessions.create(sessionConfig);
            console.log('✅ Checkout session created:', checkoutSession.id);
            return NextResponse.json({
                sessionId: checkoutSession.id,
                url: checkoutSession.url
            });
        } catch (transferError: any) {
            // If transfer fails due to capabilities, fallback to platform account
            if (transferError.message?.includes('capabilities') || transferError.message?.includes('destination')) {
                console.warn('Transfer failed, using platform account:', transferError.message);

                // Remove transfer_data and retry
                delete sessionConfig.payment_intent_data;
                const fallbackSession = await stripe.checkout.sessions.create(sessionConfig);
                return NextResponse.json({
                    sessionId: fallbackSession.id,
                    url: fallbackSession.url,
                    warning: 'Payment will be processed by platform account instead of mentor account'
                });
            }
            return NextResponse.json(
                { error: transferError.message || 'Failed to create payment session' },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
