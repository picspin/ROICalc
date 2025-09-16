import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '../../contexts/I18nContext';
import ResultsSection from '../ResultsSection';

// Mock the store with realistic data
const mockStore = {
  calculationResult: {
    deltaP: 15000,
    deltaV: 8000,
    roi: 25.5,
    annualSavings: 180000,
    contrastSavings: 120,
    additionalEnhancedExams: 15,
    additionalPlainExams: 10,
    enhancedRevenue: 12000,
    plainRevenue: 3000
  },
  targetDeviceId: 'bayer-centargo',
  baseDeviceId: 'ulrich-ctmotion',
  patientVolume: 100,
  volumeType: 'monthly' as const,
  ctEnhancementRate: 70
};

// Mock the useAppStore hook
vi.mock('../../store/useAppStore', () => ({
  default: vi.fn(() => mockStore)
}));

// Mock the device data
vi.mock('../../data/devices', () => ({
  getDeviceById: vi.fn((id: string) => {
    if (id === 'bayer-centargo') {
      return {
        id: 'bayer-centargo',
        brand: 'Bayer',
        model: 'Centargo',
        specs: {
          "单次检查总耗时_分钟": 8,
          "耗材更换时间_分钟": 30,
          "智能协议支持": true,
          "科研附加值": 8,
          "注射技术类型": "活塞式",
          "管路类型": "三筒",
          "NMPA等级": "NMPA ClassIII",
          "信息化支持": true
        }
      };
    }
    if (id === 'ulrich-ctmotion') {
      return {
        id: 'ulrich-ctmotion',
        brand: 'Ulrich',
        model: 'CT Motion',
        specs: {
          "单次检查总耗时_分钟": 12,
          "耗材更换时间_分钟": 60,
          "智能协议支持": false,
          "科研附加值": 5,
          "注射技术类型": "蠕吸式",
          "管路类型": "双筒",
          "NMPA等级": "NMPA ClassII",
          "信息化支持": false
        }
      };
    }
    return null;
  })
}));

// Mock the calculations
vi.mock('../../utils/calculations', () => ({
  formatCurrency: (value: number) => `¥${value.toLocaleString()}`,
  formatPercent: (value: number) => `${value.toFixed(1)}%`,
  formatVolume: (value: number) => `${value}ml`,
  calculateTotalAdditionalExams: () => 25,
  calculateActualAdditionalRevenue: () => 15000,
  generateCumulativeRevenueData: () => ({
    baselineDevice: [],
    targetDevice: [],
    monthlySavings: [],
    cumulativeSavings: []
  }),
  generateCumulativeRevenueChartData: () => []
}));

// Mock chart components to avoid complex rendering
vi.mock('../charts/BarChart', () => ({
  default: () => <div data-testid="bar-chart">Bar Chart</div>
}));

vi.mock('../charts/RadarChart', () => ({
  default: () => <div data-testid="radar-chart">Radar Chart</div>
}));

vi.mock('../charts/CumulativeRevenueChart', () => ({
  default: () => <div data-testid="cumulative-chart">Cumulative Chart</div>
}));

vi.mock('../ParameterComparison', () => ({
  default: () => <div data-testid="parameter-comparison">Parameter Comparison</div>
}));

