import NextAuth, { type AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/validators";
import { verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const authConfig: AuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      // Only allow redirects to same origin
      if (url.startsWith("/")) return url;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const validatedFields = loginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            console.log("Validation failed:", validatedFields.error);
            return null;
          }

          const { email, password } = validatedFields.data;
          console.log("Attempting login for:", email);

          // Query database for user
          const user = await prisma.user.findUnique({
            where: { email },
          });

          console.log("User found:", user?.email);

          if (!user) {
            console.log("User not found in database");
            return null;
          }

          const passwordMatch = await verifyPassword(password, user.password);
          console.log("Password match:", passwordMatch);

          if (!passwordMatch) {
            console.log("Password does not match");
            return null;
          }

          console.log("✅ Login successful for:", email);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
};

