import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface KitPost {
  title: string;
  published_date: string;
  preview_content: string;
  external_url: string;
}

async function scrapeKitPosts(): Promise<KitPost[]> {
  try {
    const response = await fetch("https://ehab-badran-2.kit.com/profile/posts");
    const html = await response.text();

    const jsonMatch = html.match(/window\.props\s*=\s*({.+?});/s);
    if (!jsonMatch) {
      console.error("Could not find props data");
      return [];
    }

    const propsData = JSON.parse(jsonMatch[1]);
    const recentPosts = propsData.recentPosts || [];

    const posts: KitPost[] = recentPosts.map((post: any) => ({
      title: post.title,
      published_date: post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      preview_content: post.introContent ? post.introContent.substring(0, 200) : '',
      external_url: post.url,
    }));

    return posts;
  } catch (error) {
    console.error("Error scraping Kit posts:", error);
    return [];
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const posts = await scrapeKitPosts();

    let newCount = 0;
    let updatedCount = 0;

    for (const post of posts) {
      const { data: existing, error: checkError } = await supabase
        .from("newsletters")
        .select("id")
        .eq("external_url", post.external_url)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking newsletter:", checkError);
        continue;
      }

      if (existing) {
        const { error: updateError } = await supabase
          .from("newsletters")
          .update({
            title: post.title,
            published_date: post.published_date,
            preview_content: post.preview_content,
          })
          .eq("id", existing.id);

        if (!updateError) updatedCount++;
      } else {
        const { error: insertError } = await supabase
          .from("newsletters")
          .insert([post]);

        if (!insertError) newCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Checked ${posts.length} posts. Added ${newCount} new, updated ${updatedCount}.`,
        posts_checked: posts.length,
        new_posts: newCount,
        updated_posts: updatedCount,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error checking newsletters:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});