import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import { getUserFromToken, getMentorFromUser } from '@/lib/auth-helper';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover' as any,
});

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        // Reuse shared auth helper to get authenticated user
        const authUser = await getUserFromToken(req);

        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Ensure only mentors can connect Stripe
        if (authUser.role !== 'mentor') {
            return NextResponse.json({ error: 'Only mentors can connect Stripe' }, { status: 403 });
        }

        // Get mentor document linked to this user
        const mentor = await getMentorFromUser(authUser.id);

        if (!mentor) {
            return NextResponse.json({ error: 'Mentor profile not found' }, { status: 404 });
        }

        let accountId = mentor.stripeAccountId;

        if (!accountId) {
            const account = await stripe.accounts.create({
                type: 'express',
                country: 'IL', // Default to US for now, or make dynamic
                email: authUser.email, // Use email from authUser
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
            });

            accountId = account.id;
            mentor.stripeAccountId = accountId;
            await mentor.save();
        }

        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/mentor/settings?tab=profile`,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/mentor/settings?tab=profile&stripe_connected=true`,
            type: 'account_onboarding',
        });

        return NextResponse.json({ url: accountLink.url });
    } catch (error: any) {
        console.error('Error creating Stripe Connect link:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
