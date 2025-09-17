import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nProvider, useI18n } from '../I18nContext';

// Test component that uses the I18n context
const TestComponent: React.FC = () => {
  const { language, toggleLanguage, t } = useI18n();
  
  return (
    <div>
      <div data-testid="current-language">{language}</div>
      <button data-testid="toggle-button" onClick={toggleLanguage}>
        Toggle Language
      </button>
      <div data-testid="additional-revenue-title">
        {t.results.additionalRevenue}
      </div>
      <div data-testid="revenue-description">
        {t.results.revenueDescription}
      </div>
      <div data-testid="cumulative-title">
        {t.results.charts.cumulativeTitle}
      </div>
      <div data-testid="time-months">
        {t.results.charts.timeMonths}
      </div>
      <div data-testid="cumulative-revenue">
        {t.results.charts.cumulativeRevenue}
      </div>
    </div>
  );
};

describe('I18nContext Language Switching', () => {
  describe('Default Language', () => {
    it('should default to Chinese language', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('current-language')).toHaveTextContent('zh');
      expect(screen.getByTestId('additional-revenue-title')).toHaveTextContent('潜在额外收益');
      expect(screen.getByTestId('revenue-description')).toHaveTextContent('省下的对比剂成本+多做检查量带来的收益');
    });
  });

  describe('Language Toggle Functionality', () => {
    it('should switch from Chinese to English when toggle is clicked', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      // Initially Chinese
      expect(screen.getByTestId('current-language')).toHaveTextContent('zh');
      expect(screen.getByTestId('additional-revenue-title')).toHaveTextContent('潜在额外收益');

      // Click toggle button
      fireEvent.click(screen.getByTestId('toggle-button'));

      // Should now be English
      expect(screen.getByTestId('current-language')).toHaveTextContent('en');
      expect(screen.getByTestId('additional-revenue-title')).toHaveTextContent('Potential Additional Revenue');
      expect(screen.getByTestId('revenue-description')).toHaveTextContent('iodine cost saving + additional exam benefit');
    });

    it('should switch back to Chinese when toggle is clicked again', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      // Click toggle twice
      fireEvent.click(screen.getByTestId('toggle-button'));
      fireEvent.click(screen.getByTestId('toggle-button'));

      // Should be back to Chinese
      expect(screen.getByTestId('current-language')).toHaveTextContent('zh');
      expect(screen.getByTestId('additional-revenue-title')).toHaveTextContent('潜在额外收益');
      expect(screen.getByTestId('revenue-description')).toHaveTextContent('省下的对比剂成本+多做检查量带来的收益');
    });
  });

  describe('Cumulative Chart Translation Switching', () => {
    it('should update cumulative chart translations when language is switched', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      // Initially Chinese
      expect(screen.getByTestId('cumulative-title')).toHaveTextContent('累积收益对比');
      expect(screen.getByTestId('time-months')).toHaveTextContent('时间 (月)');
      expect(screen.getByTestId('cumulative-revenue')).toHaveTextContent('累积收益 (¥)');

      // Switch to English
      fireEvent.click(screen.getByTestId('toggle-button'));

      // Should now be English
      expect(screen.getByTestId('cumulative-title')).toHaveTextContent('Cumulative Revenue Comparison');
      expect(screen.getByTestId('time-months')).toHaveTextContent('Time (Months)');
      expect(screen.getByTestId('cumulative-revenue')).toHaveTextContent('Cumulative Revenue (¥)');
    });
  });

  describe('All UI Elements Update', () => {
    it('should update all new translation keys when language is switched', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      // Test all the new keys that were added for the Additional Revenue Card and Cumulative Chart
      const testCases = [
        {
          testId: 'additional-revenue-title',
          chinese: '潜在额外收益',
          english: 'Potential Additional Revenue'
        },
        {
          testId: 'revenue-description',
          chinese: '省下的对比剂成本+多做检查量带来的收益',
          english: 'iodine cost saving + additional exam benefit'
        },
        {
          testId: 'cumulative-title',
          chinese: '累积收益对比',
          english: 'Cumulative Revenue Comparison'
        },
        {
          testId: 'time-months',
          chinese: '时间 (月)',
          english: 'Time (Months)'
        },
        {
          testId: 'cumulative-revenue',
          chinese: '累积收益 (¥)',
          english: 'Cumulative Revenue (¥)'
        }
      ];

      // Initially all should be Chinese
      testCases.forEach(({ testId, chinese }) => {
        expect(screen.getByTestId(testId)).toHaveTextContent(chinese);
      });

      // Switch to English
      fireEvent.click(screen.getByTestId('toggle-button'));

      // All should now be English
      testCases.forEach(({ testId, english }) => {
        expect(screen.getByTestId(testId)).toHaveTextContent(english);
      });
    });
  });

  describe('Translation Interpolation', () => {
    it('should provide access to translation functions', () => {
      const InterpolationTestComponent: React.FC = () => {
        const { t } = useI18n();
        
        // Test that we can access nested translation objects
        return (
          <div>
            <div data-testid="analysis-conclusion">
              {t.results.analysisConclusionContent.contrast}
            </div>
            <div data-testid="time-efficiency">
              {t.results.analysisConclusionContent.timeEfficiency}
            </div>
          </div>
        );
      };

      render(
        <I18nProvider>
          <InterpolationTestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('analysis-conclusion')).toHaveTextContent('对比');
      expect(screen.getByTestId('time-efficiency')).toHaveTextContent('时间效益 (∆P):');
    });
  });


});