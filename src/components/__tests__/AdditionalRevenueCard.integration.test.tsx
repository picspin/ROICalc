import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '../../contexts/I18nContext';
import { zhTranslations, enTranslations } from '../../i18n';

// Simple component to test translation keys
const AdditionalRevenueCardTest: React.FC<{ language: 'zh' | 'en' }> = ({ language }) => {
  const translations = language === 'zh' ? zhTranslations : enTranslations;
  
  return (
    <div>
      <h3 data-testid="additional-revenue-title">
        {translations.results.additionalRevenue}
      </h3>
      <p data-testid="revenue-description">
        {translations.results.revenueDescription}
      </p>
    </div>
  );
};

describe('Additional Revenue Card Translation Integration', () => {
  describe('Translation Key Existence', () => {
    it('should have additionalRevenue key in Chinese translations', () => {
      expect(zhTranslations.results.additionalRevenue).toBeDefined();
      expect(zhTranslations.results.additionalRevenue).toBe('潜在额外收益');
    });

    it('should have additionalRevenue key in English translations', () => {
      expect(enTranslations.results.additionalRevenue).toBeDefined();
      expect(enTranslations.results.additionalRevenue).toBe('Potential Additional Revenue');
    });

    it('should have revenueDescription key in Chinese translations', () => {
      expect(zhTranslations.results.revenueDescription).toBeDefined();
      expect(zhTranslations.results.revenueDescription).toBe('省下的对比剂成本+多做检查量带来的收益');
    });

    it('should have revenueDescription key in English translations', () => {
      expect(enTranslations.results.revenueDescription).toBeDefined();
      expect(enTranslations.results.revenueDescription).toBe('iodine cost saving + additional exam benefit');
    });
  });

  describe('Component Rendering', () => {
    it('should render Additional Revenue Card with Chinese translations', () => {
      render(<AdditionalRevenueCardTest language="zh" />);
      
      expect(screen.getByTestId('additional-revenue-title')).toHaveTextContent('潜在额外收益');
      expect(screen.getByTestId('revenue-description')).toHaveTextContent('省下的对比剂成本+多做检查量带来的收益');
    });

    it('should render Additional Revenue Card with English translations', () => {
      render(<AdditionalRevenueCardTest language="en" />);
      
      expect(screen.getByTestId('additional-revenue-title')).toHaveTextContent('Potential Additional Revenue');
      expect(screen.getByTestId('revenue-description')).toHaveTextContent('iodine cost saving + additional exam benefit');
    });
  });

  describe('Cumulative Chart Translation Keys', () => {
    it('should have all cumulative chart keys in Chinese', () => {
      const requiredKeys = [
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

      requiredKeys.forEach(key => {
        expect(zhTranslations.results.charts[key as keyof typeof zhTranslations.results.charts]).toBeDefined();
        expect(typeof zhTranslations.results.charts[key as keyof typeof zhTranslations.results.charts]).toBe('string');
        expect(zhTranslations.results.charts[key as keyof typeof zhTranslations.results.charts]).not.toBe('');
      });
    });

    it('should have all cumulative chart keys in English', () => {
      const requiredKeys = [
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

      requiredKeys.forEach(key => {
        expect(enTranslations.results.charts[key as keyof typeof enTranslations.results.charts]).toBeDefined();
        expect(typeof enTranslations.results.charts[key as keyof typeof enTranslations.results.charts]).toBe('string');
        expect(enTranslations.results.charts[key as keyof typeof enTranslations.results.charts]).not.toBe('');
      });
    });

    it('should have meaningful cumulative chart translations', () => {
      // Chinese translations
      expect(zhTranslations.results.charts.cumulativeTitle).toBe('累积收益对比');
      expect(zhTranslations.results.charts.timeMonths).toBe('时间 (月)');
      expect(zhTranslations.results.charts.cumulativeRevenue).toBe('累积收益 (¥)');
      
      // English translations
      expect(enTranslations.results.charts.cumulativeTitle).toBe('Cumulative Revenue Comparison');
      expect(enTranslations.results.charts.timeMonths).toBe('Time (Months)');
      expect(enTranslations.results.charts.cumulativeRevenue).toBe('Cumulative Revenue (¥)');
    });
  });

  describe('Translation Consistency', () => {
    it('should have consistent structure between languages', () => {
      // Check that both languages have the same chart keys
      const zhChartKeys = Object.keys(zhTranslations.results.charts).sort();
      const enChartKeys = Object.keys(enTranslations.results.charts).sort();
      
      expect(zhChartKeys).toEqual(enChartKeys);
    });

    it('should not have empty translation values', () => {
      // Check Chinese translations
      expect(zhTranslations.results.additionalRevenue.trim()).not.toBe('');
      expect(zhTranslations.results.revenueDescription.trim()).not.toBe('');
      
      // Check English translations
      expect(enTranslations.results.additionalRevenue.trim()).not.toBe('');
      expect(enTranslations.results.revenueDescription.trim()).not.toBe('');
    });
  });
});