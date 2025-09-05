import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useAppStore from '../../store/useAppStore';
import { useI18n } from '../../contexts/I18nContext';
import { getDeviceById } from '../../data/devices';
import { formatCurrency, formatPercent, formatVolume } from '../../utils/calculations';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-neutral-200 shadow-lg rounded-md">
        <p className="font-medium text-neutral-800">{label}</p>
        <p className="text-sm">
          <span className="font-medium text-primary-500">{data.formattedValue}</span>
        </p>
      </div>
    );
  }
  return null;
};

const BarChartComponent: React.FC = () => {
  const { calculationResult, targetDeviceId, baseDeviceId } = useAppStore();
  const { t } = useI18n();
  
  if (!calculationResult) return null;
  
  const targetDevice = getDeviceById(targetDeviceId);
  const baseDevice = getDeviceById(baseDeviceId);
  
  if (!targetDevice || !baseDevice) return null;
  
  const { monthlySavings, annualSavings, roi, contrastSavings } = calculationResult;
  
  // Prepare data for the bar chart
  const data = [
    {
      name: t.results.charts.monthlySavings,
      value: monthlySavings,
      formattedValue: formatCurrency(monthlySavings),
      fill: '#0077c8'
    },
    {
      name: t.results.charts.annualSavings,
      value: annualSavings,
      formattedValue: formatCurrency(annualSavings),
      fill: '#34a87c'
    },
    {
      name: t.results.charts.roi,
      value: roi,
      formattedValue: formatPercent(roi),
      fill: '#ef4444'
    },
    {
      name: t.results.charts.monthlyContrastSavings,
      value: contrastSavings,
      formattedValue: formatVolume(contrastSavings),
      fill: '#E46C0A'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-card p-4 h-full">
      <h3 className="text-lg font-semibold mb-4 text-neutral-800">{t.results.charts.barTitle}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#4b5563', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#4b5563', fontSize: 12 }}
              tickFormatter={(value) => {
                if (value >= 10000) return `${(value / 10000).toFixed(0)}万`;
                return value.toString();
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
              fill="#0077c8" 
              fillOpacity={0.8}
              className="cursor-pointer"
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-neutral-600">
        <p className="text-center mb-2">{t.results.charts.comparisonNote} {targetDevice.brand} {targetDevice.model} {t.results.charts.and} {baseDevice.brand} {baseDevice.model} {t.results.charts.economicBenefitDifference}</p>
        <p className="text-xs italic">
          ¹{t.results.charts.percentStudyNote}（Kemper, C.A. et.al. (2022). Performance of Centargo: A novel Piston based injection System for High Throughput in CE CT. Medical Devices(Auckland, NZ)15, 79.）
        </p>
      </div>
    </div>
  );
};

export default BarChartComponent;
