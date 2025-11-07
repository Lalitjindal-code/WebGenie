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

    // Simulate flow execution by traversing nodes
    const startNode = flow_json.nodes.find((n: any) => n.type === "start");
    if (!startNode) {
      return new Response(JSON.stringify({ error: "No start node found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build execution trace
    const executionTrace: string[] = [];
    executionTrace.push(`Starting flow from node: ${startNode.id}`);
    
    // Traverse edges to simulate execution
    const visited = new Set<string>();
    const queue = [startNode.id];
    
    while (queue.length > 0) {
      const currentNodeId = queue.shift()!;
      if (visited.has(currentNodeId)) continue;
      visited.add(currentNodeId);
      
      const currentNode = flow_json.nodes.find((n: any) => n.id === currentNodeId);
      if (currentNode) {
        executionTrace.push(`Executing: ${currentNode.type} (${currentNode.id})`);
        
        // Find connected nodes
        const connectedEdges = flow_json.edges.filter((e: any) => e.source === currentNodeId);
        connectedEdges.forEach((edge: any) => {
          if (!visited.has(edge.target)) {
            queue.push(edge.target);
          }
        });
      }
    }

    const output = {
      success: true,
      message: "Flow test completed successfully",
      nodesExecuted: visited.size,
      totalNodes: flow_json.nodes.length,
      executionTrace,
      result: "All nodes executed in test mode",
    };

    return new Response(JSON.stringify({ output }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in test-backend:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

