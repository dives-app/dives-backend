import { updateObject } from "./updateObject";

describe("updateObject", () => {
  test("Should update an object only with defined values", () => {
    const objectToUpdate = { a: "a", b: "b", c: "d", d: null };
    updateObject(objectToUpdate, { c: "c", d: undefined });
    expect(objectToUpdate).toEqual({ a: "a", b: "b", c: "c", d: null });
  });
});
