import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { portfolioDataSchema } from "@/lib/validations/portfolio";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServerClient();

    // Get or create user
    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    if (!user) {
      // Create user if doesn't exist
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({ clerk_id: userId, email: "" })
        .select()
        .single();

      if (createError) {
        console.error("Error creating user:", createError);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
      }
      user = newUser;
    }

    // Get portfolio with related data
    const { data: portfolio } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!portfolio) {
      // Return empty portfolio structure
      return NextResponse.json({
        portfolio: null,
        experiences: [],
        education: [],
        projects: [],
        skills: [],
        socialLinks: [],
      });
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

    return NextResponse.json({
      portfolio,
      experiences: experiences.data || [],
      education: education.data || [],
      projects: projects.data || [],
      skills: skills.data || [],
      socialLinks: socialLinks.data || [],
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const supabase = await createServerClient();

    // Get user
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if portfolio already exists
    const { data: existingPortfolio } = await supabase
      .from("portfolios")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existingPortfolio) {
      return NextResponse.json(
        { error: "Portfolio already exists. Use PUT to update." },
        { status: 400 }
      );
    }

    // Create portfolio
    const { data: portfolio, error: portfolioError } = await supabase
      .from("portfolios")
      .insert({
        user_id: user.id,
        full_name: body.portfolio?.fullName || "",
        title: body.portfolio?.title || "",
        email: body.portfolio?.email || "",
        phone: body.portfolio?.phone || "",
        location: body.portfolio?.location || "",
        profile_image_url: body.portfolio?.profileImageUrl || "",
        bio: body.portfolio?.bio || "",
        theme_id: body.portfolio?.themeId || "brutalist",
      })
      .select()
      .single();

    if (portfolioError) {
      console.error("Error creating portfolio:", portfolioError);
      return NextResponse.json({ error: "Failed to create portfolio" }, { status: 500 });
    }

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const supabase = await createServerClient();

    // Get user
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get or create portfolio
    let { data: portfolio } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!portfolio) {
      // Create new portfolio
      const { data: newPortfolio, error: createError } = await supabase
        .from("portfolios")
        .insert({
          user_id: user.id,
          full_name: body.portfolio?.fullName || "",
          title: body.portfolio?.title || "",
          email: body.portfolio?.email || "",
          phone: body.portfolio?.phone || "",
          location: body.portfolio?.location || "",
          profile_image_url: body.portfolio?.profileImageUrl || "",
          bio: body.portfolio?.bio || "",
          theme_id: body.portfolio?.themeId || "brutalist",
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating portfolio:", createError);
        return NextResponse.json({ error: "Failed to create portfolio" }, { status: 500 });
      }
      portfolio = newPortfolio;
    } else {
      // Update existing portfolio
      const { error: updateError } = await supabase
        .from("portfolios")
        .update({
          full_name: body.portfolio?.fullName || "",
          title: body.portfolio?.title || "",
          email: body.portfolio?.email || "",
          phone: body.portfolio?.phone || "",
          location: body.portfolio?.location || "",
          profile_image_url: body.portfolio?.profileImageUrl || "",
          bio: body.portfolio?.bio || "",
          theme_id: body.portfolio?.themeId || "brutalist",
          updated_at: new Date().toISOString(),
        })
        .eq("id", portfolio.id);

      if (updateError) {
        console.error("Error updating portfolio:", updateError);
        return NextResponse.json({ error: "Failed to update portfolio" }, { status: 500 });
      }
    }

    // Update experiences - delete all and re-insert
    if (body.experiences !== undefined) {
      await supabase.from("experiences").delete().eq("portfolio_id", portfolio.id);

      if (body.experiences.length > 0) {
        const experiencesData = body.experiences.map((exp: any, index: number) => ({
          portfolio_id: portfolio.id,
          company: exp.company,
          position: exp.position,
          location: exp.location || "",
          start_date: exp.startDate || null,
          end_date: exp.endDate || null,
          is_current: exp.isCurrent || false,
          description: exp.description || "",
          display_order: index,
        }));

        await supabase.from("experiences").insert(experiencesData);
      }
    }

    // Update education
    if (body.education !== undefined) {
      await supabase.from("education").delete().eq("portfolio_id", portfolio.id);

      if (body.education.length > 0) {
        const educationData = body.education.map((edu: any, index: number) => ({
          portfolio_id: portfolio.id,
          institution: edu.institution,
          degree: edu.degree,
          field_of_study: edu.fieldOfStudy || "",
          start_date: edu.startDate || null,
          end_date: edu.endDate || null,
          description: edu.description || "",
          display_order: index,
        }));

        await supabase.from("education").insert(educationData);
      }
    }

    // Update projects
    if (body.projects !== undefined) {
      await supabase.from("projects").delete().eq("portfolio_id", portfolio.id);

      if (body.projects.length > 0) {
        const projectsData = body.projects.map((proj: any, index: number) => ({
          portfolio_id: portfolio.id,
          name: proj.name,
          description: proj.description || "",
          url: proj.url || "",
          github_url: proj.githubUrl || "",
          image_url: proj.imageUrl || "",
          technologies: proj.technologies || [],
          display_order: index,
        }));

        await supabase.from("projects").insert(projectsData);
      }
    }

    // Update skills
    if (body.skills !== undefined) {
      await supabase.from("skills").delete().eq("portfolio_id", portfolio.id);

      if (body.skills.length > 0) {
        const skillsData = body.skills.map((skill: any, index: number) => ({
          portfolio_id: portfolio.id,
          name: skill.name,
          category: skill.category || "",
          proficiency_level: skill.proficiencyLevel || 3,
          display_order: index,
        }));

        await supabase.from("skills").insert(skillsData);
      }
    }

    // Update social links
    if (body.socialLinks !== undefined) {
      await supabase.from("social_links").delete().eq("portfolio_id", portfolio.id);

      if (body.socialLinks.length > 0) {
        const socialLinksData = body.socialLinks.map((link: any, index: number) => ({
          portfolio_id: portfolio.id,
          platform: link.platform,
          url: link.url,
          display_order: index,
        }));

        await supabase.from("social_links").insert(socialLinksData);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
