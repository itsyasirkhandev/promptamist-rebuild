import { describe, it, expect } from 'vitest';
import {
  extractVariables,
  interpolateVariables,
  isValidVariableName,
  renameVariableInContent,
  removeVariableFromContent,
  reconcileVariables,
  type Variable,
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

  describe('reconcileVariables', () => {
    // Helper to build a Variable fixture quickly.
    const makeVar = (
      overrides: Partial<Variable> & { name: string },
    ): Variable => ({
      id: 'existing-id-' + overrides.name,
      type: 'text',
      ...overrides,
    });

    it('adds a new variable when it appears in content but not in existingConfigs', () => {
      const result = reconcileVariables('Hello {{name}}', []);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('name');
      expect(result[0].type).toBe('text');
    });

    it('removes a variable config when it is no longer in content', () => {
      const existing = [makeVar({ name: 'removed' })];
      const result = reconcileVariables('No variables here', existing);
      expect(result).toHaveLength(0);
    });

    it('preserves an existing variable config when still present', () => {
      const existing = [
        makeVar({ name: 'city', type: 'choices', options: ['NY', 'LA'] }),
      ];
      const result = reconcileVariables('I live in {{city}}', existing);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(existing[0]);
    });

    it('preserves the relative order of existing variables that are still present', () => {
      const existing = [
        makeVar({ name: 'alpha' }),
        makeVar({ name: 'beta' }),
        makeVar({ name: 'gamma' }),
      ];
      // Remove 'beta' from content — alpha and gamma should keep their relative order.
      const result = reconcileVariables('{{alpha}} and {{gamma}}', existing);
      expect(result.map((v) => v.name)).toEqual(['alpha', 'gamma']);
    });

    it('appends new variables after existing ones in content order', () => {
      const existing = [makeVar({ name: 'old' })];
      // 'new1' appears before 'new2' in content, both should be appended after 'old'.
      const result = reconcileVariables('{{old}} {{new1}} {{new2}}', existing);
      expect(result.map((v) => v.name)).toEqual(['old', 'new1', 'new2']);
    });

    it('returns an empty array for empty content', () => {
      const existing = [makeVar({ name: 'gone' })];
      const result = reconcileVariables('', existing);
      expect(result).toHaveLength(0);
    });

    it('creates new configs for all variables when existingConfigs is empty', () => {
      const result = reconcileVariables('{{a}} {{b}} {{c}}', []);
      expect(result.map((v) => v.name)).toEqual(['a', 'b', 'c']);
      result.forEach((v) => expect(v.type).toBe('text'));
    });

    it('returns configs unchanged when content and existingConfigs already match', () => {
      const existing = [makeVar({ name: 'x' }), makeVar({ name: 'y' })];
      const result = reconcileVariables('{{x}} {{y}}', existing);
      expect(result).toEqual(existing);
    });

    it('handles multiple adds and removes in a single call', () => {
      const existing = [makeVar({ name: 'keep' }), makeVar({ name: 'remove' })];
      const result = reconcileVariables('{{keep}} {{added}}', existing);
      expect(result.map((v) => v.name)).toEqual(['keep', 'added']);
      // The kept one should be the original object reference.
      expect(result[0]).toBe(existing[0]);
    });

    it('deduplicates a variable that appears multiple times in content', () => {
      const result = reconcileVariables('{{dup}} and {{dup}} again', []);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('dup');
    });

    it('handles variable names with spaces', () => {
      const result = reconcileVariables('{{first name}} and {{last name}}', []);
      expect(result.map((v) => v.name)).toEqual(['first name', 'last name']);
    });

    it('assigns a non-empty unique id and type text to a newly created variable', () => {
      const result = reconcileVariables('{{brand new}}', []);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBeTruthy();
      expect(typeof result[0].id).toBe('string');
      expect(result[0].id.length).toBeGreaterThan(0);
      expect(result[0].type).toBe('text');
    });

    it('assigns distinct ids to different new variables', () => {
      const result = reconcileVariables('{{a}} {{b}}', []);
      expect(result[0].id).not.toBe(result[1].id);
    });
  });
});
