import { Node, RuleGroup } from "./types";

export function parsePosition(position: string) {
  const [x, y] = position.split(";");
  return {
    x: Number(x),
    y: Number(y),
  };
}

export function checkFlagFulfilled(
  data: Node,
  flagState: Record<string, boolean>
) {
  const result = data.CheckFlags.every((checkFlag) => {
    return checkFlag.Flags.every((flag) => {
      if (flagState[flag.UUID] === flag.value) {
        return true;
      }
      return false;
    });
  });

  return result;
}

export function getNodesRecursive(
  record: Record<string, Node>,
  rootId: string
): Node[] {
  const visited = new Set<string>();

  function rec(id: string): Node[] {
    if (visited.has(id)) {
      return [];
    }
    visited.add(id);

    const node = record[id];
    if (!node.Children || node.Children.length === 0) {
      return [node];
    }

    // TODO: flag 필터 적용
    // const isFlagFulfilled = checkFlagFulfilled(node, flagState);

    // if (!isFlagFulfilled) {
    //   return [];
    // }

    return [
      node,
      ...node.Children.flatMap((child) => rec(child)),
      ...(node.JumpTarget ? rec(node.JumpTarget) : []),
    ];
  }

  return rec(rootId);
}

export function getAllFlags(datalist: Node[]) {
  return [
    ...new Map(
      datalist
        .map((data) => data.CheckFlags)
        .filter((flags) => flags.length > 0)
        .flatMap((flags) => flags.flatMap((flag) => flag.Flags))
        .map((flag) => [flag.UUID, flag] as const)
    ).values(),
  ].sort((a, b) => a.Name.localeCompare(b.Name));
}

function parenthize(str: string) {
  return `(${str})`;
}

function parenthizeIfNeeded(str: string) {
  if (str.startsWith("(") && str.endsWith(")")) {
    return str;
  }
  if (str.startsWith("!")) {
    return str;
  }
  return parenthize(str);
}

function combine(arr: string[], op: 0 | 1 | 2) {
  if (op === 0) {
    return arr.join(" & ");
  }
  if (op === 1) {
    return arr.join(" | ");
  }
  if (op === 2) {
    return `!${parenthize(arr.join(" & "))}`;
  }
  throw new Error(`Invalid op: ${op}`);
}

export function stringifyRuleGroup(ruleGroup: RuleGroup) {
  const { Rules, TagCombineOp } = ruleGroup;
  return combine(
    Rules.map((rule) => combine(rule.TagNames, rule.TagCombineOp)).map(
      parenthizeIfNeeded
    ),
    TagCombineOp
  );
}
