import { Device, CalculationResult, ComparisonRadarData } from '../types';

// Time value in Yuan per minute (hospital technician time value)
const TIME_VALUE_PER_MINUTE = 1;
// Working days per month
const WORKING_DAYS_PER_MONTH = 24;
// Working months per year
const WORKING_MONTHS_PER_YEAR = 12;
// 对比剂价格（元/ml）
const CONTRAST_PRICE_PER_ML = 2;
// 基础对比剂用量（ml/患者）
const BASE_CONTRAST_VOLUME = 62;
// 智能协议对比剂节省比例
const SMART_PROTOCOL_SAVING_RATE = 0.2; // 20%

// CT检查费用常量 (基于2025年8月全国放射科检查费用标准)
export const CT_ENHANCED_FEE = 269.5; // RMB
export const CT_PLAIN_FEE = 228; // RMB
export const CT_PLAIN_DURATION = 2; // minutes

/**
 * 计算时间效益 (∆P) - 更新为考虑CT增强率
 * 
 * 计算方法：
 * 1. 每患者时间节省 = 基准设备检查时间 - 目标设备检查时间
 * 2. 耗材更换时间节省 = (基准设备更换时间 - 目标设备更换时间) / 每50患者
 * 3. 总时间节省 = (每患者时间节省 + 耗材更换时间节省) * 月患者量 * CT增强率 * 时间价值
 */
export const calculateDeltaP = (
  baseDevice: Device,
  targetDevice: Device,
  patientVolume: number,
  isDaily: boolean,
  enhancementRate: number = 60
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

  // Apply enhancement rate (only enhanced scans benefit from time savings)
  const enhancementRateDecimal = enhancementRate / 100;

  // Calculate monthly time value saved
  return totalTimeSavedPerPatient * monthlyPatientVolume * enhancementRateDecimal * TIME_VALUE_PER_MINUTE;
};

/**
 * 计算成本效益 (∆V)
 * 
 * 计算方法：
 * 1. 耗材成本节省 = (基准设备耗材成本 - 目标设备耗材成本) * 月患者量
 * 2. 对比剂节省费用 = 对比剂节省量 * 对比剂单价
 * 3. 月度成本总节省 = 耗材成本节省 + 对比剂节省费用
 */
export const calculateDeltaV = (
  baseDevice: Device,
  targetDevice: Device,
  patientVolume: number,
  isDaily: boolean,
  contrastSavingsVolume: number
): number => {
  // Cost saved per patient in Yuan (only consumables)
  const costPerPatientBase = baseDevice.specs["单次检查耗材成本_元"];
  const costPerPatientTarget = targetDevice.specs["单次检查耗材成本_元"];
  const costSavedPerPatient = costPerPatientBase - costPerPatientTarget;

  // Convert to monthly if input is daily
  const monthlyPatientVolume = isDaily ? patientVolume * WORKING_DAYS_PER_MONTH : patientVolume;

  // Calculate monthly consumables cost saving
  const consumablesSaving = costSavedPerPatient * monthlyPatientVolume;

  // Calculate cost saving from contrast agent reduction
  const contrastSavingCost = contrastSavingsVolume * CONTRAST_PRICE_PER_ML;

  // Total monthly cost saving (consumables + contrast)
  return consumablesSaving + contrastSavingCost;
};

/**
 * 计算对比两个设备间的造影剂节省量
 * 
 * 计算方法：
 * 1. 基准设备造影剂使用量 = 月患者量 * 基础用量 * (1 - 基准设备节省比例)
 * 2. 目标设备造影剂使用量 = 月患者量 * 基础用量 * (1 - 目标设备节省比例)
 * 3. 造影剂节省量 = 基准设备使用量 - 目标设备使用量
 */
export const calculateContrastSavings = (
  baseDevice: Device,
  targetDevice: Device,
  patientVolume: number,
  isDaily: boolean
): number => {
  const monthlyVolume = isDaily ? patientVolume * WORKING_DAYS_PER_MONTH : patientVolume;

  // 计算基准和目标设备的节省比例
  const baseSavingRate = baseDevice.specs["智能协议支持"] ? SMART_PROTOCOL_SAVING_RATE : 0;
  const targetSavingRate = targetDevice.specs["智能协议支持"] ? SMART_PROTOCOL_SAVING_RATE : 0;

  // 根据造影剂节省量评分差异计算额外节省
  const baseEfficiency = baseDevice.specs["造影剂节省量"] as number;
  const targetEfficiency = targetDevice.specs["造影剂节省量"] as number;
  const efficiencyFactor = Math.max(0, (targetEfficiency - baseEfficiency) / 10); // 转换为0-1范围

  // 计算基准设备和目标设备的造影剂使用量
  const baseUsage = monthlyVolume * BASE_CONTRAST_VOLUME * (1 - baseSavingRate);
  const targetUsage = monthlyVolume * BASE_CONTRAST_VOLUME * (1 - targetSavingRate - efficiencyFactor * 0.15); // 额外15%的效率节省

  // 计算节省量
  return Math.max(0, baseUsage - targetUsage);
};

