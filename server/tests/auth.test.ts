import { describe, it, expect, beforeEach, vi } from 'vitest';
import bcrypt from 'bcryptjs';

// ── Unit tests for auth logic (no DB required) ────────────────────────────

describe('bcrypt password hashing', () => {
  it('hashes a password', async () => {
    const hash = await bcrypt.hash('mypassword', 10);
    expect(hash).not.toBe('mypassword');
    expect(hash.startsWith('$2')).toBe(true);
  });

  it('verifies correct password', async () => {
    const hash = await bcrypt.hash('correct', 10);
    const match = await bcrypt.compare('correct', hash);
    expect(match).toBe(true);
  });

  it('rejects wrong password', async () => {
    const hash = await bcrypt.hash('correct', 10);
    const match = await bcrypt.compare('wrong', hash);
    expect(match).toBe(false);
  });
});

describe('input sanitization', () => {
  function sanitize(val: unknown): unknown {
    if (typeof val === 'string') return val.replace(/<[^>]*>/g, '').trim();
    if (Array.isArray(val)) return val.map(sanitize);
    if (val && typeof val === 'object') {
      return Object.fromEntries(Object.entries(val as object).map(([k, v]) => [k, sanitize(v)]));
    }
    return val;
  }

  it('strips HTML tags from strings', () => {
    // The sanitizer strips tags but keeps text content between them
    expect(sanitize('<b>bold</b>')).toBe('bold');
    expect(sanitize('<script>alert(1)</script>hello')).toBe('alert(1)hello');
    expect(sanitize('<img src="x" onerror="alert(1)">')).toBe('');
    expect(sanitize('<a href="javascript:void(0)">click</a>')).toBe('click');
  });

  it('leaves plain strings untouched', () => {
    expect(sanitize('hello world')).toBe('hello world');
  });

  it('sanitizes nested objects', () => {
    const result = sanitize({ name: '<b>John</b>', age: 25 }) as any;
    expect(result.name).toBe('John');
    expect(result.age).toBe(25);
  });

  it('sanitizes arrays', () => {
    const result = sanitize(['<b>a</b>', 'b']) as string[];
    expect(result[0]).toBe('a');
    expect(result[1]).toBe('b');
  });
});

describe('password validation rules', () => {
  it('rejects passwords shorter than 6 chars', () => {
    const isValid = (p: string) => p.length >= 6;
    expect(isValid('abc')).toBe(false);
    expect(isValid('abcdef')).toBe(true);
  });
});
