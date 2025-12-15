"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

export default function BookingSuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            // Trigger confirmation logic (updates DB, sends email if not already done)
            fetch('/api/stripe/confirm-booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId }),
            })
                .then(res => res.json())
                .then(data => {
                    console.log('Booking confirmation result:', data);
                })
                .catch(err => console.error('Confirmation failed:', err));
        }
    }, [sessionId]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 text-center shadow-2xl"
            >
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>

                <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Booking Confirmed!</h1>
                <p className="text-[var(--foreground-muted)] mb-8">
                    Your payment was successful and your session has been booked. You will receive a confirmation email shortly.
                </p>

                <div className="space-y-3">
                    <Link href="/mentee?tab=schedule">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                            View My Sessions
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                    <Link href="/mentee/browse-sessions">
                        <Button variant="outline" className="w-full">
                            Browse More Sessions
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
