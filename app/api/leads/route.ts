import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Lead validation schema
const leadSchema = z.object({
  contactId: z.string().min(1, "Contact is required"),
  source: z.enum([
    "WEBSITE",
    "REFERRAL",
    "COLD_CALL",
    "EMAIL",
    "SOCIAL_MEDIA",
    "EVENT",
    "OTHER",
  ]),
  status: z.enum([
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "UNQUALIFIED",
    "CONVERTED",
    "LOST",
  ]),
  score: z.number().int().min(0).max(100).optional().default(0),
  value: z.number().optional().default(0),
  expectedCloseDate: z.string().date().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { organizationId: true },
    });

    if (!user?.organizationId) {
      return NextResponse.json(
        { leads: [], total: 0, page: 1, pages: 0 },
        { status: 200 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    const organizationId = user.organizationId;

    // Build where clause
    const whereClause: any = {
      organizationId,
    };

    if (status) {
      whereClause.status = status;
    }

    if (q) {
      whereClause.OR = [
        { contact: { firstName: { contains: q, mode: "insensitive" } } },
        { contact: { lastName: { contains: q, mode: "insensitive" } } },
        { contact: { email: { contains: q, mode: "insensitive" } } },
      ];
    }

    const total = await prisma.lead.count({ where: whereClause });

    const leads = await prisma.lead.findMany({
      where: whereClause,
      include: { contact: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const pages = Math.ceil(total / limit);

    return NextResponse.json(
      { leads, total, page, pages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get leads error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Create lead request body:', body);

    // Validate input
    const validatedFields = leadSchema.safeParse(body);

    if (!validatedFields.success) {
      console.log('Validation errors:', validatedFields.error.flatten().fieldErrors);
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    console.log('Validated fields:', validatedFields.data);

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { organizationId: true },
    });

    if (!user?.organizationId) {
      console.log('User organization not found for user:', session.user.id);
      return NextResponse.json(
        { error: "User organization not found" },
        { status: 400 }
      );
    }

    // Verify contact exists in user's organization
    const contact = await prisma.contact.findUnique({
      where: { id: validatedFields.data.contactId },
      select: { organizationId: true },
    });

    if (!contact || contact.organizationId !== user.organizationId) {
      console.log('Contact not found or access denied:', {
        contactId: validatedFields.data.contactId,
        contactOrgId: contact?.organizationId,
        userOrgId: user.organizationId,
      });
      return NextResponse.json(
        { error: "Contact not found or access denied" },
        { status: 404 }
      );
    }

    const leadData = {
      ...validatedFields.data,
      organizationId: user.organizationId,
      expectedCloseDate: validatedFields.data.expectedCloseDate
        ? new Date(validatedFields.data.expectedCloseDate)
        : null,
    };

    console.log('Creating lead with data:', leadData);

    const lead = await prisma.lead.create({
      data: leadData,
      include: { contact: true },
    });

    console.log('Lead created successfully:', lead);

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
