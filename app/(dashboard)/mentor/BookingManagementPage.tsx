"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Calendar, DollarSign } from 'lucide-react';
import { TimeSlotManager } from '../../components/MentorPages/TimeSlotManager';
import { SessionOfferingsManager } from '../../components/MentorPages/SessionOfferingsManager';

export default function MentorBookingManagementPage() {
    const [activeTab, setActiveTab] = useState('timeslots');

    return (
        <div className="min-h-screen" style={{ background: 'var(--background)' }}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="max-w-[1200px] mx-auto px-8">
                        <TabsList className="bg-transparent border-0">
                            <TabsTrigger
                                value="timeslots"
                                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Time Slots
                            </TabsTrigger>
                            <TabsTrigger
                                value="offerings"
                                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                            >
                                <DollarSign className="w-4 h-4 mr-2" />
                                Session Offerings
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </div>

                <TabsContent value="timeslots" className="mt-0">
                    <TimeSlotManager />
                </TabsContent>

                <TabsContent value="offerings" className="mt-0">
                    <SessionOfferingsManager />
                </TabsContent>
            </Tabs>
        </div>
    );
}
