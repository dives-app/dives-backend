/**
 * Validates a password to contain at least one digit, small letter, capital letter, special character and be at least 8 characters long
 * @param password password to validate
 * @returns true if password is valid, false otherwise
 */
export function isValidPassword(password: string) {
  // Contains at least one digit (\d)
  // Contains at least one small letter ([a-z])
  // Contains at least one capital letter ([A-Z])
  // Contains at least one special character (\W)
  // Has at least length of 8 characters
  const passwordRegExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/;
  return passwordRegExp.test(password);
}
