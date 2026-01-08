import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";
import Mentor from "@/models/Mentor";
import { getUserFromToken } from "@/lib/auth-helper";
import mongoose from "mongoose";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    try {
        const authData = await getUserFromToken(request);
        if (!authData || authData.role !== 'mentor') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // 1. Get Mentor Profile & Offerings
        const mentor = await Mentor.findOne({ user: authData.id });
        if (!mentor) {
            return NextResponse.json({ error: 'Mentor profile not found' }, { status: 404 });
        }

        // Create a map of Offering ID -> Details (Price, Title)
        const offeringsMap = new Map();
        mentor.sessionOfferings.forEach((off: any) => {
            offeringsMap.set(off._id.toString(), {
                title: off.title,
                price: off.price || 0, // Assuming price is stored
                type: off.sessionType
            });
        });

        // 2. Fetch All Booked Sessions (Past & Future)
        const allSessions = await TimeSlot.find({
            mentor: mentor._id,
            status: 'booked'
        })
            .populate('mentee', 'full_name profile_photo')
            .sort({ startTime: -1 })
            .lean();

        const now = new Date();

        let totalEarnings = 0;
        let totalSessions = 0;
        let pendingEarnings = 0;
        const monthlyEarningsMap: Record<string, number> = {};
        const transactions: any[] = [];
        const sessionTypeStats: Record<string, { count: number, earnings: number }> = {};

        // Initialize last 6 months in map to ensure 0s are present
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthKey = d.toLocaleString('default', { month: 'short' });
            monthlyEarningsMap[monthKey] = 0;
        }

        allSessions.forEach((slot: any) => {
            const offeringId = slot.sessionOffering?.toString();
            const offering = offeringsMap.get(offeringId) || { price: 0, title: 'Unknown Session', type: 'Custom' };
            const priceInCents = offering.price;
            const priceInDollars = priceInCents / 100; // Convert cents to dollars
            const isCompleted = new Date(slot.endTime) < now;

            if (isCompleted) {
                // Completed Session
                totalEarnings += priceInDollars;
                totalSessions++;

                // Monthly Stats
                const monthKey = new Date(slot.startTime).toLocaleString('default', { month: 'short' });
                if (monthlyEarningsMap[monthKey] !== undefined) {
                    monthlyEarningsMap[monthKey] = (monthlyEarningsMap[monthKey] || 0) + priceInDollars;
                }

                // Session Type Stats
                if (!sessionTypeStats[offering.title]) {
                    sessionTypeStats[offering.title] = { count: 0, earnings: 0 };
                }
                sessionTypeStats[offering.title].count++;
                sessionTypeStats[offering.title].earnings += priceInDollars;

                // Transaction History
                transactions.push({
                    id: slot._id,
                    menteeName: slot.mentee?.full_name || 'Unknown Mentee',
                    menteeAvatar: slot.mentee?.profile_photo,
                    sessionType: offering.title,
                    amount: priceInDollars,
                    date: new Date(slot.startTime).toLocaleDateString(),
                    status: 'completed'
                });

            } else {
                // Pending Session (Future)
                pendingEarnings += priceInDollars;
                // Add to transactions as pending
                transactions.push({
                    id: slot._id,
                    menteeName: slot.mentee?.full_name || 'Unknown Mentee',
                    menteeAvatar: slot.mentee?.profile_photo,
                    sessionType: offering.title,
                    amount: priceInDollars,
                    date: new Date(slot.startTime).toLocaleDateString(),
                    status: 'pending'
                });
            }
        });

        const avgPerSession = totalSessions > 0 ? Math.round(totalEarnings / totalSessions) : 0;

        // Format Monthly Data for Chart
        // Order months chronologically - simplified for now: just map the object
        // Better: Generate last 6 months explicit keys
        const chartData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthKey = d.toLocaleString('default', { month: 'short' });
            chartData.push({
                month: monthKey,
                earnings: monthlyEarningsMap[monthKey] || 0
            });
        }

        // Format Session Pricing/Stats
        const sessionsBreakdown = Object.entries(sessionTypeStats).map(([type, stats]) => ({
            type,
            sessions: stats.count,
            earnings: stats.earnings,
            price: stats.count > 0 ? Math.round(stats.earnings / stats.count) : 0
        }));

        return NextResponse.json({
            success: true,
            data: {
                totalEarnings,
                totalSessions,
                avgPerSession,
                pendingEarnings,
                chartData,
                transactions: transactions.slice(0, 10), // Recent 10
                sessionsBreakdown
            }
        });

    } catch (error) {
        console.error('Earnings API Error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
