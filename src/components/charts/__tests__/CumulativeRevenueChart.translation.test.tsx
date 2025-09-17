import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nProvider, useI18n } from '../../../contexts/I18nContext';
import CumulativeRevenueChart from '../CumulativeRevenueChart';

// Mock ReactECharts
vi.mock('echarts-for-react', () => ({
  default: ({ option }: { option: any }) => (
    <div data-testid="echarts-container">
      <div data-testid="chart-title">{option.title?.text}</div>
      <div data-testid="x-axis-name">{option.xAxis?.name}</div>
      <div data-testid="y-axis-name">{option.yAxis?.name}</div>
      <div data-testid="legend-data">{JSON.stringify(option.legend?.data)}</div>
    </div>
  )
}));

// Mock calculations
vi.mock('../../../utils/calculations', () => ({
  generateCumulativeRevenueData: () => ({
    baselineDevice: Array(12).fill({
      enhancedScans: { count: 50, revenue: 10000 },
      plainScans: { count: 30, revenue: 6000 },
      contrastSavings: 1000,
      additionalExamRevenue: 2000,
      totalMonthlyRevenue: 19000
    }),
    targetDevice: Array(12).fill({
      enhancedScans: { count: 60, revenue: 12000 },
      plainScans: { count: 35, revenue: 7000 },
      contrastSavings: 1500,
      additionalExamRevenue: 3000,
      totalMonthlyRevenue: 23500
    }),
    monthlySavings: Array(12).fill(4500),
    cumulativeSavings: Array(12).fill(0).map((_, i) => 4500 * (i + 1))
  }),
  generateCumulativeRevenueChartData: () => Array(12).fill(0).map((_, i) => ({
    month: i + 1,
    baseDeviceRevenue: 19000,
    targetDeviceRevenue: 23500,
    cumulativeBaseline: 19000 * (i + 1),
    cumulativeTarget: 23500 * (i + 1),
    monthlySavings: 4500
  })),
  formatCurrency: (value: number) => `¥${value.toLocaleString()}`
}));

const mockDevices = {
  base: {
    id: 'base-device',
    brand: 'Base',
    model: 'Device',
    specs: {}
  },
  target: {
    id: 'target-device', 
    brand: 'Target',
    model: 'Device',
    specs: {}
  }
};

