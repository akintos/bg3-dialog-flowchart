import { memo } from "react";
import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";
import { NodeData } from "../data/types";
import { useNodeData } from "./useNodeData";

const AliasNode = memo<NodeProps<NodeData>>(({ data, isConnectable }) => {
  const { dialogData, getSpeakerName } = useNodeData();

  const category = data.Constructor;
  const uuid = data.UUID;
  const sourceNodeData = dialogData.Nodes[data.SourceNode!];

  const label = sourceNodeData.TaggedTextList?.[0]?.TagTexts?.[0]?.Text.Value;
  const speakerName = getSpeakerName(data.SpeakerNo);
  const checkFlags = data.CheckFlags;
  const hasFlags = checkFlags.length > 0;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      [{category}] {hasFlags && "(Flag Check)"}
      <div>{uuid}</div>
      <div>
        {speakerName}: {label}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <NodeToolbar>
        <div>
          {checkFlags.map((checkFlag, i) => (
            <div key={i}>
              {checkFlag.Flags.map((flag) => (
                <div key={flag.UUID}>
                  <div>
                    {flag.Name}={String(flag.value)}
                  </div>
                  <div></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </NodeToolbar>
    </>
  );
});

export default AliasNode;
