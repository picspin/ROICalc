export interface DeviceSpecs {
  "耗材更换时间_分钟": number;
  "单次检查总耗时_分钟": number;
  "信息化支持": boolean;
  "智能协议支持": boolean;
  "单次检查耗材成本_元": number;
  "设备采购成本_万元": number;
  "设备10年折旧率": number;
  "临床精准度": number;
  "科研附加值": number;
  "工作效率": number;
  "易用性": number;
  "维护便捷性": number;
  "造影剂节省量": number;
}

export interface Device {
  brand: string;
  model: string;
  category: string;
  isBase: boolean;
  imageUrl: string;
  specs: DeviceSpecs;
}

export interface DevicesData {
  version: string;
  lastUpdated: string;
  devices: Record<string, Device>;
}

export interface CalculationResult {
  deltaP: number;
  deltaV: number;
  roi: number;
  monthlySavings: number;
  annualSavings: number;
  contrastSavings: number;
}

export interface ComparisonRadarData {
  subject: string;
  centargo: number;
  comparison: number;
  fullMark: number;
}

export interface InputData {
  patientVolume: number;
  volumeType: 'daily' | 'monthly';
  targetDeviceId: string;
  baseDeviceId: string;
  ctDeviceCount: number;
}