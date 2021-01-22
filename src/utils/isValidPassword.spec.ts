import { isValidPassword } from "./isValidPassword";

describe("isValidPassword", () => {
  test("Should return true for 1s@d4avi", () => {
    expect(isValidPassword("1s@d4Avi")).toEqual(true);
  });
  test("Should return true for 123qwe!@#", () => {
    expect(isValidPassword("123qWe!@#")).toEqual(true);
  });
  test("Should return false for no digit password", () => {
    expect(isValidPassword("As@dHavi")).toEqual(false);
  });
  test("Should return false for no uppercase letter password", () => {
    expect(isValidPassword("1s@d4avi")).toEqual(false);
  });
  test("Should return false for no lowercase letter password", () => {
    expect(isValidPassword("1S@D4AVI")).toEqual(false);
  });
  test("Should return false for no special sign password", () => {
    expect(isValidPassword("1sad4avi")).toEqual(false);
  });
  test("Should return false for too short password", () => {
    expect(isValidPassword("123qWe!")).toEqual(false);
  });
});
