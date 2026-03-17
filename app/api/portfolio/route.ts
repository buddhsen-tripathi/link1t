import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { DEFAULT_SECTION_ORDER } from "@/types/portfolio";

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
      return NextResponse.json({
        data: null,
        username: user.username,
        usernameChangedAt: user.username_changed_at,
      });
    }

    // Transform to app format
    const content = portfolio.content || {
      experiences: [],
      education: [],
      projects: [],
      skills: [],
      socialLinks: [],
      certifications: [],
      languages: [],
    };

    // Ensure sectionOrder includes new section keys for existing portfolios
    let sectionOrder = portfolio.section_order || DEFAULT_SECTION_ORDER;
    const missingSections = DEFAULT_SECTION_ORDER.filter((s) => !sectionOrder.includes(s));
    if (missingSections.length > 0) {
      sectionOrder = [...sectionOrder, ...missingSections];
    }

    const data = {
      portfolio: {
        id: portfolio.id,
        userId: portfolio.user_id,
        fullName: portfolio.full_name || "",
        title: portfolio.title || "",
        headline: content.headline || "",
        email: portfolio.email || "",
        phone: portfolio.phone || "",
        location: portfolio.location || "",
        profileImageUrl: portfolio.profile_image_url || "",
        resumeUrl: content.resumeUrl || "",
        bio: portfolio.bio || "",
        themeId: portfolio.theme_id || "brutalist",
        sectionOrder,
        hiddenSections: content.hiddenSections || [],
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
      certifications: content.certifications || [],
      languages: content.languages || [],
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

    // Get or create user
    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    if (!user) {
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

    // Build content JSONB — includes all sub-items + new portfolio-level fields stored in content
    const content = {
      experiences: body.experiences || [],
      education: body.education || [],
      projects: body.projects || [],
      skills: body.skills || [],
      socialLinks: body.socialLinks || [],
      certifications: body.certifications || [],
      languages: body.languages || [],
      headline: body.portfolio?.headline || "",
      resumeUrl: body.portfolio?.resumeUrl || "",
      hiddenSections: body.portfolio?.hiddenSections || [],
    };

    // Portfolio data
    const portfolioData = {
      full_name: body.portfolio?.fullName || "",
      title: body.portfolio?.title || "",
      email: body.portfolio?.email || "",
      phone: body.portfolio?.phone || "",
      location: body.portfolio?.location || "",
      profile_image_url: body.portfolio?.profileImageUrl || "",
      bio: body.portfolio?.bio || "",
      content,
      section_order: body.portfolio?.sectionOrder || DEFAULT_SECTION_ORDER,
      theme_id: body.portfolio?.themeId || "brutalist",
      is_published: body.portfolio?.isPublished !== false, // Default to published
      published_at: body.portfolio?.isPublished !== false ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    // Check if portfolio exists
    const { data: existingPortfolio } = await supabase
      .from("portfolios")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!existingPortfolio) {
      // Create new portfolio
      const { error: createError } = await supabase
        .from("portfolios")
        .insert({
          user_id: user.id,
          ...portfolioData,
        });

      if (createError) {
        console.error("Error creating portfolio:", createError);
        return NextResponse.json(
          { error: "Failed to create portfolio" },
          { status: 500 }
        );
      }
    } else {
      // Update existing portfolio
      const { error: updateError } = await supabase
        .from("portfolios")
        .update(portfolioData)
        .eq("id", existingPortfolio.id);

      if (updateError) {
        console.error("Error updating portfolio:", updateError);
        return NextResponse.json(
          { error: "Failed to update portfolio" },
          { status: 500 }
        );
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
