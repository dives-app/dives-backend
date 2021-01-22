import { getRelationSubfields } from "./getRelationSubfields";
import { SelectionSetNode } from "graphql";

describe("getRelationSubfields", () => {
  test("Should return relations for a real world example", () => {
    const node: unknown = {
      selections: [
        {
          name: { value: "id" },
        },
        {
          name: { value: "budgetMembership" },
          selectionSet: {
            selections: [
              {
                name: { value: "accessLevel" },
              },
              {
                name: { value: "budget" },
                selectionSet: {
                  selections: [
                    {
                      name: { value: "id" },
                    },
                    {
                      name: { value: "membership" },
                      selectionSet: {
                        selections: [
                          {
                            name: { value: "user" },
                            selectionSet: {
                              selections: [
                                {
                                  name: { value: "id" },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    };
    const relations = getRelationSubfields(node as SelectionSetNode);
    expect(relations.sort()).toEqual(
      [
        "budgetMembership",
        "budgetMembership.budget",
        "budgetMembership.budget.membership",
        "budgetMembership.budget.membership.user",
      ].sort()
    );
  });
});
