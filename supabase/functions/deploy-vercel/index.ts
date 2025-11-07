import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getSupabaseClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { projectId, code } = await req.json();

    if (!projectId || !code) {
      return new Response(JSON.stringify({ error: "Missing projectId or code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // In a real implementation, you would:
    // 1. Create a zip file from the generated code
    // 2. Upload to Vercel using their API
    // 3. Return the deployment URL

    // For MVP, we'll simulate the deployment
    const vercelToken = Deno.env.get("VERCEL_TOKEN");
    
    if (!vercelToken) {
      // Stub response for development
      const url = `https://${projectId}.vercel.app`;
      return new Response(JSON.stringify({ url, status: "success" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Real Vercel deployment would go here
    // const response = await fetch("https://api.vercel.com/v13/deployments", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${vercelToken}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     name: projectId,
    //     files: [...],
    //   }),
    // });

    const url = `https://${projectId}.vercel.app`;
    return new Response(JSON.stringify({ url, status: "success" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("/deploy-vercel error", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

