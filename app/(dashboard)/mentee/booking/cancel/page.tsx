"use client";

import { motion } from 'framer-motion';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

export default function BookingCancelPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 text-center shadow-2xl"
            >
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-500" />
                </div>

                <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Booking Cancelled</h1>
                <p className="text-[var(--foreground-muted)] mb-8">
                    Your payment was cancelled and no charges were made. You can try booking again whenever you're ready.
                </p>

                <div className="space-y-3">
                    <Link href="/mentee/browse-sessions">
                        <Button className="w-full bg-[var(--foreground)] text-[var(--background)] hover:opacity-90">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Return to Browse Sessions
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
