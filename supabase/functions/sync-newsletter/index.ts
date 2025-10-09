import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NewsletterPayload {
  title: string;
  published_date: string;
  preview_content: string;
  external_url: string;
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

    const payload: NewsletterPayload = await req.json();

    const { title, published_date, preview_content, external_url } = payload;

    if (!title || !published_date || !preview_content || !external_url) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: title, published_date, preview_content, external_url",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { data: existing, error: checkError } = await supabase
      .from("newsletters")
      .select("id")
      .eq("external_url", external_url)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (existing) {
      const { error: updateError } = await supabase
        .from("newsletters")
        .update({
          title,
          published_date,
          preview_content,
        })
        .eq("id", existing.id);

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({
          success: true,
          message: "Newsletter updated successfully",
          action: "updated",
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { error: insertError } = await supabase
      .from("newsletters")
      .insert([
        {
          title,
          published_date,
          preview_content,
          external_url,
        },
      ]);

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Newsletter added successfully",
        action: "inserted",
      }),
      {
        status: 201,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing newsletter:", error);
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