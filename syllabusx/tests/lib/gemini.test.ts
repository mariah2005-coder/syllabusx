import { describe, it, expect } from 'vitest'
import { extractJsonString } from '../../lib/gemini'

describe('extractJsonString', () => {
  it('extracts JSON from fenced markdown', () => {
    const input = `Some text\n```json\n{\n  "topics": [{"title":"T","flashcards":[]}]\n}\n```\nmore text`;
    const out = extractJsonString(input);
    expect(out).toContain('"topics"');
    expect(() => JSON.parse(out)).not.toThrow();
  })

  it('throws when no JSON found', () => {
    const input = 'no json here';
    expect(() => extractJsonString(input)).toThrow();
  })
})
