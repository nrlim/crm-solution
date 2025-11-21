import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
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
        {
          stats: {
            totalLeads: 0,
            totalContacts: 0,
            totalValue: 0,
            conversionRate: 0,
          },
          funnel: {
            leads: 0,
            contacts: 0,
            deals: 0,
            converted: 0,
          },
          insights: [],
        },
        { status: 200 }
      );
    }

    const organizationId = user.organizationId;

    // Get statistics
    const [totalLeads, totalContacts, allLeads] = await Promise.all([
      prisma.lead.count({ where: { organizationId } }),
      prisma.contact.count({ where: { organizationId } }),
      prisma.lead.findMany({
        where: { organizationId },
        select: { id: true, value: true, status: true, contactId: true, createdAt: true, score: true },
      }),
    ]);

    const totalValue = allLeads.reduce((sum, lead) => sum + Number(lead.value), 0);
    const leadsWithContacts = allLeads.filter((l) => l.contactId).length;

    // Get funnel data
    const newLeads = allLeads.filter((l) => l.status === "NEW").length;
    const contactedLeads = allLeads.filter((l) => l.status === "CONTACTED").length;
    const qualifiedLeads = allLeads.filter((l) => l.status === "QUALIFIED").length;
    const convertedLeads = allLeads.filter((l) => l.status === "CONVERTED").length;
    const conversionRate = totalLeads > 0 ? Math.round((leadsWithContacts / totalLeads) * 100) : 0;

    // Generate insights
    const insights = generateInsights(
      allLeads,
      totalLeads,
      totalContacts,
      conversionRate
    );

    return NextResponse.json(
      {
        stats: {
          totalLeads,
          totalContacts,
          totalValue,
          conversionRate,
        },
        funnel: {
          new: newLeads,
          contacted: contactedLeads,
          qualified: qualifiedLeads,
          converted: convertedLeads,
        },
        insights,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get dashboard analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateInsights(
  leads: any[],
  totalLeads: number,
  totalContacts: number,
  conversionRate: number
) {
  const insights: any[] = [];
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Insight 1: Hot prospects (High score + Recent + Qualified)
  const hotProspects = leads.filter(
    (l) => l.score >= 75 && l.status === "QUALIFIED" && new Date(l.createdAt) > sevenDaysAgo
  );
  if (hotProspects.length > 0) {
    insights.push({
      type: "hot-prospects",
      title: "🔥 Hot Prospects",
      description: `${hotProspects.length} highly qualified leads ready to close`,
      count: hotProspects.length,
      color: "red",
      action: "View Prospects",
    });
  }

  // Insight 2: Stale leads (Not contacted in 7 days)
  const stalLeads = leads.filter(
    (l) => l.status === "NEW" && new Date(l.createdAt) < sevenDaysAgo
  );
  if (stalLeads.length > 0) {
    insights.push({
      type: "stale-leads",
      title: "📉 Stale Leads",
      description: `${stalLeads.length} leads haven't been contacted in a week`,
      count: stalLeads.length,
      color: "orange",
      action: "Follow Up",
    });
  }

  // Insight 3: High-value leads
  const highValueLeads = leads.filter((l) => l.value >= 5000).length;
  if (highValueLeads > 0) {
    const highValue = leads
      .filter((l) => l.value >= 5000)
      .reduce((sum, l) => sum + Number(l.value), 0);
    insights.push({
      type: "high-value",
      title: "💰 High-Value Leads",
      description: `${highValueLeads} leads worth $${(highValue / 1000).toFixed(1)}k`,
      count: highValueLeads,
      color: "green",
      action: "Prioritize",
    });
  }

  // Insight 4: Conversion opportunity
  if (conversionRate < 50 && totalLeads > 5) {
    insights.push({
      type: "conversion-opportunity",
      title: "📈 Conversion Gap",
      description: `Only ${conversionRate}% of leads have become contacts. Boost engagement!`,
      count: conversionRate,
      color: "blue",
      action: "Improve Strategy",
    });
  }

  // Insight 5: Activity needed
  const inactiveLeads = leads.filter(
    (l) => l.status === "CONTACTED" && new Date(l.createdAt) < sevenDaysAgo
  ).length;
  if (inactiveLeads > 2) {
    insights.push({
      type: "activity-needed",
      title: "⚠️ Inactive Leads",
      description: `${inactiveLeads} leads need follow-up contact`,
      count: inactiveLeads,
      color: "yellow",
      action: "Schedule Calls",
    });
  }

  return insights;
}
