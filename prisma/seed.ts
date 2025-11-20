import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

async function main() {
  try {
    // Check if demo user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "demo@example.com" },
    });

    if (existingUser) {
      console.log("Demo user already exists");
      return;
    }

    // Hash the demo password
    const hashedPassword = await hashPassword("Demo123!");

    // Create demo user
    const demoUser = await prisma.user.create({
      data: {
        email: "demo@example.com",
        name: "Demo User",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Demo user created:", demoUser);
  } catch (error) {
    console.error("Seed error:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
