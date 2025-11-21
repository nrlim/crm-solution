import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

interface Params {
  id: string;
}

const leadUpdateSchema = z.object({
  source: z.enum([
    "WEBSITE",
    "REFERRAL",
    "COLD_CALL",
    "EMAIL",
    "SOCIAL_MEDIA",
    "EVENT",
    "OTHER",
  ]).optional(),
  status: z.enum([
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "UNQUALIFIED",
    "CONVERTED",
    "LOST",
  ]).optional(),
  score: z.number().int().min(0).max(100).optional(),
  value: z.number().optional(),
  expectedCloseDate: z.string().date().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { contact: true },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    // Check organization access
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { organizationId: true },
    });

    if (lead.organizationId !== user?.organizationId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json(lead, { status: 200 });
  } catch (error) {
    console.error("Get lead error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Partial validation
    const validatedFields = leadUpdateSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Check organization access
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { organizationId: true },
    });

    const lead = await prisma.lead.findUnique({
      where: { id },
      select: { organizationId: true },
    });

    if (!lead || lead.organizationId !== user?.organizationId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const updateData: any = { ...validatedFields.data };
    if (validatedFields.data.expectedCloseDate !== undefined) {
      updateData.expectedCloseDate = validatedFields.data.expectedCloseDate
        ? new Date(validatedFields.data.expectedCloseDate)
        : null;
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: updateData,
      include: { contact: true },
    });

    return NextResponse.json(updatedLead, { status: 200 });
  } catch (error) {
    console.error("Update lead error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check organization access
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { organizationId: true },
    });

    const lead = await prisma.lead.findUnique({
      where: { id },
      select: { organizationId: true },
    });

    if (!lead || lead.organizationId !== user?.organizationId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Lead deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete lead error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