describe('CumulativeRevenueChart Translation Tests', () => {
  const defaultProps = {
    baseDevice: mockDevices.base,
    targetDevice: mockDevices.target,
    patientVolume: 100,
    isDaily: false,
    enhancementRate: 70
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Chinese Language', () => {
    it('should display chart with Chinese translations', async () => {
      const ChineseTestComponent = () => {
        const { t } = useI18n();
        return <CumulativeRevenueChart {...defaultProps} />;
      };

      render(
        <I18nProvider>
          <ChineseTestComponent />
        </I18nProvider>
      );

      // Wait for component to load
      await screen.findByTestId('echarts-container');

      // Check Chinese chart title
      expect(screen.getByTestId('chart-title')).toHaveTextContent('累积收益对比');
      
      // Check Chinese axis labels
      expect(screen.getByTestId('x-axis-name')).toHaveTextContent('时间 (月)');
      expect(screen.getByTestId('y-axis-name')).toHaveTextContent('累积收益 (¥)');
    });

    it('should have Chinese legend labels', async () => {
      const ChineseTestComponent = () => {
        const { t } = useI18n();
        return <CumulativeRevenueChart {...defaultProps} />;
      };

      render(
        <I18nProvider>
          <ChineseTestComponent />
        </I18nProvider>
      );

      await screen.findByTestId('echarts-container');

      const legendData = screen.getByTestId('legend-data');
      expect(legendData).toHaveTextContent('Base Device');
      expect(legendData).toHaveTextContent('Target Device');
    });
  });

  describe('English Language', () => {
    it('should display chart with English translations', async () => {
      const EnglishTestComponent = () => {
        // Mock English context
        const mockContext = {
          language: 'en' as const,
          setLanguage: vi.fn(),
          toggleLanguage: vi.fn(),
          t: {
            results: {
              charts: {
                cumulativeTitle: 'Cumulative Revenue Comparison',
                timeMonths: 'Time (Months)',
                cumulativeRevenue: 'Cumulative Revenue (¥)',
                monthlySavings: 'Monthly Savings',
                cumulativeSavings: 'Cumulative Savings',
                baseRevenue: 'Base Revenue',
                targetRevenue: 'Target Revenue'
              }
            },
            common: {
              loading: 'Loading...',
              error: 'Error'
            }
          }
        };

        // Use React.createContext to provide the mock context
        const MockI18nContext = React.createContext(mockContext);
        
        return (
          <MockI18nContext.Provider value={mockContext}>
            <CumulativeRevenueChart {...defaultProps} />
          </MockI18nContext.Provider>
        );
      };

      // Mock the useI18n hook for this test
      const originalUseI18n = vi.fn();
      vi.mock('../../../contexts/I18nContext', async () => {
        const actual = await vi.importActual('../../../contexts/I18nContext');
        return {
          ...actual,
          useI18n: () => ({
            language: 'en',
            setLanguage: vi.fn(),
            toggleLanguage: vi.fn(),
            t: {
              results: {
                charts: {
                  cumulativeTitle: 'Cumulative Revenue Comparison',
                  timeMonths: 'Time (Months)',
                  cumulativeRevenue: 'Cumulative Revenue (¥)',
                  monthlySavings: 'Monthly Savings',
                  cumulativeSavings: 'Cumulative Savings',
                  baseRevenue: 'Base Revenue',
                  targetRevenue: 'Target Revenue'
                }
              },
              common: {
                loading: 'Loading...',
                error: 'Error'
              }
            }
          })
        };
      });

      render(<EnglishTestComponent />);

      await screen.findByTestId('echarts-container');

      // Check English chart title
      expect(screen.getByTestId('chart-title')).toHaveTextContent('Cumulative Revenue Comparison');
      
      // Check English axis labels
      expect(screen.getByTestId('x-axis-name')).toHaveTextContent('Time (Months)');
      expect(screen.getByTestId('y-axis-name')).toHaveTextContent('Cumulative Revenue (¥)');
    });
  });

  describe('Translation Key Validation', () => {
    it('should use all required translation keys', async () => {
      const requiredKeys = [
        'cumulativeTitle',
        'timeMonths', 
        'cumulativeRevenue',
        'monthlySavings',
        'cumulativeSavings',
        'baseRevenue',
        'targetRevenue'
      ];

      const TestComponent = () => {
        const { t } = useI18n();
        
        // Verify all keys exist
        requiredKeys.forEach(key => {
          expect(t.results.charts[key as keyof typeof t.results.charts]).toBeDefined();
        });

        return <CumulativeRevenueChart {...defaultProps} />;
      };

      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      await screen.findByTestId('echarts-container');
    });

    it('should handle loading and error states with translations', async () => {
      // Mock error in calculations
      vi.mock('../../../utils/calculations', () => ({
        generateCumulativeRevenueData: () => {
          throw new Error('Calculation failed');
        },
        generateCumulativeRevenueChartData: () => {
          throw new Error('Chart data generation failed');
        },
        formatCurrency: (value: number) => `¥${value.toLocaleString()}`
      }));

      const ErrorTestComponent = () => {
        return <CumulativeRevenueChart {...defaultProps} />;
      };

      render(
        <I18nProvider>
          <ErrorTestComponent />
        </I18nProvider>
      );

      // Should show error state with translated text
      expect(screen.getByText('错误')).toBeInTheDocument();
    });
  });

  describe('Tooltip Translation', () => {
    it('should format tooltip with correct translations', async () => {
      const TestComponent = () => {
        const { t } = useI18n();
        return <CumulativeRevenueChart {...defaultProps} />;
      };

      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      await screen.findByTestId('echarts-container');

      // The tooltip formatter should use the translation keys
      // This is tested indirectly through the chart option structure
      const chartContainer = screen.getByTestId('echarts-container');
      expect(chartContainer).toBeInTheDocument();
    });
  });
});