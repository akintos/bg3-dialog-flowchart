import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  useReactFlow,
} from "reactflow";
import type * as Gustav from "@gustav/types";
import { useNodeData } from "./useNodeData";
import { useWorkspace } from "./useWorkspace";
import { nodeTypes } from "./custom-node";

function Flowchart() {
  const { rootId } = useWorkspace();
  const { processedNodes, processedEdges } = useNodeData();
  const { fitView, getZoom, setNodes, setEdges } = useReactFlow();

  useEffect(() => {
    if (!rootId) return;
    setTimeout(() => fitView({ nodes: [{ id: rootId }], maxZoom: getZoom() }), 0);
  }, [rootId, fitView]);

  useEffect(() => {
    setNodes(processedNodes);
    setEdges(processedEdges);
  }, [processedNodes, processedEdges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<Gustav.Node>) => {
      if (node.data.Constructor === "Jump") {
        const targetId = node.data.JumpTarget!;
        fitView({ nodes: [{ id: targetId }], maxZoom: getZoom() });
      }
    },
    [fitView]
  );

  return (
    <ReactFlow
      defaultNodes={processedNodes}
      defaultEdges={processedEdges}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      attributionPosition="bottom-left"
      minZoom={0.05}
    >
      <Background />
      <Controls />
      <MiniMap nodeColor="#6ede87" nodeStrokeWidth={3} zoomable pannable />
    </ReactFlow>
  );
}

export default Flowchart;
