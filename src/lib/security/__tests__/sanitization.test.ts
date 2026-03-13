import {
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeEmail,
  sanitizePhone,
  sanitizeFileName,
  sanitizeQueryParams,
  sanitizeObject,
  escapeSqlIdentifier,
} from '../sanitization';

// Mock ApiError
jest.mock('@/lib/api/errors', () => ({
  ApiError: class ApiError extends Error {
    constructor(public status: number, message: string) {
      super(message);
    }
  },
}));

describe('Sanitization', () => {
  describe('sanitizeHtml', () => {
    it('should allow safe HTML tags', () => {
      const input = '<p>Hello <strong>world</strong></p>';
      expect(sanitizeHtml(input)).toBe(input);
    });

    it('should strip script tags', () => {
      const input = '<p>Hello</p><script>alert("xss")</script>';
      expect(sanitizeHtml(input)).toBe('<p>Hello</p>');
    });

    it('should strip event handlers', () => {
      const input = '<p onmouseover="alert(1)">Hello</p>';
      expect(sanitizeHtml(input)).toBe('<p>Hello</p>');
    });

    it('should allow anchor tags with href', () => {
      const input = '<a href="https://example.com">Link</a>';
      expect(sanitizeHtml(input)).toContain('href="https://example.com"');
    });

    it('should strip disallowed tags', () => {
      const input = '<div><iframe src="evil.com"></iframe><p>Safe</p></div>';
      const result = sanitizeHtml(input);
      expect(result).not.toContain('iframe');
      expect(result).toContain('<p>Safe</p>');
    });
  });

  describe('sanitizeText', () => {
    it('should strip all HTML tags', () => {
      expect(sanitizeText('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
    });

    it('should handle plain text', () => {
      expect(sanitizeText('Hello world')).toBe('Hello world');
    });

    it('should strip script content', () => {
      expect(sanitizeText('<script>alert(1)</script>Clean')).toBe('Clean');
    });
  });

  describe('sanitizeUrl', () => {
    it('should accept valid URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
    });

    it('should throw for invalid URLs', () => {
      expect(() => sanitizeUrl('not-a-url')).toThrow('Invalid URL');
    });

    it('should throw for javascript: protocol', () => {
      expect(() => sanitizeUrl('javascript:alert(1)')).toThrow('Invalid URL');
    });
  });

  describe('sanitizeEmail', () => {
    it('should accept valid email and lowercase it', () => {
      expect(sanitizeEmail('User@Example.COM')).toBe('user@example.com');
    });

    it('should throw for invalid email', () => {
      expect(() => sanitizeEmail('not-an-email')).toThrow('Invalid email');
    });
  });

  describe('sanitizePhone', () => {
    it('should strip non-digit characters except +', () => {
      expect(sanitizePhone('+1 (555) 123-4567')).toBe('+15551234567');
    });

    it('should handle clean phone numbers', () => {
      expect(sanitizePhone('5551234567')).toBe('5551234567');
    });
  });

  describe('sanitizeFileName', () => {
    it('should replace unsafe characters with underscores', () => {
      expect(sanitizeFileName('my file (1).pdf')).toBe('my_file__1_.pdf');
    });

    it('should keep safe characters', () => {
      expect(sanitizeFileName('report-2024.pdf')).toBe('report-2024.pdf');
    });
  });

  describe('sanitizeQueryParams', () => {
    it('should sanitize query parameter values', () => {
      const params = new URLSearchParams();
      params.append('name', '<script>alert(1)</script>John');
      params.append('page', '1');

      const result = sanitizeQueryParams(params);

      expect(result.get('name')).toBe('John');
      expect(result.get('page')).toBe('1');
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize string values', () => {
      const result = sanitizeObject({ name: '<b>Test</b>', count: 5 }) as any;

      expect(result.name).toBe('Test');
      expect(result.count).toBe(5);
    });

    it('should handle nested objects', () => {
      const result = sanitizeObject({
        user: { name: '<script>x</script>John' },
      }) as any;

      expect(result.user.name).toBe('John');
    });

    it('should handle arrays', () => {
      const result = sanitizeObject(['<b>hello</b>', 'world']) as any;

      expect(result[0]).toBe('hello');
      expect(result[1]).toBe('world');
    });

    it('should sanitize html keys with sanitizeHtml', () => {
      const result = sanitizeObject({
        descriptionHtml: '<p>Hello</p><script>alert(1)</script>',
      }) as any;

      expect(result.descriptionHtml).toBe('<p>Hello</p>');
    });

    it('should sanitize phone keys', () => {
      const result = sanitizeObject({ phone: '+1 (555) 123-4567' }) as any;

      expect(result.phone).toBe('+15551234567');
    });

    it('should handle null values', () => {
      expect(sanitizeObject(null)).toBeNull();
    });

    it('should handle non-string primitives', () => {
      expect(sanitizeObject(42)).toBe(42);
      expect(sanitizeObject(true)).toBe(true);
    });
  });

  describe('escapeSqlIdentifier', () => {
    it('should wrap identifier in double quotes', () => {
      expect(escapeSqlIdentifier('table_name')).toBe('"table_name"');
    });

    it('should escape double quotes within identifier', () => {
      expect(escapeSqlIdentifier('table"name')).toBe('"table""name"');
    });
  });
});
