import { sanitizeInput, sanitizeFormData } from '../sanitize';

describe('sanitizeInput', () => {
  it('sanitizes basic HTML characters', () => {
    const input = '<script>alert("xss")</script>';
    const result = sanitizeInput(input);

    expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
  });

  it('sanitizes ampersand characters', () => {
    const input = 'Company & Associates';
    const result = sanitizeInput(input);

    expect(result).toBe('Company &amp; Associates');
  });

  it('sanitizes less than and greater than characters', () => {
    const input = '5 < 10 > 3';
    const result = sanitizeInput(input);

    expect(result).toBe('5 &lt; 10 &gt; 3');
  });

  it('sanitizes double quotes', () => {
    const input = 'He said "Hello World"';
    const result = sanitizeInput(input);

    expect(result).toBe('He said &quot;Hello World&quot;');
  });

  it('sanitizes single quotes', () => {
    const input = "It's a beautiful day";
    const result = sanitizeInput(input);

    expect(result).toBe('It&#x27;s a beautiful day');
  });

  it('sanitizes forward slashes', () => {
    const input = 'https://example.com/path';
    const result = sanitizeInput(input);

    expect(result).toBe('https:&#x2F;&#x2F;example.com&#x2F;path');
  });

  it('sanitizes complex XSS attempts', () => {
    const input = '<img src="x" onerror="alert(\'XSS\')">';
    const result = sanitizeInput(input);

    expect(result).toBe('&lt;img src=&quot;x&quot; onerror=&quot;alert(&#x27;XSS&#x27;)&quot;&gt;');
  });

  it('sanitizes JavaScript injection attempts', () => {
    const input = 'javascript:alert("XSS")';
    const result = sanitizeInput(input);

    expect(result).toBe('javascript:alert(&quot;XSS&quot;)');
  });

  it('sanitizes SQL injection attempts', () => {
    const input = "'; DROP TABLE users; --";
    const result = sanitizeInput(input);

    expect(result).toBe('&#x27;; DROP TABLE users; --');
  });

  it('handles empty strings', () => {
    const input = '';
    const result = sanitizeInput(input);

    expect(result).toBe('');
  });

  it('handles strings with no dangerous characters', () => {
    const input = 'This is a safe string with numbers 123 and letters ABC';
    const result = sanitizeInput(input);

    expect(result).toBe('This is a safe string with numbers 123 and letters ABC');
  });

  it('handles strings with only whitespace', () => {
    const input = '   \n\t  ';
    const result = sanitizeInput(input);

    expect(result).toBe('   \n\t  ');
  });

  it('handles unicode characters', () => {
    const input = 'Hello 世界 🌍';
    const result = sanitizeInput(input);

    expect(result).toBe('Hello 世界 🌍');
  });

  it('sanitizes multiple dangerous characters in sequence', () => {
    const input = '<>&"\'//';
    const result = sanitizeInput(input);

    expect(result).toBe('&lt;&gt;&amp;&quot;&#x27;&#x2F;&#x2F;');
  });

  it('handles very long strings', () => {
    const input = '<script>'.repeat(1000);
    const result = sanitizeInput(input);

    expect(result).toBe('&lt;script&gt;'.repeat(1000));
  });

  it('preserves line breaks and tabs', () => {
    const input = 'Line 1\nLine 2\tTabbed';
    const result = sanitizeInput(input);

    expect(result).toBe('Line 1\nLine 2\tTabbed');
  });

  it('sanitizes nested HTML tags', () => {
    const input = '<div><span>Content</span></div>';
    const result = sanitizeInput(input);

    expect(result).toBe('&lt;div&gt;&lt;span&gt;Content&lt;&#x2F;span&gt;&lt;&#x2F;div&gt;');
  });

  it('sanitizes HTML attributes', () => {
    const input = '<a href="javascript:alert(1)" onclick="alert(2)">Link</a>';
    const result = sanitizeInput(input);

    expect(result).toBe(
      '&lt;a href=&quot;javascript:alert(1)&quot; onclick=&quot;alert(2)&quot;&gt;Link&lt;&#x2F;a&gt;'
    );
  });

  it('handles mixed content safely', () => {
    const input = 'Normal text <script>alert("xss")</script> & more text';
    const result = sanitizeInput(input);

    expect(result).toBe(
      'Normal text &lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt; &amp; more text'
    );
  });
});

