import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import useAppStore from '../../store/useAppStore';
import { useI18n } from '../../contexts/I18nContext';
import { getDeviceById } from '../../data/devices';
import { 
  generateCumulativeRevenueData, 
  generateCumulativeRevenueChartData,
  formatCurrency 
} from '../../utils/calculations';
import { CumulativeRevenueChartProps } from '../../types';

const CumulativeRevenueChart: React.FC<CumulativeRevenueChartProps> = ({
  baseDevice,
  targetDevice,
  patientVolume,
  isDaily,
  enhancementRate
}) => {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<Array<{
    month: number;
    baseDeviceRevenue: number;
    targetDeviceRevenue: number;
    cumulativeBaseline: number;
    cumulativeTarget: number;
    monthlySavings: number;
  }>>([]);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      // Generate cumulative revenue data
      const cumulativeModel = generateCumulativeRevenueData(
        baseDevice,
        targetDevice,
        patientVolume,
        isDaily,
        enhancementRate,
        12 // 12 months
      );

      const data = generateCumulativeRevenueChartData(cumulativeModel);
      setChartData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate chart data');
    } finally {
      setLoading(false);
    }
  }, [baseDevice, targetDevice, patientVolume, isDaily, enhancementRate]);

  // Prepare data for ECharts
  const months = chartData.map(item => `${item.month}月`);
  const baselineData = chartData.map(item => item.cumulativeBaseline);
  const targetData = chartData.map(item => item.cumulativeTarget);

  // Chart configuration
  const option = {
    title: {
      text: t.results.charts.cumulativeTitle,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151'
      },
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: function (params: Array<{ dataIndex: number; axisValue: string }>) {
        if (!params || !Array.isArray(params) || params.length === 0) return '';
        
        const monthIndex = params[0].dataIndex;
        const monthData = chartData[monthIndex];
        
        if (!monthData) return '';
        
        return `
          <div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>
            <div style="margin-bottom: 4px;">
              <span style="display: inline-block; width: 10px; height: 10px; background-color: #6b7280; border-radius: 50%; margin-right: 8px;"></span>
              ${baseDevice.brand} ${baseDevice.model}: ${formatCurrency(monthData.cumulativeBaseline)}
            </div>
            <div style="margin-bottom: 4px;">
              <span style="display: inline-block; width: 10px; height: 10px; background-color: #0077c8; border-radius: 50%; margin-right: 8px;"></span>
              ${targetDevice.brand} ${targetDevice.model}: ${formatCurrency(monthData.cumulativeTarget)}
            </div>
            <div style="margin-bottom: 4px; padding-top: 4px; border-top: 1px solid #e5e7eb;">
              <strong>${t.results.charts.monthlySavings}: ${formatCurrency(monthData.monthlySavings)}</strong>
            </div>
            <div style="margin-bottom: 4px;">
              <strong>${t.results.charts.cumulativeSavings}: ${formatCurrency(monthData.cumulativeTarget - monthData.cumulativeBaseline)}</strong>
            </div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 8px;">
              <div>${t.results.charts.baseRevenue}: ${formatCurrency(monthData.baseDeviceRevenue)}</div>
              <div>${t.results.charts.targetRevenue}: ${formatCurrency(monthData.targetDeviceRevenue)}</div>
            </div>
          </div>
        `;
      }
    },
    legend: {
      data: [
        `${baseDevice.brand} ${baseDevice.model}`,
        `${targetDevice.brand} ${targetDevice.model}`
      ],
      top: 40,
      textStyle: {
        fontSize: 12,
        color: '#4b5563'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '80px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months,
      name: t.results.charts.timeMonths,
      nameLocation: 'middle',
      nameGap: 25,
      nameTextStyle: {
        color: '#6b7280',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisTick: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#4b5563',
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      name: t.results.charts.cumulativeRevenue,
      nameLocation: 'middle',
      nameGap: 50,
      nameTextStyle: {
        color: '#6b7280',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisTick: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#4b5563',
        fontSize: 11,
        formatter: function (value: number) {
          if (value >= 10000) {
            return `${(value / 10000).toFixed(0)}万`;
          }
          return value.toString();
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: `${baseDevice.brand} ${baseDevice.model}`,
        type: 'line',
        data: baselineData,
        smooth: true,
        lineStyle: {
          color: '#6b7280',
          width: 2
        },
        itemStyle: {
          color: '#6b7280'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(107, 114, 128, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(107, 114, 128, 0.05)'
              }
            ]
          }
        },
        symbol: 'circle',
        symbolSize: 6
      },
      {
        name: `${targetDevice.brand} ${targetDevice.model}`,
        type: 'line',
        data: targetData,
        smooth: true,
        lineStyle: {
          color: targetDevice.brand === "Bayer" ? "#E46C0A" : "#0077c8",
          width: 3
        },
        itemStyle: {
          color: targetDevice.brand === "Bayer" ? "#E46C0A" : "#0077c8"
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: targetDevice.brand === "Bayer" 
                  ? 'rgba(228, 108, 10, 0.3)' 
                  : 'rgba(0, 119, 200, 0.3)'
              },
              {
                offset: 1,
                color: targetDevice.brand === "Bayer" 
                  ? 'rgba(228, 108, 10, 0.05)' 
                  : 'rgba(0, 119, 200, 0.05)'
              }
            ]
          }
        },
        symbol: 'circle',
        symbolSize: 6
      }
    ],
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-card p-4 h-full">
        <div className="h-80 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" data-testid="loading-spinner"></div>
            <p className="text-sm text-neutral-600">{t.common.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-card p-4 h-full">
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-2">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-sm text-red-600 font-medium">{t.common.error}</p>
            <p className="text-xs text-neutral-500 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-card p-4 h-full">
      <div className="h-80 sm:h-96 lg:h-80">
        <ReactECharts 
          option={option} 
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          className="w-full h-full"
        />
      </div>
      <div className="mt-4 text-sm text-neutral-600">
        <p className="text-center mb-2">
          {t.results.charts.cumulativeSubtitle} - {targetDevice.brand} {targetDevice.model} {t.results.charts.and} {baseDevice.brand} {baseDevice.model}
        </p>
        <div className="text-xs text-neutral-500 space-y-1">
          <p>• {t.results.charts.cumulativeNote1}</p>
          <p>• {t.results.charts.cumulativeNote2}</p>
          <p>• {t.results.charts.cumulativeNote3}</p>
        </div>
      </div>
    </div>
  );
};

// Component that uses the store data
const CumulativeRevenueChartContainer: React.FC = () => {
  const { targetDeviceId, baseDeviceId, patientVolume, volumeType, ctEnhancementRate } = useAppStore();
  
  const targetDevice = getDeviceById(targetDeviceId);
  const baseDevice = getDeviceById(baseDeviceId);
  
  if (!targetDevice || !baseDevice) {
    return null;
  }
  
  const isDaily = volumeType === 'daily';
  
  return (
    <CumulativeRevenueChart
      baseDevice={baseDevice}
      targetDevice={targetDevice}
      patientVolume={patientVolume}
      isDaily={isDaily}
      enhancementRate={ctEnhancementRate}
    />
  );
};

export default CumulativeRevenueChartContainer;