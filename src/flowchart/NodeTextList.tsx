import { Divider, VStack, chakra } from "@chakra-ui/react";
import { Node, TagText } from "../gustav/types";
import { useWeblate } from "../weblate/useWeblate";

interface NodeTextListProps {
  nodeData: Node;
}

const NodeTextList: React.FC<NodeTextListProps> = ({ nodeData }) => {
  const isEndNode = nodeData.EndNode;

  return (
    <VStack divider={<Divider borderWidth={2} />}>
      {nodeData.TaggedTextList.map((TaggedText, i) => (
        <VStack divider={<Divider />} key={i}>
          {TaggedText.TagTexts.map((TagText) => (
            <NodeText key={TagText.LineId} TagText={TagText} />
          ))}
        </VStack>
      ))}
      {isEndNode && <div>{"<대화 종료>"}</div>}
    </VStack>
  );
};

interface NodeTextProps {
  TagText: TagText;
}

const NodeText: React.FC<NodeTextProps> = ({ TagText }) => {
  const { getTranslatedText, getWeblateUrl } = useWeblate();

  const url = getWeblateUrl(TagText);
  const sourceText = TagText.Text.Value;
  const targetText = getTranslatedText(TagText);

  return (
    <chakra.a _hover={{ background: "#232323" }} href={url} target="_blank">
      <span>{sourceText}</span>
      {targetText && (
        <>
          <br /> <span>{targetText}</span>
        </>
      )}
    </chakra.a>
  );
};

export default NodeTextList;