import { SelectionSetNode } from "graphql";
import { FieldNode } from "graphql/language/ast";

/**
 * Get GraphQL fields containing other fields
 * @param selectionSet SelectionSetNode to start search
 * @param parentNamespace parent field names separated by .
 * @returns an array of fields containing other fields
 *
 * @example
 * Root
 *    Grandparent
 *        Child1
 *        Parent
 *            Child2
 *            Child3
 * returns ["Grandparent","Grandparent.Parent"]
 */
export function getRelationSubfields(
  selectionSet?: SelectionSetNode,
  parentNamespace = ""
): Array<string> {
  if (selectionSet) {
    return selectionSet.selections
      .filter(node => "selectionSet" in node && "name" in node && node.selectionSet !== undefined)
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
