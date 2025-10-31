import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    console.log('\n=== FORGOT PASSWORD API CALLED ===');

    try {
        const { email } = await req.json();
        console.log('📧 Email received:', email);

        // Validate email
        if (!email || !email.trim()) {
            console.log('❌ Validation failed: empty email');
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ Validation failed: invalid email format');
            return NextResponse.json(
                { error: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        console.log('✅ Email validated');

        // Connect to database
        await dbConnect();
        console.log('✅ Database connected');

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        console.log('👤 User search result:', user ? `Found: ${user.email}` : 'Not found');

        // Security: Always return success to prevent email enumeration
        if (!user) {
            console.log('⚠️ User not found - returning success for security');
            return NextResponse.json({
                success: true,
                message: 'If an account exists with this email, you will receive a password reset link shortly.',
            });
        }

        console.log('👤 User details:', {
            id: user._id.toString(),
            email: user.email,
            name: user.full_name || 'No name',
        });

        // Generate secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        console.log('🔑 Reset token generated (length):', resetToken.length);

        // Hash the token
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        console.log('🔒 Token hashed');

        // Save to database
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();
        console.log('💾 Token saved to database');
        console.log('⏰ Token expires at:', user.resetPasswordExpires.toISOString());

        // Send email
        console.log('\n📧 Calling sendPasswordResetEmail function...');
        console.log('📧 Parameters:');
        console.log('   - email:', user.email);
        console.log('   - userName:', user.full_name || 'User');
        console.log('   - token length:', resetToken.length);

        const emailResult = await sendPasswordResetEmail(
            user.email,
            resetToken,
            user.full_name || 'User'
        );

        console.log('\n📬 Email function returned:', emailResult);

        if (!emailResult.success) {
            console.error('❌ Email sending failed:', emailResult.error);
            // Don't expose error to user for security
        } else {
            console.log('✅ Email sent successfully!');
            console.log('📬 Message ID:', emailResult.messageId);
        }

        console.log('\n=== FORGOT PASSWORD API COMPLETED ===\n');

        return NextResponse.json({
            success: true,
            message: 'Password reset link has been sent to your email address.',
        });

    } catch (error) {
        console.error('\n❌ FORGOT PASSWORD ERROR:');
        console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
        console.error('Error message:', error instanceof Error ? error.message : String(error));
        console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');

        return NextResponse.json(
            { error: 'An error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}

// Test endpoint
export async function GET() {
    return NextResponse.json({
        message: 'Forgot password API is running. Use POST to reset password.',
        status: 'ok',
        timestamp: new Date().toISOString()
    });
}