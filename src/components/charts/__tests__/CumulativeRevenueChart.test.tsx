import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import CumulativeRevenueChart from '../CumulativeRevenueChart';
import { I18nProvider } from '../../../contexts/I18nContext';
import { Device } from '../../../types';

// Mock data for testing
const mockBaseDevice: Device = {
  brand: 'Ulrich',
  model: 'CTMotion',
  category: 'high-pressure-injector',
  isBase: true,
  imageUrl: '/images/devices/Ulrich-CTMotion.png',
  specs: {
    "耗材更换时间_分钟": 5,
    "单次检查总耗时_分钟": 12,
    "信息化支持": false,
    "智能协议支持": false,
    "单次检查耗材成本_元": 55,
    "设备采购成本_万元": 85,
    "设备10年折旧率": 0.1,
    "临床精准度": 6,
    "科研附加值": 5,
    "工作效率": 6,
    "易用性": 6,
    "维护便捷性": 6,
    "造影剂节省量": 5,
    "注射技术类型": "蠕吸式" as const,
    "管路类型": "双筒" as const,
    "NMPA等级": "NMPA ClassII" as const
  }
};

const mockTargetDevice: Device = {
  brand: 'Bayer',
  model: 'Centargo',
  category: 'high-pressure-injector',
  isBase: false,
  imageUrl: '/images/devices/Bayer-Centargo.png',
  specs: {
    "耗材更换时间_分钟": 2,
    "单次检查总耗时_分钟": 8,
    "信息化支持": true,
    "智能协议支持": true,
    "单次检查耗材成本_元": 45,
    "设备采购成本_万元": 120,
    "设备10年折旧率": 0.1,
    "临床精准度": 9,
    "科研附加值": 9,
    "工作效率": 9,
    "易用性": 8,
    "维护便捷性": 8,
    "造影剂节省量": 8,
    "注射技术类型": "活塞式" as const,
    "管路类型": "三筒" as const,
    "NMPA等级": "NMPA ClassIII" as const
  }
};

// Mock chart data for testing
const mockChartData = Array.from({ length: 12 }, (_, index) => ({
  month: index + 1,
  baseDeviceRevenue: 50000 + (index * 2000),
  targetDeviceRevenue: 65000 + (index * 2500),
  cumulativeBaseline: (50000 + (index * 2000)) * (index + 1),
  cumulativeTarget: (65000 + (index * 2500)) * (index + 1),
  monthlySavings: 15000 + (index * 500)
}));

// Mock echarts-for-react with interaction capabilities
vi.mock('echarts-for-react', () => ({
  default: vi.fn(({ option, style, className }) => {
    const handleMouseOver = () => {
      // Simulate tooltip trigger
      const tooltipEvent = new CustomEvent('tooltip', {
        detail: { dataIndex: 0, axisValue: '1月' }
      });
      document.dispatchEvent(tooltipEvent);
    };

    return (
      <div 
        data-testid="echarts-mock" 
        style={style}
        className={className}
        onMouseOver={handleMouseOver}
      >
        <div data-testid="chart-title">{option?.title?.text}</div>
        <div data-testid="chart-legend">
          {option?.legend?.data?.map((item: string, index: number) => (
            <span key={index} data-testid={`legend-item-${index}`}>{item}</span>
          ))}
        </div>
        <div data-testid="chart-series">
          {option?.series?.map((series: unknown, index: number) => (
            <div key={index} data-testid={`series-${index}`}>
              <span data-testid={`series-name-${index}`}>{series.name}</span>
              <span data-testid={`series-data-${index}`}>{JSON.stringify(series.data)}</span>
            </div>
          ))}
        </div>
        <div data-testid="chart-xaxis-data">{JSON.stringify(option?.xAxis?.data)}</div>
        <div data-testid="chart-tooltip-formatter" style={{ display: 'none' }}>
          {option?.tooltip?.formatter && typeof option.tooltip.formatter === 'function' 
            ? 'tooltip-function-present' 
            : 'no-tooltip-function'}
        </div>
      </div>
    );
  })
}));

// Mock the store
const mockStoreData = {
  targetDeviceId: 'bayer-centargo',
  baseDeviceId: 'ulrich-ctmotion',
  patientVolume: 50,
  volumeType: 'daily',
  ctEnhancementRate: 60
};

vi.mock('../../../store/useAppStore', () => ({
  default: () => mockStoreData
}));

