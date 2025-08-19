import React from 'react';
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import useAppStore from '../../store/useAppStore';
import { useI18n } from '../../contexts/I18nContext';
import { getDeviceById } from '../../data/devices';

const RadarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-neutral-200 shadow-lg rounded-md text-xs">
        <p className="font-medium">{payload[0].payload.subject}</p>
        {payload.map((entry: any) => (
          <p key={entry.dataKey} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(1)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RadarChartComponent: React.FC = () => {
  const { radarData, targetDeviceId, baseDeviceId } = useAppStore();
  const { t } = useI18n();

  const targetDevice = getDeviceById(targetDeviceId);
  const baseDevice = getDeviceById(baseDeviceId);

  if (!radarData.length || !targetDevice || !baseDevice) {
    return null;
  }

  const tooltips = {
    "临床精准度": "CARE研究证实活塞式高注结合主动气泡管理，对提升图像质量有显著帮助（Mcdemott MC .et.al. IEEE Trans Biomed Eng. 2021）",
    "工作效率": "耗材更换时间成本及AutoDoc™ 信息化加持证明对患者增强检查提高了效率",
    "易用性": "信息化加持信息化及AutoDoc™ 扫码枪功能方便加大了数据可回溯性和高注易用性",
    "科研附加值": "个性化方案，P3T方案及KVp Set助力提升科研价值",
    "维护便捷性": "Bayer VirtualCare及Bayer工程师团队敏捷运营",
    "造影剂节省量": "通过智能化协议及多通道管路系统可有效减少造影剂浪费"
  };

  return (
    <div className="bg-white rounded-lg shadow-card p-4 h-full">
      <h3 className="text-lg font-semibold mb-4 text-neutral-800">{t.results.charts.radarTitle}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart outerRadius="70%" data={radarData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#4b5563', fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={18}
              domain={[0, 10]}
              tick={{ fill: '#6b7280', fontSize: 10 }}
            />
            <Tooltip content={<RadarTooltip />} />
            <Radar
              name={`${targetDevice.brand} ${targetDevice.model}`}
              dataKey="centargo"
              stroke={targetDevice.brand === "Bayer" ? "#E46C0A" : "#0077c8"}
              fill={targetDevice.brand === "Bayer" ? "#E46C0A" : "#0077c8"}
              fillOpacity={0.4}
            />
            <Radar
              name={`${baseDevice.brand} ${baseDevice.model}`}
              dataKey="comparison"
              stroke="#6b7280"
              fill="#6b7280"
              fillOpacity={0.3}
            />
            <Legend
              align="center"
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: '12px', color: '#4b5563' }}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-sm text-center text-neutral-600">{t.results.charts.radarSubtitle}</p>
        <div className="text-xs text-neutral-500 space-y-1">
          {Object.entries(tooltips).map(([key, value]) => (
            <div key={key} className="flex items-start space-x-1">
              <span className="font-medium min-w-24">{key}:</span>
              <span className="italic flex-1">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadarChartComponent;