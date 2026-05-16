import { describe, it, expect } from 'vitest';
import {
  extractVariables,
  interpolateVariables,
  isValidVariableName,
  renameVariableInContent,
  removeVariableFromContent,
} from '../variables';

describe('variables utility', () => {
  describe('isValidVariableName', () => {
    it('should validate correct names', () => {
      expect(isValidVariableName('var_name')).toBe(true);
      expect(isValidVariableName('VAR123')).toBe(true);
      expect(isValidVariableName('a')).toBe(true);
      expect(isValidVariableName('var name')).toBe(true);
      expect(isValidVariableName('var-name')).toBe(true);
      expect(isValidVariableName('var$name')).toBe(true);
      expect(isValidVariableName('a'.repeat(64))).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(isValidVariableName('')).toBe(false);
      expect(isValidVariableName('a'.repeat(65))).toBe(false);
      expect(isValidVariableName('var{name')).toBe(false);
      expect(isValidVariableName('var}name')).toBe(false);
    });

    it('should allow names starting with numbers', () => {
      expect(isValidVariableName('123var')).toBe(true);
    });
  });

  describe('extractVariables', () => {
    it('should extract unique variables', () => {
      const text =
        'Hello {{User Name}}, welcome to {{place}}. {{User Name}} again.';
      expect(extractVariables(text)).toEqual(['User Name', 'place']);
    });

    it('should return empty array when no variables found', () => {
      expect(extractVariables('No variables here')).toEqual([]);
    });

    it('should handle special characters', () => {
      expect(extractVariables('{{var-name}} {{var$name}}')).toEqual([
        'var-name',
        'var$name',
      ]);
    });

    it('should handle variables at boundaries', () => {
      expect(extractVariables('{{start}} middle {{end}}')).toEqual([
        'start',
        'end',
      ]);
    });

    it('should ignore malformed patterns but extract valid ones within', () => {
      // In "{{var {{nested}}}}":
      // "{{nested}}" matches 'nested'
      expect(extractVariables('{{var {{nested}}}}')).toEqual(['nested']);
    });

    it('should extract variables from triple braces', () => {
      expect(extractVariables('{{{triple}}}')).toEqual(['triple']);
    });
  });

  describe('interpolateVariables', () => {
    const template = 'Hello {{name}}, you are {{age}} years old.';
    const values = { name: 'Alice', age: '30' };

    it('should interpolate variables correctly', () => {
      expect(interpolateVariables(template, values)).toBe(
        'Hello Alice, you are 30 years old.',
      );
    });

    it('should keep missing variables by default', () => {
      expect(interpolateVariables(template, { name: 'Alice' })).toBe(
        'Hello Alice, you are {{age}} years old.',
      );
    });

    it('should replace missing variables with empty string if requested', () => {
      expect(
        interpolateVariables(
          template,
          { name: 'Alice' },
          { fallback: 'empty' },
        ),
      ).toBe('Hello Alice, you are  years old.');
    });

    it('should handle special characters in replacement values (regex safety)', () => {
      const specialValues = {
        name: '$1',
        age: '&&',
      };
      // template: 'Hello {{name}}, you are {{age}} years old.'
      // Since we use the callback version of .replace(), it should be safe from $ substitution patterns
      expect(interpolateVariables(template, specialValues)).toBe(
        'Hello $1, you are && years old.',
      );
    });

    it('should treat empty strings as missing and use fallback', () => {
      expect(interpolateVariables('{{empty}}', { empty: '' })).toBe(
        '{{empty}}',
      );
      expect(
        interpolateVariables('{{empty}}', { empty: '' }, { fallback: 'empty' }),
      ).toBe('');
    });

    it('should handle whitespace', () => {
      expect(interpolateVariables('{{space}}', { space: ' ' })).toBe(' ');
    });

    it('should handle multiple occurrences of the same variable', () => {
      expect(interpolateVariables('{{v}} {{v}}', { v: 'x' })).toBe('x x');
    });
  });

  describe('renameVariableInContent', () => {
    it('should rename all occurrences of a variable', () => {
      const content =
        'Hello {{oldName}}, this is {{oldName}} speaking. {{other}} is here too.';
      expect(renameVariableInContent(content, 'oldName', 'newName')).toBe(
        'Hello {{newName}}, this is {{newName}} speaking. {{other}} is here too.',
      );
    });

    it('should not rename variables that are substrings', () => {
      const content = '{{var}} {{var2}} {{myvar}}';
      expect(renameVariableInContent(content, 'var', 'newVar')).toBe(
        '{{newVar}} {{var2}} {{myvar}}',
      );
    });

    it('should handle renaming to an existing name safely', () => {
      const content = '{{name1}} {{name2}}';
      expect(renameVariableInContent(content, 'name1', 'name2')).toBe(
        '{{name2}} {{name2}}',
      );
    });

    it('should leave content unchanged if variable not found', () => {
      const content = '{{name}}';
      expect(renameVariableInContent(content, 'missing', 'new')).toBe(
        '{{name}}',
      );
    });
  });

  describe('removeVariableFromContent', () => {
    it('should remove all occurrences of a variable', () => {
      const content =
        'Hello {{name}}, this is {{name}} speaking. {{other}} is here too.';
      expect(removeVariableFromContent(content, 'name')).toBe(
        'Hello , this is  speaking. {{other}} is here too.',
      );
    });

    it('should not remove variables that are substrings', () => {
      const content = '{{var}} {{var2}} {{myvar}}';
      expect(removeVariableFromContent(content, 'var')).toBe(
        ' {{var2}} {{myvar}}',
      );
    });

    it('should leave content unchanged if variable not found', () => {
      const content = '{{name}}';
      expect(removeVariableFromContent(content, 'missing')).toBe('{{name}}');
    });
  });
});
