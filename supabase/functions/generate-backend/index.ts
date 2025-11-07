import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    const { flow_json } = await req.json();

    if (!flow_json || !flow_json.nodes) {
      return new Response(JSON.stringify({ error: "Invalid flow JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `You are an expert backend developer for GenieSite.
Convert the provided backend logic flow JSON into clean, production-ready Node.js + Express + Supabase code.

Requirements:
- Use Node.js with Express framework
- Integrate Supabase client for database operations
- Add proper error handling and validation
- Include TypeScript types
- Add helpful comments
- Make code readable and well-formatted
- Use async/await patterns
- Return proper HTTP responses

The flow JSON contains nodes (logic blocks) and edges (connections between blocks).
Generate a complete Express route handler that executes this logic flow.`;

    const userPrompt = `Generate Node.js + Supabase backend code for this logic flow:

${JSON.stringify(flow_json, null, 2)}

Create a complete Express route handler that:
1. Processes the flow from start node
2. Executes each connected node in sequence
3. Handles database operations (fetch, insert, update, delete)
4. Makes HTTP requests if needed
5. Calls AI (Gemini) for AI nodes
6. Returns the final response

Output only the complete Node.js code, nothing else.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedCode = data.choices?.[0]?.message?.content || "// Code generation failed";

    return new Response(JSON.stringify({ code: generatedCode }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-backend:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

