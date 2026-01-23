import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { themes } from "@/components/themes";
import type { PortfolioData, ThemeId } from "@/types/portfolio";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ username: string }>;
}

async function getPortfolioByUsername(username: string): Promise<PortfolioData | null> {
  const supabase = await createServerClient();

  // Get user by username
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (!user) {
    return null;
  }

  // Get portfolio
  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_published", true)
    .single();

  if (!portfolio) {
    return null;
  }

  // Get related data
  const [experiences, education, projects, skills, socialLinks] = await Promise.all([
    supabase
      .from("experiences")
      .select("*")
      .eq("portfolio_id", portfolio.id)
      .order("display_order"),
    supabase
      .from("education")
      .select("*")
      .eq("portfolio_id", portfolio.id)
      .order("display_order"),
    supabase
      .from("projects")
      .select("*")
      .eq("portfolio_id", portfolio.id)
      .order("display_order"),
    supabase
      .from("skills")
      .select("*")
      .eq("portfolio_id", portfolio.id)
      .order("display_order"),
    supabase
      .from("social_links")
      .select("*")
      .eq("portfolio_id", portfolio.id)
      .order("display_order"),
  ]);

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
      themeId: portfolio.theme_id || "brutalist",
      isPublished: portfolio.is_published,
      publishedAt: portfolio.published_at,
      createdAt: portfolio.created_at,
      updatedAt: portfolio.updated_at,
    },
    experiences: (experiences.data || []).map((exp) => ({
      id: exp.id,
      portfolioId: exp.portfolio_id,
      company: exp.company,
      position: exp.position,
      location: exp.location || "",
      startDate: exp.start_date || "",
      endDate: exp.end_date || "",
      isCurrent: exp.is_current || false,
      description: exp.description || "",
      displayOrder: exp.display_order,
    })),
    education: (education.data || []).map((edu) => ({
      id: edu.id,
      portfolioId: edu.portfolio_id,
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.field_of_study || "",
      startDate: edu.start_date || "",
      endDate: edu.end_date || "",
      description: edu.description || "",
      displayOrder: edu.display_order,
    })),
    projects: (projects.data || []).map((proj) => ({
      id: proj.id,
      portfolioId: proj.portfolio_id,
      name: proj.name,
      description: proj.description || "",
      url: proj.url || "",
      githubUrl: proj.github_url || "",
      imageUrl: proj.image_url || "",
      technologies: proj.technologies || [],
      displayOrder: proj.display_order,
    })),
    skills: (skills.data || []).map((skill) => ({
      id: skill.id,
      portfolioId: skill.portfolio_id,
      name: skill.name,
      category: skill.category || "",
      proficiencyLevel: skill.proficiency_level || 3,
      displayOrder: skill.display_order,
    })),
    socialLinks: (socialLinks.data || []).map((link) => ({
      id: link.id,
      portfolioId: link.portfolio_id,
      platform: link.platform,
      url: link.url,
      displayOrder: link.display_order,
    })),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const data = await getPortfolioByUsername(username);

  if (!data) {
    return {
      title: "Portfolio Not Found | Link1t",
    };
  }

  return {
    title: `${data.portfolio.fullName || username} | Link1t`,
    description: data.portfolio.bio?.slice(0, 160) || `${data.portfolio.fullName}'s portfolio`,
    openGraph: {
      title: `${data.portfolio.fullName || username}`,
      description: data.portfolio.bio?.slice(0, 160) || `${data.portfolio.fullName}'s portfolio`,
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

  const ThemeComponent = themes[data.portfolio.themeId as ThemeId] || themes.brutalist;

  return <ThemeComponent data={data} />;
}
