/**
 * Mutably updates the object using updateData
 * @param object object to mutably update
 * @param updateData part of object
 * @returns mutated object
 */
export function updateObject<T>(object: T, updateData: Partial<T>): T {
  Object.entries(updateData).forEach(([key, value]) => {
    if (value === undefined) return;
    object[key] = value;
  });
  return object;
}
