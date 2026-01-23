import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

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
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }
      user = newUser;
    }

    // Get portfolio
    const { data: portfolio } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!portfolio) {
      // Return empty portfolio structure
      return NextResponse.json({
        data: null,
        username: user.username,
        usernameChangedAt: user.username_changed_at,
      });
    }

    // Get related data
    const [experiences, education, projects, skills, socialLinks] =
      await Promise.all([
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

    // Transform to app format
    const data = {
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
        isPublished: portfolio.is_published || false,
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
        displayOrder: exp.display_order || 0,
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
        displayOrder: edu.display_order || 0,
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
        displayOrder: proj.display_order || 0,
      })),
      skills: (skills.data || []).map((skill) => ({
        id: skill.id,
        portfolioId: skill.portfolio_id,
        name: skill.name,
        category: skill.category || "",
        proficiencyLevel: skill.proficiency_level || 3,
        displayOrder: skill.display_order || 0,
      })),
      socialLinks: (socialLinks.data || []).map((link) => ({
        id: link.id,
        portfolioId: link.portfolio_id,
        platform: link.platform,
        url: link.url,
        displayOrder: link.display_order || 0,
      })),
    };

    return NextResponse.json({
      data,
      username: user.username,
      usernameChangedAt: user.username_changed_at,
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Get user
    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update username if provided
    if (body.username !== undefined && body.username !== user.username) {
      // Check 30-day restriction (only if user already has a username)
      if (user.username && user.username_changed_at) {
        const lastChanged = new Date(user.username_changed_at);
        const now = new Date();
        const daysSinceChange = Math.floor(
          (now.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceChange < 30) {
          const daysRemaining = 30 - daysSinceChange;
          return NextResponse.json(
            {
              error: `Username can only be changed once every 30 days. You can change it again in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}.`,
            },
            { status: 400 }
          );
        }
      }

      // Check if username is taken
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("username", body.username)
        .single();

      if (existingUser && existingUser.id !== user.id) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 400 }
        );
      }

      await supabase
        .from("users")
        .update({
          username: body.username,
          username_changed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }

    // Get or create portfolio
    let { data: portfolio } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const portfolioData = {
      full_name: body.portfolio?.fullName || "",
      title: body.portfolio?.title || "",
      email: body.portfolio?.email || "",
      phone: body.portfolio?.phone || "",
      location: body.portfolio?.location || "",
      profile_image_url: body.portfolio?.profileImageUrl || "",
      bio: body.portfolio?.bio || "",
      theme_id: body.portfolio?.themeId || "brutalist",
      is_published: body.portfolio?.isPublished || false,
      published_at: body.portfolio?.isPublished ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    if (!portfolio) {
      // Create new portfolio
      const { data: newPortfolio, error: createError } = await supabase
        .from("portfolios")
        .insert({
          user_id: user.id,
          ...portfolioData,
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating portfolio:", createError);
        return NextResponse.json(
          { error: "Failed to create portfolio" },
          { status: 500 }
        );
      }
      portfolio = newPortfolio;
    } else {
      // Update existing portfolio
      const { error: updateError } = await supabase
        .from("portfolios")
        .update(portfolioData)
        .eq("id", portfolio.id);

      if (updateError) {
        console.error("Error updating portfolio:", updateError);
        return NextResponse.json(
          { error: "Failed to update portfolio" },
          { status: 500 }
        );
      }
    }

    // Update experiences - delete all and re-insert
    if (body.experiences !== undefined) {
      await supabase.from("experiences").delete().eq("portfolio_id", portfolio.id);

      if (body.experiences.length > 0) {
        const experiencesData = body.experiences.map(
          (exp: any, index: number) => ({
            portfolio_id: portfolio.id,
            company: exp.company,
            position: exp.position,
            location: exp.location || "",
            start_date: exp.startDate || null,
            end_date: exp.endDate || null,
            is_current: exp.isCurrent || false,
            description: exp.description || "",
            display_order: index,
          })
        );

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
      await supabase
        .from("social_links")
        .delete()
        .eq("portfolio_id", portfolio.id);

      if (body.socialLinks.length > 0) {
        const socialLinksData = body.socialLinks.map(
          (link: any, index: number) => ({
            portfolio_id: portfolio.id,
            platform: link.platform,
            url: link.url,
            display_order: index,
          })
        );

        await supabase.from("social_links").insert(socialLinksData);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