export const calculateROI = (
  baseDevice: Device,
  targetDevice: Device,
  patientVolume: number,
  isDaily: boolean,
  enhancementRate: number = 60
): CalculationResult => {
  // Calculate contrast savings
  const contrastSavings = calculateContrastSavings(baseDevice, targetDevice, patientVolume, isDaily);

  // Calculate monthly delta P and delta V
  const monthlyDeltaP = calculateDeltaP(baseDevice, targetDevice, patientVolume, isDaily, enhancementRate);
  const monthlyDeltaV = calculateDeltaV(baseDevice, targetDevice, patientVolume, isDaily, contrastSavings);

  // Calculate additional revenue
  const additionalRevenue = calculateAdditionalRevenue(baseDevice, targetDevice, patientVolume, isDaily, enhancementRate);

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
    contrastSavings,
    additionalRevenue
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

/**
 * 计算节省时间可增加的CT检查数量
 * 
 * 计算方法：
 * 节省的工作小时 * 60分钟 / 目标设备单次检查总耗时
 */
export const calculateExtraCTExams = (
  savedHours: number,
  targetDeviceExamTime: number
): number => {
  const savedMinutes = savedHours * 60;
  return savedMinutes / targetDeviceExamTime;
};

/**
 * 计算潜在额外收益 (基于节省时间按增强率分配)
 * 
 * 计算方法：
 * 1. 计算每患者节省的时间 (分钟)
 * 2. 计算耗材更换时间节省 (分钟/患者)
 * 3. 总时间节省 (分钟/月) - 仅针对增强检查
 * 4. 按增强率分配额外检查时间
 * 5. 计算可增加的检查数量
 * 6. 计算额外收益
 */
export const calculateAdditionalRevenue = (
  baseDevice: Device,
  targetDevice: Device,
  patientVolume: number,
  isDaily: boolean = true,
  enhancementRate: number = 60
): number => {
  const monthlyVolume = isDaily ? patientVolume * WORKING_DAYS_PER_MONTH : patientVolume;

  // 计算每患者节省的时间 (分钟)
  const baseExamTime = baseDevice.specs["单次检查总耗时_分钟"] as number;
  const targetExamTime = targetDevice.specs["单次检查总耗时_分钟"] as number;
  const timeSavedPerPatient = baseExamTime - targetExamTime;

  // 计算耗材更换时间节省 (分钟/患者)
  const baseConsumableTime = baseDevice.specs["耗材更换时间_分钟"] as number;
  const targetConsumableTime = targetDevice.specs["耗材更换时间_分钟"] as number;
  const consumableTimeSavedPerPatient = (baseConsumableTime - targetConsumableTime) / 50; // 每50患者更换一次

  // 总时间节省 (分钟/月) - 来自增强检查的时间节省
  const enhancementRateDecimal = enhancementRate / 100;
  const totalTimeSavedMinutes = (timeSavedPerPatient + consumableTimeSavedPerPatient) * monthlyVolume * enhancementRateDecimal;

  // 节省的时间可以用于增加检查，按医院的增强率分配
  const enhancedExamTime = baseExamTime; // 增强检查时间
  const plainExamTime = CT_PLAIN_DURATION; // 平扫检查时间

  // 计算可增加的检查数量 - 按医院增强率分配时间
  const additionalEnhancedExams = (totalTimeSavedMinutes * enhancementRateDecimal) / enhancedExamTime;
  const additionalPlainExams = (totalTimeSavedMinutes * (1 - enhancementRateDecimal)) / plainExamTime;

  // 计算额外收益
  const enhancedRevenue = additionalEnhancedExams * CT_ENHANCED_FEE;
  const plainRevenue = additionalPlainExams * CT_PLAIN_FEE;

  return enhancedRevenue + plainRevenue;
};