import { describe, expect, it } from 'vitest'
import { formatSeconds } from './utils'

describe('formatSeconds', () => {
  it('formats the section 7 example hour', () => {
    expect(formatSeconds(3600)).toBe('01:00:00')
  })
})
