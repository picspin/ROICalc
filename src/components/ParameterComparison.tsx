import React from 'react';
import { TrendingDown, TrendingUp, Minus, Info } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { getDeviceById } from '../data/devices';
import { formatVolume } from '../utils/calculations';

const ParameterComparison: React.FC = () => {
  const { targetDeviceId, baseDeviceId, calculationResult } = useAppStore();
  
  const targetDevice = getDeviceById(targetDeviceId);
  const baseDevice = getDeviceById(baseDeviceId);
  
  if (!targetDevice || !baseDevice || !calculationResult) {
    return null;
  }
  
  // Parameters to compare
  const parameters = [
    { key: "耗材更换时间_分钟", label: "耗材更换时间", unit: "分钟", lowerIsBetter: true },
    { key: "单次检查总耗时_分钟", label: "单次检查总耗时", unit: "分钟", lowerIsBetter: true },
    { key: "设备10年折旧率", label: "10年折旧率", unit: "%", lowerIsBetter: true },
    { key: "临床精准度", label: "临床精准度", unit: "分", lowerIsBetter: false },
    { key: "科研附加值", label: "科研附加值", unit: "分", lowerIsBetter: false },
    { key: "造影剂节省量", label: "造影剂节省量", unit: "分", lowerIsBetter: false }
  ];
  
  const booleanParameters = [
    { key: "信息化支持", label: "信息化支持" },
    { key: "智能协议支持", label: "智能协议支持" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">参数对比</h2>
        <div className="flex items-center text-xs text-neutral-500">
          <Info className="h-3.5 w-3.5 mr-1" />
          <span>数值对比</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">参数</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">{targetDevice.brand} {targetDevice.model}</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">{baseDevice.brand} {baseDevice.model}</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">对比</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {parameters.map((param) => {
              const targetValue = targetDevice.specs[param.key] as number;
              const baseValue = baseDevice.specs[param.key] as number;
              const diff = targetValue - baseValue;
              
              let trend;
              if (diff === 0) {
                trend = <Minus className="h-4 w-4 text-neutral-400" />;
              } else if ((param.lowerIsBetter && diff < 0) || (!param.lowerIsBetter && diff > 0)) {
                trend = <TrendingUp className="h-4 w-4 text-green-500" />;
              } else {
                trend = <TrendingDown className="h-4 w-4 text-red-500" />;
              }
              
              return (
                <tr key={param.key}>
                  <td className="px-4 py-3 text-sm text-neutral-700">{param.label}</td>
                  <td className="px-4 py-3 text-sm text-center font-medium text-neutral-900">{targetValue} {param.unit}</td>
                  <td className="px-4 py-3 text-sm text-center text-neutral-700">{baseValue} {param.unit}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center">
                      {trend}
                      <span className="ml-1 text-sm text-neutral-700">
                        {Math.abs(diff).toFixed(1)} {param.unit}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {booleanParameters.map((param) => {
              const targetValue = targetDevice.specs[param.key] as boolean;
              const baseValue = baseDevice.specs[param.key] as boolean;
              
              let trend;
              if (targetValue === baseValue) {
                trend = <Minus className="h-4 w-4 text-neutral-400" />;
              } else if (targetValue && !baseValue) {
                trend = <TrendingUp className="h-4 w-4 text-green-500" />;
              } else {
                trend = <TrendingDown className="h-4 w-4 text-red-500" />;
              }
              
              return (
                <tr key={param.key}>
                  <td className="px-4 py-3 text-sm text-neutral-700">{param.label}</td>
                  <td className="px-4 py-3 text-sm text-center font-medium text-neutral-900">
                    {targetValue ? '✓' : '✗'}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-neutral-700">
                    {baseValue ? '✓' : '✗'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center">
                      {trend}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParameterComparison;