import { describe, it, expect } from 'vitest'
import { clone } from '../helpers'

describe('Helpers', () => {
  describe('clone', () => {
    it('should create a deep copy of an object', () => {
      const original = {
        name: 'Test',
        nested: {
          value: 42,
          array: [1, 2, 3]
        }
      }
      
      const cloned = clone(original)
      
      // Verify it's a deep copy
      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.nested).not.toBe(original.nested)
      expect(cloned.nested.array).not.toBe(original.nested.array)
      
      // Modify original and verify cloned is unchanged
      original.name = 'Modified'
      original.nested.value = 100
      original.nested.array.push(4)
      
      expect(cloned.name).toBe('Test')
      expect(cloned.nested.value).toBe(42)
      expect(cloned.nested.array).toEqual([1, 2, 3])
    })
    
    it('should handle null and undefined', () => {
      expect(() => clone(null)).toThrow()
      expect(() => clone(undefined)).toThrow()
    })
    
    it('should handle primitive values', () => {
      // These will throw errors since they're not objects
      expect(() => clone(42)).toThrow()
      expect(() => clone('string')).toThrow()
      expect(() => clone(true)).toThrow()
    })
  })
})
