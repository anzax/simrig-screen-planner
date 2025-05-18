/**
 * Deep clone an object
 * @param {Object} obj - The object to clone
 * @returns {Object} A deep clone of the object
 */
export function clone(obj) {
  if (obj === null || typeof obj !== 'object') {
    throw new Error('Clone requires a non-null object')
  }
  return JSON.parse(JSON.stringify(obj))
}
