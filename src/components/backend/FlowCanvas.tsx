import React, { useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  NodeTypes,
  ReactFlowProvider,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { FlowNode, FlowEdge } from "@/store/backendStore";
import { useBackendStore } from "@/store/backendStore";
import { Sparkles, X, Play, GitBranch, Repeat, Clock, Send, Database, Plus, Edit, Trash2, Globe, Webhook, Mail, Bell, FileText, Calculator, Hash, Calendar, Shuffle } from "lucide-react";
import { motion } from "framer-motion";

interface FlowCanvasProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  onNodeSelect: (node: FlowNode | null) => void;
  onNodeUpdate: (id: string, updates: Partial<FlowNode>) => void;
  onNodeDelete: (id: string) => void;
  onEdgeAdd: (edge: FlowEdge) => void;
}

const getNodeColor = (type: string): string => {
  if (type.startsWith("ai_")) return "from-purple-500 to-purple-600";
  if (type.includes("fetch") || type.includes("insert") || type.includes("update") || type.includes("delete") || type.includes("auth") || type.includes("file"))
    return "from-green-500 to-green-600";
  if (type.includes("http") || type.includes("webhook") || type.includes("email") || type.includes("notification"))
    return "from-orange-500 to-orange-600";
  if (type === "start" || type === "return_response") return "from-red-500 to-red-600";
  return "from-blue-500 to-blue-600";
};

const getNodeIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    start: Play,
    if_else: GitBranch,
    loop: Repeat,
    delay: Clock,
    return_response: Send,
    fetch_data: Database,
    insert_record: Plus,
    update_record: Edit,
    delete_record: Trash2,
    auth_check: Database,
    file_upload: Database,
    http_request: Globe,
    webhook: Webhook,
    email_sender: Mail,
    notification: Bell,
    ai_generate: Sparkles,
    ai_image: Sparkles,
    ai_condition: Sparkles,
    ai_fix: Sparkles,
    log: FileText,
    math: Calculator,
    variable: Hash,
    date_time: Calendar,
    random: Shuffle,
  };
  return iconMap[type] || Sparkles;
};

