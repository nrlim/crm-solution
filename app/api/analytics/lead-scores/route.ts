import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import { prisma } from "@/lib/prisma";

// Lead scoring algorithm
function calculateLeadScore(lead: any): number {
  let score = 0;

  // Base score for status (40 points max)
  const statusScores: Record<string, number> = {
    NEW: 10,
    CONTACTED: 25,
    QUALIFIED: 40,
    UNQUALIFIED: 0,
    CONVERTED: 100,
    LOST: 0,
  };
  score += statusScores[lead.status] || 0;

  // Source score (20 points max)
  const sourceScores: Record<string, number> = {
    REFERRAL: 20,
    WEBSITE: 15,
    EMAIL: 15,
    SOCIAL_MEDIA: 12,
    EVENT: 18,
    COLD_CALL: 10,
    OTHER: 5,
  };
  score += sourceScores[lead.source] || 0;

  // Value score (20 points max)
  if (lead.value >= 10000) score += 20;
  else if (lead.value >= 5000) score += 15;
  else if (lead.value >= 1000) score += 10;
  else if (lead.value > 0) score += 5;

  // Recency score (20 points max)
  const daysOld = Math.floor(
    (new Date().getTime() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysOld <= 7) score += 20;
  else if (daysOld <= 14) score += 15;
  else if (daysOld <= 30) score += 10;
  else if (daysOld <= 60) score += 5;

  return Math.min(100, Math.max(0, score));
}

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
        { leads: [] },
        { status: 200 }
      );
    }

    const leads = await prisma.lead.findMany({
      where: { organizationId: user.organizationId },
      include: { contact: true },
      orderBy: { createdAt: "desc" },
    });

    // Calculate scores for each lead
    const leadsWithScores = leads.map((lead) => {
      const calculatedScore = calculateLeadScore(lead);
      return {
        ...lead,
        calculatedScore,
        scoreHealth: getScoreHealth(calculatedScore),
        scoreLabel: getScoreLabel(calculatedScore),
      };
    });

    return NextResponse.json(
      {
        leads: leadsWithScores,
        summary: {
          hotLeads: leadsWithScores.filter((l) => l.calculatedScore >= 75).length,
          warmLeads: leadsWithScores.filter((l) => l.calculatedScore >= 50 && l.calculatedScore < 75).length,
          coldLeads: leadsWithScores.filter((l) => l.calculatedScore < 50).length,
          averageScore: Math.round(
            leadsWithScores.reduce((sum, l) => sum + l.calculatedScore, 0) / leadsWithScores.length || 0
          ),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get lead scores error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getScoreHealth(score: number): "hot" | "warm" | "cold" {
  if (score >= 75) return "hot";
  if (score >= 50) return "warm";
  return "cold";
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Very Good";
  if (score >= 60) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 30) return "Poor";
  return "Very Poor";
}
