import { describe, it, expect } from 'vitest';
import { zhTranslations } from '../zh';
import { enTranslations } from '../en';
import { Translations } from '../../types/i18n';

describe('Translation Validation', () => {
  describe('Translation Completeness', () => {
    it('should have all required translation keys in both languages', () => {
      // Get all keys from both translation objects
      const zhKeys = getAllKeys(zhTranslations);
      const enKeys = getAllKeys(enTranslations);
      
      // Both should have the same keys
      expect(zhKeys.sort()).toEqual(enKeys.sort());
    });

    it('should have additionalRevenue key in both languages', () => {
      expect(zhTranslations.results.additionalRevenue).toBeDefined();
      expect(enTranslations.results.additionalRevenue).toBeDefined();
      expect(typeof zhTranslations.results.additionalRevenue).toBe('string');
      expect(typeof enTranslations.results.additionalRevenue).toBe('string');
    });

    it('should have revenueDescription key in both languages', () => {
      expect(zhTranslations.results.revenueDescription).toBeDefined();
      expect(enTranslations.results.revenueDescription).toBeDefined();
      expect(typeof zhTranslations.results.revenueDescription).toBe('string');
      expect(typeof enTranslations.results.revenueDescription).toBe('string');
    });

    it('should have all cumulative chart translation keys', () => {
      const cumulativeKeys = [
        'cumulativeTitle',
        'cumulativeSubtitle', 
        'timeMonths',
        'cumulativeRevenue',
        'cumulativeNote1',
        'cumulativeNote2',
        'cumulativeNote3',
        'cumulativeSavings',
        'baseRevenue',
        'targetRevenue'
      ];

      cumulativeKeys.forEach(key => {
        expect(zhTranslations.results.charts[key as keyof typeof zhTranslations.results.charts]).toBeDefined();
        expect(enTranslations.results.charts[key as keyof typeof enTranslations.results.charts]).toBeDefined();
        expect(typeof zhTranslations.results.charts[key as keyof typeof zhTranslations.results.charts]).toBe('string');
        expect(typeof enTranslations.results.charts[key as keyof typeof enTranslations.results.charts]).toBe('string');
      });
    });
  });

  describe('Translation Accuracy', () => {
    it('should have correct Chinese revenueDescription translation', () => {
      expect(zhTranslations.results.revenueDescription).toBe('省下的对比剂成本+多做检查量带来的收益');
    });

    it('should have correct English revenueDescription translation', () => {
      expect(enTranslations.results.revenueDescription).toBe('iodine cost saving + additional exam benefit');
    });

    it('should have meaningful cumulative chart titles', () => {
      expect(zhTranslations.results.charts.cumulativeTitle).toBe('累积收益对比');
      expect(enTranslations.results.charts.cumulativeTitle).toBe('Cumulative Revenue Comparison');
    });

    it('should have proper axis labels for cumulative chart', () => {
      expect(zhTranslations.results.charts.timeMonths).toBe('时间 (月)');
      expect(enTranslations.results.charts.timeMonths).toBe('Time (Months)');
      expect(zhTranslations.results.charts.cumulativeRevenue).toBe('累积收益 (¥)');
      expect(enTranslations.results.charts.cumulativeRevenue).toBe('Cumulative Revenue (¥)');
    });
  });

  describe('Translation Structure Validation', () => {
    it('should have consistent nested structure in both languages', () => {
      const zhStructure = getObjectStructure(zhTranslations);
      const enStructure = getObjectStructure(enTranslations);
      
      expect(zhStructure).toEqual(enStructure);
    });

    it('should not have empty string values', () => {
      const zhEmptyValues = findEmptyValues(zhTranslations);
      const enEmptyValues = findEmptyValues(enTranslations);
      
      expect(zhEmptyValues).toEqual([]);
      expect(enEmptyValues).toEqual([]);
    });

    it('should have all required sections', () => {
      const requiredSections = ['nav', 'header', 'input', 'results', 'footer', 'common'];
      
      requiredSections.forEach(section => {
        expect(zhTranslations[section as keyof Translations]).toBeDefined();
        expect(enTranslations[section as keyof Translations]).toBeDefined();
      });
    });
  });

  describe('Translation Interpolation', () => {
    it('should have consistent interpolation placeholders', () => {
      // Check that interpolation placeholders match between languages
      const zhInterpolations = findInterpolationPlaceholders(zhTranslations);
      const enInterpolations = findInterpolationPlaceholders(enTranslations);
      
      // Both should have the same interpolation keys
      expect(Object.keys(zhInterpolations).sort()).toEqual(Object.keys(enInterpolations).sort());
      
      // Each key should have the same placeholders
      Object.keys(zhInterpolations).forEach(key => {
        expect(zhInterpolations[key].sort()).toEqual(enInterpolations[key].sort());
      });
    });

    it('should have proper placeholders in analysis conclusion content', () => {
      const zhPlaceholders = extractPlaceholders(zhTranslations.results.analysisConclusionContent.timeSavingsPerPatient);
      const enPlaceholders = extractPlaceholders(enTranslations.results.analysisConclusionContent.timeSavingsPerPatient);
      
      expect(zhPlaceholders).toEqual(enPlaceholders);
      expect(zhPlaceholders).toContain('{baseExamTime}');
      expect(zhPlaceholders).toContain('{targetExamTime}');
    });
  });
});

// Helper functions
function getAllKeys(obj: any, prefix = ''): string[] {
  let keys: string[] = [];
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys = keys.concat(getAllKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }
  
  return keys;
}

function getObjectStructure(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj;
  }
  
  const structure: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      structure[key] = getObjectStructure(obj[key]);
    }
  }
  
  return structure;
}

function findEmptyValues(obj: any, path = ''): string[] {
  let emptyValues: string[] = [];
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        emptyValues = emptyValues.concat(findEmptyValues(obj[key], currentPath));
      } else if (typeof obj[key] === 'string' && obj[key].trim() === '') {
        emptyValues.push(currentPath);
      }
    }
  }
  
  return emptyValues;
}

function findInterpolationPlaceholders(obj: any, path = ''): Record<string, string[]> {
  let placeholders: Record<string, string[]> = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const nestedPlaceholders = findInterpolationPlaceholders(obj[key], currentPath);
        placeholders = { ...placeholders, ...nestedPlaceholders };
      } else if (typeof obj[key] === 'string') {
        const extracted = extractPlaceholders(obj[key]);
        if (extracted.length > 0) {
          placeholders[currentPath] = extracted;
        }
      }
    }
  }
  
  return placeholders;
}

function extractPlaceholders(text: string): string[] {
  const matches = text.match(/\{[^}]+\}/g);
  return matches || [];
}