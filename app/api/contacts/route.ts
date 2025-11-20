import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { contactSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";

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
        { contacts: [], total: 0, page: 1, pages: 0 },
        { status: 200 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const q = searchParams.get("q");

    const organizationId = user.organizationId;

    let contacts;
    let total = 0;

    if (q) {
      // Search contacts
      contacts = await prisma.contact.findMany({
        where: {
          organizationId,
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { company: { contains: q, mode: "insensitive" } },
          ],
        },
        orderBy: { createdAt: "desc" },
      });
      total = contacts.length;
    } else {
      // Get paginated contacts
      total = await prisma.contact.count({
        where: { organizationId },
      });

      contacts = await prisma.contact.findMany({
        where: { organizationId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      });
    }

    const pages = Math.ceil(total / limit);

    return NextResponse.json(
      { contacts, total, page, pages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get contacts error:", error);
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

    // Validate input
    const validatedFields = contactSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Get organization from user or create default
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      include: { organization: true },
    });

    let organizationId = user?.organizationId;

    // If user has no organization, create one or use default
    if (!organizationId) {
      // Create default organization for user
      const org = await prisma.organization.create({
        data: {
          name: `${user?.name}'s Organization`,
          email: user?.email,
        },
      });
      organizationId = org.id;

      // Update user with organization
      await prisma.user.update({
        where: { id: session.user.id as string },
        data: { organizationId },
      });
    }

    const contact = await prisma.contact.create({
      data: {
        ...validatedFields.data,
        organizationId,
        ownerId: session.user.id as string,
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Create contact error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
