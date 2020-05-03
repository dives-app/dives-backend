import { nanoid } from "nanoid";

/**
 * Generates unique id based on nanoid library
 * @param datePrefix Should the id be prefixed with current time of length 10. Defaults to false
 * @param length Length of generated id excluding datePrefix. Defaults to 21
 * @returns Random id 
 */
export const generateId = (datePrefix = false, length = 21) => {
  if (datePrefix) return Math.floor(Date.now() / 1000) + nanoid(length);
  return nanoid(length);
};
