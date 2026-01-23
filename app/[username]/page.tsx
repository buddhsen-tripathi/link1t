import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { themes } from "@/components/themes";
import { DEFAULT_SECTION_ORDER } from "@/types/portfolio";
import type { PortfolioData, ThemeId } from "@/types/portfolio";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ username: string }>;
}

async function getPortfolioByUsername(
  username: string
): Promise<PortfolioData | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Get user by username
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (!user) {
    return null;
  }

  // Get portfolio (now includes all content in JSONB)
  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_published", true)
    .single();

  if (!portfolio) {
    return null;
  }

  // Extract content from JSONB
  const content = portfolio.content || {
    experiences: [],
    education: [],
    projects: [],
    skills: [],
    socialLinks: [],
  };

  // Transform database format to app format
  return {
    portfolio: {
      id: portfolio.id,
      userId: portfolio.user_id,
      fullName: portfolio.full_name || "",
      title: portfolio.title || "",
      email: portfolio.email || "",
      phone: portfolio.phone || "",
      location: portfolio.location || "",
      profileImageUrl: portfolio.profile_image_url || "",
      bio: portfolio.bio || "",
      themeId: (portfolio.theme_id || "brutalist") as ThemeId,
      sectionOrder: portfolio.section_order || DEFAULT_SECTION_ORDER,
      isPublished: portfolio.is_published || false,
      publishedAt: portfolio.published_at,
      createdAt: portfolio.created_at,
      updatedAt: portfolio.updated_at,
    },
    experiences: content.experiences || [],
    education: content.education || [],
    projects: content.projects || [],
    skills: content.skills || [],
    socialLinks: content.socialLinks || [],
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const data = await getPortfolioByUsername(username);

  if (!data) {
    return {
      title: "Portfolio Not Found | Link1t",
    };
  }

  return {
    title: `${data.portfolio.fullName || username} | Link1t`,
    description:
      data.portfolio.bio?.slice(0, 160) ||
      `${data.portfolio.fullName}'s portfolio`,
    openGraph: {
      title: `${data.portfolio.fullName || username}`,
      description:
        data.portfolio.bio?.slice(0, 160) ||
        `${data.portfolio.fullName}'s portfolio`,
      type: "profile",
    },
  };
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { username } = await params;
  const data = await getPortfolioByUsername(username);

  if (!data) {
    notFound();
  }

  const ThemeComponent =
    themes[data.portfolio.themeId as ThemeId] || themes.brutalist;

  return <ThemeComponent data={data} />;
}
