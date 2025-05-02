import { Device, CalculationResult, ComparisonRadarData } from '../types';

// Time value in Yuan per minute (hospital technician time value)
const TIME_VALUE_PER_MINUTE = 2;
// Working days per month
const WORKING_DAYS_PER_MONTH = 22;
// Working months per year
const WORKING_MONTHS_PER_YEAR = 12;

/**
 * 计算时间效益 (∆P)
 * 
 * 计算方法：
 * 1. 每患者时间节省 = 基准设备检查时间 - 目标设备检查时间
 * 2. 耗材更换时间节省 = (基准设备更换时间 - 目标设备更换时间) / 每50患者
 * 3. 总时间节省 = (每患者时间节省 + 耗材更换时间节省) * 月患者量 * 时间价值
 */
export const calculateDeltaP = (
  baseDevice: Device,
  targetDevice: Device,
  patientVolume: number,
  isDaily: boolean
): number => {
  // Time saved per patient in minutes
  const timePerPatientBase = baseDevice.specs["单次检查总耗时_分钟"];
  const timePerPatientTarget = targetDevice.specs["单次检查总耗时_分钟"];
  const timeSavedPerPatient = timePerPatientBase - timePerPatientTarget;
  
  // Time saved for consumable changes
  const consumableChangeTimeBase = baseDevice.specs["耗材更换时间_分钟"];
  const consumableChangeTimeTarget = targetDevice.specs["耗材更换时间_分钟"];
  const consumableChangeSaving = consumableChangeTimeBase - consumableChangeTimeTarget;
  
  // Calculate patients per consumable change (assuming one change every 50 patients)
  const patientsPerConsumableChange = 50;
  const consumableSavingPerPatient = consumableChangeSaving / patientsPerConsumableChange;
  
  // Total time saved per patient
  const totalTimeSavedPerPatient = timeSavedPerPatient + consumableSavingPerPatient;
  
  // Convert to monthly if input is daily
  const monthlyPatientVolume = isDaily ? patientVolume * WORKING_DAYS_PER_MONTH : patientVolume;
  
  // Calculate monthly time value saved
  return totalTimeSavedPerPatient * monthlyPatientVolume * TIME_VALUE_PER_MINUTE;
};

/**
 * 计算成本效益 (∆V)
 * 
 * 计算方法：
 * 1. 每患者成本节省 = 基准设备耗材成本 - 目标设备耗材成本
 * 2. 智能化系数 = 目标设备支持智能协议 ? 1.2 : 1.0
 * 3. 月度成本节省 = 每患者成本节省 * 月患者量 * 智能化系数
 */
export const calculateDeltaV = (
  baseDevice: Device,
  targetDevice: Device,
  patientVolume: number,
  isDaily: boolean
): number => {
  // Cost saved per patient in Yuan
  const costPerPatientBase = baseDevice.specs["单次检查耗材成本_元"];
  const costPerPatientTarget = targetDevice.specs["单次检查耗材成本_元"];
  const costSavedPerPatient = costPerPatientBase - costPerPatientTarget;
  
  // Intelligence factor (increased efficiency from smart protocols)
  const intelligenceFactor = targetDevice.specs["智能协议支持"] ? 1.2 : 1.0;
  
  // Convert to monthly if input is daily
  const monthlyPatientVolume = isDaily ? patientVolume * WORKING_DAYS_PER_MONTH : patientVolume;
  
  // Calculate monthly cost saving
  return costSavedPerPatient * monthlyPatientVolume * intelligenceFactor;
};

/**
 * 计算造影剂节省量
 * 
 * 计算方法：
 * 1. 基础用量 = 62ml/患者
 * 2. 节省比例 = 20%（智能协议支持时）
 * 3. 月度节省量 = 月患者量 * 基础用量 * 节省比例
 */
export const calculateContrastSavings = (
  device: Device,
  patientVolume: number,
  isDaily: boolean
): number => {
  const monthlyVolume = isDaily ? patientVolume * WORKING_DAYS_PER_MONTH : patientVolume;
  if (device.specs["智能协议支持"]) {
    return monthlyVolume * 62 * 0.2; // 20% savings on 62ml per patient
  }
  return 0;
};

export const calculateROI = (
  baseDevice: Device,
  targetDevice: Device,
  patientVolume: number,
  isDaily: boolean
): CalculationResult => {
  // Calculate monthly delta P and delta V
  const monthlyDeltaP = calculateDeltaP(baseDevice, targetDevice, patientVolume, isDaily);
  const monthlyDeltaV = calculateDeltaV(baseDevice, targetDevice, patientVolume, isDaily);
  
  // Calculate contrast savings
  const contrastSavings = calculateContrastSavings(targetDevice, patientVolume, isDaily);
  
  // Total monthly savings
  const monthlySavings = monthlyDeltaP + monthlyDeltaV;
  
  // Annual savings
  const annualSavings = monthlySavings * WORKING_MONTHS_PER_YEAR;
  
  // Investment cost difference in Yuan (convert from 万元)
  const baseDeviceCost = baseDevice.specs["设备采购成本_万元"] * 10000;
  const targetDeviceCost = targetDevice.specs["设备采购成本_万元"] * 10000;
  const investmentDifference = targetDeviceCost - baseDeviceCost;
  
  // ROI calculation (annual savings / additional investment)
  const roi = annualSavings / (investmentDifference > 0 ? investmentDifference : 1) * 100;
  
  return {
    deltaP: monthlyDeltaP,
    deltaV: monthlyDeltaV,
    roi,
    monthlySavings,
    annualSavings,
    contrastSavings
  };
};

export const generateRadarData = (
  baseDevice: Device,
  targetDevice: Device
): ComparisonRadarData[] => {
  const radarMetrics = [
    { key: "临床精准度", label: "临床精准度" },
    { key: "工作效率", label: "工作效率" },
    { key: "易用性", label: "易用性" },
    { key: "科研附加值", label: "科研附加值" },
    { key: "维护便捷性", label: "维护便捷性" },
    { key: "造影剂节省量", label: "造影剂节省量" }
  ];
  
  return radarMetrics.map(metric => ({
    subject: metric.label,
    centargo: targetDevice.specs[metric.key] as number,
    comparison: baseDevice.specs[metric.key] as number,
    fullMark: 10
  }));
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'percent',
    maximumFractionDigits: 1
  }).format(value / 100);
};

export const formatNumber = (value: number, decimals = 1): string => {
  return new Intl.NumberFormat('zh-CN', {
    maximumFractionDigits: decimals
  }).format(value);
};

export const formatVolume = (value: number): string => {
  return `${formatNumber(value)} ml`;
};