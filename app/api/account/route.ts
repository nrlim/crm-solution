import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const updateAccountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "Password must be at least 8 characters").optional(),
});

// GET - Fetch user account information
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        organizationId: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get organization info
    const organization = user.organizationId
      ? await prisma.organization.findUnique({
          where: { id: user.organizationId },
          select: { id: true, name: true, createdAt: true },
        })
      : null;

    return NextResponse.json(
      {
        user: {
          ...user,
          organization,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get account error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update user account information
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = updateAccountSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, currentPassword, newPassword } = validation.data;
    const userId = session.user.id as string;

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, password: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password required to set new password" },
          { status: 400 }
        );
      }

      const passwordMatch = await bcrypt.compare(currentPassword, currentUser.password);
      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }
    }

    // Hash new password if provided
    let hashedPassword = undefined;
    if (newPassword) {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(hashedPassword && { password: hashedPassword }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        organizationId: true,
      },
    });

    return NextResponse.json(
      { message: "Account updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update account error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Password required to delete account" },
        { status: 400 }
      );
    }

    const userId = session.user.id as string;

    // Verify password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Password is incorrect" },
        { status: 401 }
      );
    }

    // Delete user and related data
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
