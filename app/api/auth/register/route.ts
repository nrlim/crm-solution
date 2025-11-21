import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedFields = registerSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password, name } = validatedFields.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create default organization for user
    const organization = await prisma.organization.create({
      data: {
        name: `${name}'s Organization`,
      },
    });

    // Create user in database with organization
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "USER",
        organizationId: organization.id,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