describe('sanitizeFormData', () => {
  it('sanitizes string values in form data', () => {
    const formData = {
      name: '<script>alert("xss")</script>',
      email: 'user@example.com',
      message: 'Hello & welcome',
    };

    const result = sanitizeFormData(formData);

    expect(result.name).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    expect(result.email).toBe('user@example.com');
    expect(result.message).toBe('Hello &amp; welcome');
  });

  it('preserves non-string values', () => {
    const formData = {
      name: 'John Doe',
      age: 30,
      isActive: true,
      tags: ['tag1', 'tag2'],
      metadata: { key: 'value' },
      nullValue: null,
      undefinedValue: undefined,
    };

    const result = sanitizeFormData(formData);

    expect(result.name).toBe('John Doe');
    expect(result.age).toBe(30);
    expect(result.isActive).toBe(true);
    expect(result.tags).toEqual(['tag1', 'tag2']);
    expect(result.metadata).toEqual({ key: 'value' });
    expect(result.nullValue).toBeNull();
    expect(result.undefinedValue).toBeUndefined();
  });

  it('handles empty objects', () => {
    const formData = {};
    const result = sanitizeFormData(formData);

    expect(result).toEqual({});
  });

  it('handles objects with only non-string values', () => {
    const formData = {
      number: 42,
      boolean: false,
      array: [1, 2, 3],
      object: { nested: true },
    };

    const result = sanitizeFormData(formData);

    expect(result).toEqual(formData);
  });

  it('sanitizes multiple string fields', () => {
    const formData = {
      firstName: '<b>John</b>',
      lastName: 'Doe & Associates',
      company: '"Best Company"',
      website: 'https://example.com/path',
      notes: "It's a great company",
    };

    const result = sanitizeFormData(formData);

    expect(result.firstName).toBe('&lt;b&gt;John&lt;&#x2F;b&gt;');
    expect(result.lastName).toBe('Doe &amp; Associates');
    expect(result.company).toBe('&quot;Best Company&quot;');
    expect(result.website).toBe('https:&#x2F;&#x2F;example.com&#x2F;path');
    expect(result.notes).toBe('It&#x27;s a great company');
  });

  it('preserves original object structure', () => {
    const formData = {
      level1: {
        level2: 'nested string',
        level2Number: 123,
      },
      topLevel: 'top string',
    };

    const result = sanitizeFormData(formData);

    expect(result.level1).toEqual({
      level2: 'nested string',
      level2Number: 123,
    });
    expect(result.topLevel).toBe('top string');
  });

  it('does not mutate the original object', () => {
    const formData = {
      name: '<script>alert("test")</script>',
      age: 25,
    };

    const originalName = formData.name;
    const result = sanitizeFormData(formData);

    expect(formData.name).toBe(originalName); // Original unchanged
    expect(result.name).toBe('&lt;script&gt;alert(&quot;test&quot;)&lt;&#x2F;script&gt;'); // Result sanitized
  });

  it('handles complex form data with mixed types', () => {
    const formData = {
      personalInfo: {
        name: '<b>John</b>',
        age: 30,
      },
      preferences: ['option1', 'option2'],
      message: 'Hello & goodbye',
      isSubscribed: true,
      metadata: null,
    };

    const result = sanitizeFormData(formData);

    expect(result.personalInfo).toEqual({
      name: '<b>John</b>', // Nested objects are not recursively sanitized
      age: 30,
    });
    expect(result.preferences).toEqual(['option1', 'option2']);
    expect(result.message).toBe('Hello &amp; goodbye');
    expect(result.isSubscribed).toBe(true);
    expect(result.metadata).toBeNull();
  });

  it('maintains type safety with generic types', () => {
    interface UserForm {
      username: string;
      email: string;
      age: number;
    }

    const formData: UserForm = {
      username: '<script>test</script>',
      email: 'user@example.com',
      age: 25,
    };

    const result = sanitizeFormData(formData as unknown as Record<string, unknown>);

    // TypeScript should maintain the UserForm type
    expect(typeof result.username).toBe('string');
    expect(typeof result.email).toBe('string');
    expect(typeof result.age).toBe('number');
    expect(result.username).toBe('&lt;script&gt;test&lt;&#x2F;script&gt;');
  });

  it('handles edge cases with special characters', () => {
    const formData = {
      field1: '',
      field2: '   ',
      field3: '\n\t',
      field4: '&lt;already&gt;',
    };

    const result = sanitizeFormData(formData);

    expect(result.field1).toBe('');
    expect(result.field2).toBe('   ');
    expect(result.field3).toBe('\n\t');
    expect(result.field4).toBe('&amp;lt;already&amp;gt;'); // Double encoding
  });
});