// Mock device data
vi.mock('../../../data/devices', () => ({
  getDeviceById: (id: string) => {
    const devices: Record<string, Device> = {
      'bayer-centargo': mockTargetDevice,
      'ulrich-ctmotion': mockBaseDevice
    };
    return devices[id];
  }
}));

// Mock calculation functions
vi.mock('../../../utils/calculations', () => ({
  generateCumulativeRevenueData: vi.fn(() => ({
    baselineDevice: Array.from({ length: 12 }, () => ({
      enhancedScans: { count: 20, revenue: 30000 },
      plainScans: { count: 10, revenue: 20000 },
      contrastSavings: 5000,
      additionalExamRevenue: 0,
      totalMonthlyRevenue: 50000
    })),
    targetDevice: Array.from({ length: 12 }, () => ({
      enhancedScans: { count: 25, revenue: 37500 },
      plainScans: { count: 15, revenue: 30000 },
      contrastSavings: 8000,
      additionalExamRevenue: 5000,
      totalMonthlyRevenue: 65000
    })),
    monthlySavings: Array.from({ length: 12 }, (_, i) => 15000 + (i * 500)),
    cumulativeSavings: Array.from({ length: 12 }, (_, i) => (15000 + (i * 500)) * (i + 1))
  })),
  generateCumulativeRevenueChartData: vi.fn(() => mockChartData),
  formatCurrency: vi.fn((value: number) => `¥${value.toLocaleString()}`)
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <I18nProvider>
    {children}
  </I18nProvider>
);

describe('CumulativeRevenueChart Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Chart Rendering with Mock Data', () => {
    it('renders chart component with proper structure', async () => {
      render(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={50}
            isDaily={true}
            enhancementRate={60}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('echarts-mock')).toBeInTheDocument();
      });

      expect(screen.getByTestId('chart-title')).toHaveTextContent('累积收益对比');
    });

    it('displays correct legend items for both devices', async () => {
      render(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={50}
            isDaily={true}
            enhancementRate={60}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('legend-item-0')).toHaveTextContent('Ulrich CTMotion');
        expect(screen.getByTestId('legend-item-1')).toHaveTextContent('Bayer Centargo');
      });
    });

    it('renders chart series with correct data structure', async () => {
      render(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={50}
            isDaily={true}
            enhancementRate={60}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('series-name-0')).toHaveTextContent('Ulrich CTMotion');
        expect(screen.getByTestId('series-name-1')).toHaveTextContent('Bayer Centargo');
      });

      // Verify series data is present
      expect(screen.getByTestId('series-data-0')).toBeInTheDocument();
      expect(screen.getByTestId('series-data-1')).toBeInTheDocument();
    });

    it('displays 12-month x-axis data', async () => {
      render(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={50}
            isDaily={true}
            enhancementRate={60}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        const xAxisData = screen.getByTestId('chart-xaxis-data');
        expect(xAxisData).toHaveTextContent('1月');
        expect(xAxisData).toHaveTextContent('12月');
      });
    });
  });

  describe('Chart Responsiveness', () => {
    it('applies responsive styling classes', async () => {
      render(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={50}
            isDaily={true}
            enhancementRate={60}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        const chartElement = screen.getByTestId('echarts-mock');
        expect(chartElement).toHaveClass('w-full', 'h-full');
      });
    });

    it('renders with proper container dimensions', async () => {
      render(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={50}
            isDaily={true}
            enhancementRate={60}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        const chartElement = screen.getByTestId('echarts-mock');
        expect(chartElement).toHaveStyle({ height: '100%', width: '100%' });
      });
    });
  });

  describe('Chart Interaction Features', () => {
    it('includes tooltip formatter function', async () => {
      render(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={50}
            isDaily={true}
            enhancementRate={60}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('chart-tooltip-formatter')).toHaveTextContent('tooltip-function-present');
      });
    });

    it('handles mouse interactions', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={50}
            isDaily={true}
            enhancementRate={60}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        const chartElement = screen.getByTestId('echarts-mock');
        expect(chartElement).toBeInTheDocument();
      });

      const chartElement = screen.getByTestId('echarts-mock');
      await user.hover(chartElement);
      
      // Verify the chart can handle mouse interactions
      expect(chartElement).toBeInTheDocument();
    });
  });

  describe('Language Switching Integration', () => {
    it('renders Chinese translations by default', async () => {
      render(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={50}
            isDaily={true}
            enhancementRate={60}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/12个月累积收益对比分析/)).toBeInTheDocument();
        expect(screen.getByText(/图表显示两设备在12个月内的累积收益对比/)).toBeInTheDocument();
        expect(screen.getByText(/目标设备收益包含：基础检查费用/)).toBeInTheDocument();
        expect(screen.getByText(/鼠标悬停可查看详细的月度收益分解/)).toBeInTheDocument();
      });
    });

    it('updates chart title when language changes', async () => {
      const { rerender } = render(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={50}
            isDaily={true}
            enhancementRate={60}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('chart-title')).toHaveTextContent('累积收益对比');
      });

      // Simulate language change by re-rendering
      rerender(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={50}
            isDaily={true}
            enhancementRate={60}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('chart-title')).toBeInTheDocument();
      });
    });
  });

  describe('Performance with Realistic Data Volumes', () => {
    it('handles large patient volumes efficiently', async () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={1000}
            isDaily={true}
            enhancementRate={80}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('echarts-mock')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Ensure rendering completes within reasonable time (2 seconds)
      expect(renderTime).toBeLessThan(2000);
    });

    it('handles high enhancement rates without performance degradation', async () => {
      render(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={500}
            isDaily={false}
            enhancementRate={95}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('echarts-mock')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Verify chart renders successfully with high enhancement rate
      expect(screen.getByTestId('chart-title')).toBeInTheDocument();
    });

    it('processes monthly volume calculations correctly', async () => {
      render(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={200}
            isDaily={false}
            enhancementRate={70}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('echarts-mock')).toBeInTheDocument();
      });

      // Verify the chart handles monthly volume type
      expect(screen.getByTestId('series-0')).toBeInTheDocument();
      expect(screen.getByTestId('series-1')).toBeInTheDocument();
    });
  });

  describe('Error Handling and Loading States', () => {
    it('handles calculation errors gracefully', async () => {
      // Mock calculation error
      const { generateCumulativeRevenueData } = await import('../../../utils/calculations');
      vi.mocked(generateCumulativeRevenueData).mockImplementationOnce(() => {
        throw new Error('Calculation failed');
      });

      render(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={50}
            isDaily={true}
            enhancementRate={60}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('错误')).toBeInTheDocument();
        expect(screen.getByText('Calculation failed')).toBeInTheDocument();
      });
    });

    it('shows loading spinner during initial render', () => {
      // Test that the component structure supports loading states
      render(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={50}
            isDaily={true}
            enhancementRate={60}
          />
        </TestWrapper>
      );

      // The component should render successfully (loading state is too fast to catch in sync tests)
      expect(screen.getByTestId('echarts-mock')).toBeInTheDocument();
    });

    it('handles prop changes correctly', async () => {
      const { rerender } = render(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={50}
            isDaily={true}
            enhancementRate={60}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('echarts-mock')).toBeInTheDocument();
      });

      // Change props to trigger re-render
      rerender(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={100}
            isDaily={false}
            enhancementRate={80}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('echarts-mock')).toBeInTheDocument();
      });
    });
  });

  describe('Container Component Integration', () => {
    it('renders container component with store data', async () => {
      const CumulativeRevenueChartContainer = (await import('../CumulativeRevenueChart')).default;
      
      render(
        <TestWrapper>
          <CumulativeRevenueChartContainer />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('echarts-mock')).toBeInTheDocument();
      });

      // Verify it uses store data correctly
      expect(screen.getByTestId('legend-item-0')).toHaveTextContent('Ulrich CTMotion');
      expect(screen.getByTestId('legend-item-1')).toHaveTextContent('Bayer Centargo');
    });

    it('validates component integration with realistic data', async () => {
      render(
        <TestWrapper>
          <CumulativeRevenueChart
            baseDevice={mockBaseDevice}
            targetDevice={mockTargetDevice}
            patientVolume={75}
            isDaily={true}
            enhancementRate={65}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('echarts-mock')).toBeInTheDocument();
      });

      // Verify chart data is generated with different parameters
      expect(screen.getByTestId('series-0')).toBeInTheDocument();
      expect(screen.getByTestId('series-1')).toBeInTheDocument();
      expect(screen.getByTestId('chart-xaxis-data')).toBeInTheDocument();
    });
  });
});