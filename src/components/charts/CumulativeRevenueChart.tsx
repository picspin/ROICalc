import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { CumulativeRevenueChartProps } from '../../types';

const CumulativeRevenueChart: React.FC<CumulativeRevenueChartProps> = ({
  baseDevice,
  targetDevice,
  patientVolume,
  isDaily,
  enhancementRate
}) => {
  // Basic chart configuration for testing
  const getOption = (): EChartsOption => {
    // Mock data for initial setup - will be replaced with actual calculations
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const baselineData = months.map(month => month * 10000); // Mock cumulative data
    const targetData = months.map(month => month * 12000); // Mock cumulative data

    return {
      title: {
        text: 'Cumulative Revenue Comparison',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: (params: any) => {
          if (Array.isArray(params) && params.length > 0) {
            const month = params[0].axisValue;
            let tooltip = `<strong>Month ${month}</strong><br/>`;
            params.forEach((param: any) => {
              tooltip += `${param.seriesName}: ¥${param.value.toLocaleString()}<br/>`;
            });
            return tooltip;
          }
          return '';
        }
      },
      legend: {
        data: ['Baseline Device', 'Target Device'],
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: months,
        name: 'Time (Months)',
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          formatter: 'Month {value}'
        }
      },
      yAxis: {
        type: 'value',
        name: 'Cumulative Revenue (¥)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: (value: number) => `¥${(value / 1000).toFixed(0)}K`
        }
      },
      series: [
        {
          name: 'Baseline Device',
          type: 'line',
          data: baselineData,
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#ff6b6b'
          },
          itemStyle: {
            color: '#ff6b6b'
          }
        },
        {
          name: 'Target Device',
          type: 'line',
          data: targetData,
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#0077c8'
          },
          itemStyle: {
            color: '#0077c8'
          }
        }
      ]
    };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <ReactECharts
        option={getOption()}
        style={{ height: '400px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default CumulativeRevenueChart;