describe('ResultsSection Translation Integration', () => {
  describe('Additional Revenue Card Display', () => {
    it('should display Additional Revenue Card with correct Chinese translations', () => {
      render(
        <I18nProvider>
          <ResultsSection />
        </I18nProvider>
      );

      // Check if the Additional Revenue Card title is displayed in Chinese
      expect(screen.getByText('潜在额外收益')).toBeInTheDocument();
      
      // Check if the revenue description is displayed in Chinese
      expect(screen.getByText('省下的对比剂成本+多做检查量带来的收益')).toBeInTheDocument();
      
      // Check if the revenue value is displayed (there may be multiple instances)
      expect(screen.getAllByText('¥15,000').length).toBeGreaterThan(0);
    });

    it('should display all metric cards with Chinese labels', () => {
      render(
        <I18nProvider>
          <ResultsSection />
        </I18nProvider>
      );

      // Check work efficiency improvement card
      expect(screen.getByText('每台CT每月工作效率提升')).toBeInTheDocument();
      
      // Check monthly exam increase card
      expect(screen.getByText('每月每台CT检查增加量')).toBeInTheDocument();
      
      // Check contrast savings card
      expect(screen.getByText('造影剂节省量')).toBeInTheDocument();
      
      // Check additional revenue card
      expect(screen.getByText('潜在额外收益')).toBeInTheDocument();
    });

    it('should display metric values correctly', () => {
      render(
        <I18nProvider>
          <ResultsSection />
        </I18nProvider>
      );

      // Check that numerical values are displayed (using partial text match)
      expect(screen.getByText((content, element) => {
        return element?.textContent === '25 例';
      })).toBeInTheDocument(); // additional exams
      expect(screen.getByText('120ml')).toBeInTheDocument(); // contrast savings
    });
  });

  describe('Chart Components Integration', () => {
    it('should render all chart components', () => {
      render(
        <I18nProvider>
          <ResultsSection />
        </I18nProvider>
      );

      // Check that all charts are rendered
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('cumulative-chart')).toBeInTheDocument();
    });

    it('should render parameter comparison component', () => {
      render(
        <I18nProvider>
          <ResultsSection />
        </I18nProvider>
      );

      expect(screen.getByTestId('parameter-comparison')).toBeInTheDocument();
    });
  });

  describe('Analysis Conclusion Section', () => {
    it('should display analysis conclusion with translated content', () => {
      render(
        <I18nProvider>
          <ResultsSection />
        </I18nProvider>
      );

      // Check for analysis conclusion title
      expect(screen.getByText('分析结论')).toBeInTheDocument();
      
      // Check for device names in the conclusion (there may be multiple instances)
      expect(screen.getAllByText(/Bayer Centargo/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Ulrich CT Motion/).length).toBeGreaterThan(0);
    });

    it('should display benefits breakdown with Chinese labels', () => {
      render(
        <I18nProvider>
          <ResultsSection />
        </I18nProvider>
      );

      // Check for benefits section
      expect(screen.getByText('收益主要来自以下方面：')).toBeInTheDocument();
      
      // Check for time efficiency section
      expect(screen.getByText('时间效益 (∆P):')).toBeInTheDocument();
      
      // Check for additional exams section
      expect(screen.getByText('增加检查量:')).toBeInTheDocument();
      
      // Check for cost efficiency section
      expect(screen.getByText('成本效益 (∆V):')).toBeInTheDocument();
      
      // Check for contrast savings section
      expect(screen.getByText('造影剂节省:')).toBeInTheDocument();
    });
  });

  describe('Translation Key Usage Validation', () => {
    it('should use all required translation keys without errors', () => {
      // This test ensures that the component renders without throwing errors
      // related to missing translation keys
      expect(() => {
        render(
          <I18nProvider>
            <ResultsSection />
          </I18nProvider>
        );
      }).not.toThrow();
    });

    it('should display translated text for all new features', () => {
      render(
        <I18nProvider>
          <ResultsSection />
        </I18nProvider>
      );

      // Verify that the new translation keys are being used
      const requiredTranslations = [
        '潜在额外收益', // additionalRevenue
        '省下的对比剂成本+多做检查量带来的收益', // revenueDescription
        '每台CT每月工作效率提升', // workEfficiencyImprovement
        '每月每台CT检查增加量', // monthlyExamIncrease
        '造影剂节省量', // contrastSavings
        '分析结论', // analysisConclusion
        '收益主要来自以下方面：', // benefitsFrom
        '时间效益 (∆P):', // timeEfficiency
        '增加检查量:', // additionalExams
        '成本效益 (∆V):', // costEfficiency
        '造影剂节省:' // contrastSavings
      ];

      requiredTranslations.forEach(translation => {
        expect(screen.getByText(translation)).toBeInTheDocument();
      });
    });
  });

  describe('Numerical Formatting', () => {
    it('should format currency values correctly', () => {
      render(
        <I18nProvider>
          <ResultsSection />
        </I18nProvider>
      );

      // Check that currency values are formatted with ¥ symbol (there may be multiple instances)
      expect(screen.getAllByText('¥15,000').length).toBeGreaterThan(0);
    });

    it('should format volume values correctly', () => {
      render(
        <I18nProvider>
          <ResultsSection />
        </I18nProvider>
      );

      // Check that volume values are formatted with ml unit
      expect(screen.getByText('120ml')).toBeInTheDocument();
    });

    it('should display percentage values correctly', () => {
      render(
        <I18nProvider>
          <ResultsSection />
        </I18nProvider>
      );

      // Check that percentage values are displayed (efficiency improvement)
      // The exact value depends on the calculation, but should be a percentage
      const percentageElements = screen.getAllByText(/%/);
      expect(percentageElements.length).toBeGreaterThan(0);
    });
  });
});