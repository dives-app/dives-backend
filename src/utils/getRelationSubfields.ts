import { SelectionSetNode } from "graphql";
import { FieldNode } from "graphql/language/ast";

export function getRelationSubfields(
  selectionSet?: SelectionSetNode,
  parentNamespace: string = ""
): Array<string> {
  if (selectionSet) {
    return selectionSet.selections
      .filter(
        (node) =>
          "selectionSet" in node &&
          "name" in node &&
          node.selectionSet !== undefined
      )
      .flatMap((node: FieldNode) => {
        const currentFieldName = parentNamespace + node.name.value;
        return [
          currentFieldName,
          ...getRelationSubfields(node.selectionSet, `${currentFieldName}.`),
        ];
      });
  }
  return [];
}
