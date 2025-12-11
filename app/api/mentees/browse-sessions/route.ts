// app/api/mentees/browse-sessions/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";
import Mentor from "@/models/Mentor";

// GET /api/mentees/browse-sessions
// Query Params: topic, maxPrice, date, mentorId
export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);

        const topic = searchParams.get("topic");
        const maxPrice = searchParams.get("maxPrice");
        const date = searchParams.get("date");
        const mentorId = searchParams.get("mentorId");

        // Build Match Stage
        const matchStage: any = {
            status: "available",
            startTime: { $gte: new Date() } // Only future slots
        };

        if (mentorId) {
            matchStage.mentor = new mongoose.Types.ObjectId(mentorId);
        }

        if (date) {
            const searchDate = new Date(date);
            const nextDay = new Date(searchDate);
            nextDay.setDate(nextDay.getDate() + 1);

            matchStage.startTime = {
                $gte: searchDate,
                $lt: nextDay
            };
        }

        // Pipeline
        const pipeline = [
            { $match: matchStage },
            // Lookup Mentor
            {
                $lookup: {
                    from: "mentors",
                    localField: "mentor",
                    foreignField: "_id",
                    as: "mentorDocs"
                }
            },
            { $unwind: "$mentorDocs" },
            // Lookup User (for mentor name/photo)
            {
                $lookup: {
                    from: "users",
                    localField: "mentorDocs.user",
                    foreignField: "_id",
                    as: "userDocs"
                }
            },
            { $unwind: "$userDocs" },
            // Extract specific session offering from mentorDocs
            {
                $addFields: {
                    sessionOfferingDetails: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: { $ifNull: ["$mentorDocs.sessionOfferings", []] },
                                    as: "offering",
                                    cond: { $eq: ["$$offering._id", "$sessionOffering"] }
                                }
                            },
                            0
                        ]
                    }
                }
            },

            // Add filters that depend on lookups (Topic, Price)
            // ... (merged below)
        ];

        // Add filters that depend on lookups (Topic, Price)
        // const postFilter defined below...

        // (We need to insert logic here, but replace_file_content is chunky)
        // Let's just redefine the pipeline array end and post-processing

        const postFilter: any = {};

        if (topic) {
            postFilter["sessionOfferingDetails.topic"] = { $regex: topic, $options: "i" };
        }

        if (maxPrice) {
            postFilter["sessionOfferingDetails.price"] = { $lte: parseInt(maxPrice) * 100 }; // Convert to cents
        }

        // Execute aggregate
        if (Object.keys(postFilter).length > 0) {
            pipeline.push({ $match: postFilter });
        }

        // Projection for cleaner response
        pipeline.push({
            $project: {
                _id: 1,
                startTime: 1,
                endTime: 1,
                duration: 1,
                notes: 1,
                mentor: {
                    _id: "$mentorDocs._id",
                    name: "$userDocs.full_name",
                    photo: "$userDocs.profile_photo",
                    role: "$userDocs.role",
                    bio: "$userDocs.short_bio",
                    expertise: "$userDocs.area_of_expertise",
                    focusAreas: "$mentorDocs.focusAreas",
                    experience: "$mentorDocs.yearsOfExperience",
                    rating: "$mentorDocs.rating",
                    reviews: "$mentorDocs.reviewsCount"
                },
                session: {
                    title: "$sessionOfferingDetails.title",
                    topic: "$sessionOfferingDetails.topic",
                    type: "$sessionOfferingDetails.sessionType",
                    price: "$sessionOfferingDetails.price",
                    description: "$sessionOfferingDetails.description"
                }
            }
        });

        // Sort by date soonest
        pipeline.push({ $sort: { startTime: 1 } });

        const slots = await TimeSlot.aggregate(pipeline);

        return NextResponse.json({ slots });
    } catch (error) {
        console.error("Error browsing sessions:", error);
        return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
    }
}
