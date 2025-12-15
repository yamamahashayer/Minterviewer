import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Dynamic import to avoid circular deps
    const { default: dbConnect } = await import('@/lib/mongodb');
    const { default: Mentor } = await import('@/models/Mentor');

    await dbConnect();
    
    // Count mentors with and without Stripe accounts
    const totalMentors = await Mentor.countDocuments();
    const mentorsWithStripe = await Mentor.countDocuments({ 
      stripeAccountId: { $exists: true, $ne: "" } 
    });
    const mentorsWithoutStripe = totalMentors - mentorsWithStripe;

    // Get some sample mentors
    const sampleMentors = await Mentor.find({})
      .select('name stripeAccountId sessionOfferings')
      .limit(5)
      .lean();

    return NextResponse.json({
      totalMentors,
      mentorsWithStripe,
      mentorsWithoutStripe,
      sampleMentors,
      stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
      publishableKeyConfigured: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      appUrlConfigured: !!process.env.NEXT_PUBLIC_APP_URL
    });
  } catch (error: any) {
    console.error('Error checking Stripe setup:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