// Custom Node Component with Connection Handles
const CustomNode = ({ data, selected, id }: any) => {
  const { deleteNode, setSelectedNode } = useBackendStore.getState();
  const colorClass = getNodeColor(data.type || id);
  const NodeIcon = getNodeIcon(data.type || id);

  return (
    <div className={`relative rounded-xl border-2 bg-gradient-to-br ${colorClass} p-4 min-w-[200px] shadow-lg ${
      selected ? "ring-2 ring-primary ring-offset-2" : "border-transparent"
    } hover:border-primary/50 transition-all group`}>
      {/* Source Handle (Top) - for outgoing connections */}
      <Handle
        type="source"
        position={Position.Top}
        className="!w-3 !h-3 !bg-primary !border-2 !border-white"
        style={{ top: -6 }}
      />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <NodeIcon className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold text-white">{data.label || data.type || id}</span>
        </div>
        <button
          onClick={() => deleteNode(id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-white/70 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {data.description && <p className="text-xs text-white/70">{data.description}</p>}
      
      {/* Target Handle (Bottom) - for incoming connections */}
      <Handle
        type="target"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-accent !border-2 !border-white"
        style={{ bottom: -6 }}
      />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const FlowCanvasInner = ({
  nodes: propNodes,
  edges: propEdges,
  onNodeSelect,
  onNodeUpdate,
  onNodeDelete,
  onEdgeAdd,
}: FlowCanvasProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { selectedNode } = useBackendStore();
  const reactFlowInstanceRef = useRef<any>(null);

  // Convert FlowNode/FlowEdge to ReactFlow format
  const convertToReactFlowNodes = useCallback((nodes: FlowNode[]): Node[] => {
    return nodes.map((node) => ({
      id: node.id,
      type: "custom",
      position: node.position,
      data: {
        ...node.data,
        type: node.type,
        label: node.data.label || node.type,
      },
      selected: selectedNode?.id === node.id,
    }));
  }, [selectedNode]);

  const convertToReactFlowEdges = useCallback((edges: FlowEdge[]): Edge[] => {
    return edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      animated: true,
      style: { stroke: "rgba(59, 130, 246, 0.6)", strokeWidth: 2 },
    }));
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(convertToReactFlowNodes(propNodes));
  const [edges, setEdges, onEdgesChange] = useEdgesState(convertToReactFlowEdges(propEdges));

  // Sync with store when propNodes/propEdges change
  useEffect(() => {
    setNodes(convertToReactFlowNodes(propNodes));
  }, [propNodes, convertToReactFlowNodes, setNodes]);

  useEffect(() => {
    setEdges(convertToReactFlowEdges(propEdges));
  }, [propEdges, convertToReactFlowEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = addEdge(params, edges);
      setEdges(newEdge);
      
      // Convert to FlowEdge and add to store
      const flowEdge: FlowEdge = {
        id: params.id || `edge-${params.source}-${params.target}`,
        source: params.source || "",
        target: params.target || "",
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
      };
      onEdgeAdd(flowEdge);
    },
    [edges, setEdges, onEdgeAdd]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const flowNode = propNodes.find((n) => n.id === node.id);
      if (flowNode) {
        onNodeSelect(flowNode);
      }
    },
    [propNodes, onNodeSelect]
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      deleted.forEach((node) => {
        onNodeDelete(node.id);
      });
    },
    [onNodeDelete]
  );

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeUpdate(node.id, { position: node.position });
    },
    [onNodeUpdate]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) {
        console.warn("No drag data found");
        return;
      }

      let position = { x: 0, y: 0 };

      // Calculate position - try React Flow's method first, then fallback
      if (reactFlowInstanceRef.current) {
        try {
          // Use React Flow's coordinate transformation (expects screen coordinates)
          position = reactFlowInstanceRef.current.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          });
        } catch (error) {
          console.warn("Error using screenToFlowPosition, using fallback:", error);
          // Fallback: calculate position relative to canvas
          if (reactFlowWrapper.current) {
            const rect = reactFlowWrapper.current.getBoundingClientRect();
            position = {
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
            };
          }
        }
      } else if (reactFlowWrapper.current) {
        // Fallback: calculate position relative to canvas
        const rect = reactFlowWrapper.current.getBoundingClientRect();
        position = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      }

      const newNode: FlowNode = {
        id: `${type}-${Date.now()}`,
        type,
        position: {
          x: position.x,
          y: position.y,
        },
        data: {
          label: type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          type,
        },
      };

      const { addNode } = useBackendStore.getState();
      addNode(newNode);
      console.log("Node added via drag and drop:", newNode);
    },
    []
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div 
      className="flex-1 bg-[#0B0B10] relative" 
      ref={reactFlowWrapper}
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={{ width: '100%', height: '100%' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodesDelete={onNodesDelete}
        onNodeDragStop={onNodeDragStop}
        onInit={(instance) => {
          reactFlowInstanceRef.current = instance;
          console.log("ReactFlow instance initialized");
        }}
        nodeTypes={nodeTypes}
        fitView
        className="bg-[#0B0B10]"
        deleteKeyCode={["Backspace", "Delete"]}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 2 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
        }}
      >
        <Background variant="dots" gap={20} size={1} color="rgba(59, 130, 246, 0.1)" />
        <Controls className="bg-card border-border" />
        <MiniMap
          className="bg-card border-border"
          nodeColor={(node) => {
            const type = (node.data as any)?.type || "";
            if (type.startsWith("ai_")) return "#a855f7";
            if (type.includes("fetch") || type.includes("insert") || type.includes("update") || type.includes("delete"))
              return "#22c55e";
            if (type.includes("http") || type.includes("webhook")) return "#f97316";
            if (type === "start" || type === "return_response") return "#ef4444";
            return "#3b82f6";
          }}
        />
      </ReactFlow>

      {propNodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground animate-sparkle" />
            <h3 className="text-lg font-semibold mb-2">Start Building Your Backend</h3>
            <p className="text-sm text-muted-foreground">
              Drag blocks from the sidebar or click to add them
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const FlowCanvas = (props: FlowCanvasProps) => {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner {...props} />
    </ReactFlowProvider>
  );
};
