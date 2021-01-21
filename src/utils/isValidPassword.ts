/**
 * Validates password to contain at least one digit, small letter, capital letter, special character and be at least 8 characters long
 * @param password password to validate
 */
export const isValidPassword = (password: string) => {
  // Contain at least one digit (\d)
  // Contain at least one small letter ([a-z])
  // Contain at least one capital letter ([A-Z])
  // Contain at least one special character (\W)
  // Has at least length of 8 characters
  const passwordRegExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/;
  return passwordRegExp.test(password);
};
