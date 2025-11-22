import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/leads - Get leads for user
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get("userId");
        const status = searchParams.get("status");
        const limit = parseInt(searchParams.get("limit") || "50");

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        const where: any = {
            OR: [
                { assignedTo: userId },
                { assignedTo: null }, // Unassigned leads
            ],
        };

        if (status) {
            where.status = status;
        }

        const leads = await prisma.lead.findMany({
            where,
            take: limit,
            orderBy: {
                detectedAt: "desc",
            },
        });

        return NextResponse.json({ leads });
    } catch (error: any) {
        console.error("Leads API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch leads" },
            { status: 500 }
        );
    }
}

// POST /api/leads - Create new lead
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            address,
            city,
            state,
            zipCode,
            lat,
            lng,
            damageType,
            damageScore,
            estimatedCostMin,
            estimatedCostMax,
            stormEvent,
            contactInfo,
        } = body;

        if (!address || !city || !state || !zipCode) {
            return NextResponse.json(
                { error: "Address, city, state, and zipCode are required" },
                { status: 400 }
            );
        }

        const lead = await prisma.lead.create({
            data: {
                address,
                city,
                state,
                zipCode,
                lat: lat || null,
                lng: lng || null,
                damageType: Array.isArray(damageType) ? JSON.stringify(damageType) : damageType,
                damageScore: damageScore || 5,
                estimatedCostMin: estimatedCostMin || 0,
                estimatedCostMax: estimatedCostMax || 0,
                stormEvent: stormEvent || null,
                contactInfo: contactInfo ? JSON.stringify(contactInfo) : null,
            },
        });

        // TODO: Send notifications to contractors
        // await notifyContractors(lead);

        return NextResponse.json({ lead });
    } catch (error: any) {
        console.error("Create Lead Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create lead" },
            { status: 500 }
        );
    }
}

// PATCH /api/leads/:id - Update lead (assign, update status, etc.)
export async function PATCH(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const leadId = searchParams.get("id");
        const body = await request.json();

        if (!leadId) {
            return NextResponse.json(
                { error: "Lead ID is required" },
                { status: 400 }
            );
        }

        const updateData: any = {};
        if (body.assignedTo !== undefined) updateData.assignedTo = body.assignedTo;
        if (body.status !== undefined) updateData.status = body.status;
        if (body.notes !== undefined) updateData.notes = body.notes;

        const lead = await prisma.lead.update({
            where: { id: leadId },
            data: updateData,
        });

        return NextResponse.json({ lead });
    } catch (error: any) {
        console.error("Update Lead Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update lead" },
            { status: 500 }
        );
    }
}

