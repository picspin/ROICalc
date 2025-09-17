import { describe, it, expect } from 'vitest';
import {
  calculateDeltaP,
  calculateDeltaV,
  calculateContrastSavings,
  calculateROI,
  generateRadarData,
  formatCurrency,
  formatPercent,
  formatNumber,
  formatVolume,
  calculateExtraCTExams,
  calculateAdditionalRevenue,
  calculateTotalAdditionalExams,
  calculateActualAdditionalRevenue,
  calculateMonthlyRevenueBreakdown,
  generateCumulativeRevenueData,
  generateCumulativeRevenueChartData
} from '../calculations';
import { Device } from '../../types';

// Mock device data for testing (updated to match actual device specs)
const mockBaseDevice: Device = {
  brand: 'Ulrich',
  model: 'CTMotion',
  category: '高压注射器',
  isBase: true,
  imageUrl: '/test-base.png',
  specs: {
    "耗材更换时间_分钟": 6,
    "单次检查总耗时_分钟": 12,
    "信息化支持": true,
    "智能协议支持": false,
    "单次检查耗材成本_元": 110,
    "设备采购成本_万元": 25,
    "设备10年折旧率": 10,
    "临床精准度": 7,
    "科研附加值": 7,
    "工作效率": 7,
    "易用性": 7.5,
    "维护便捷性": 7,
    "造影剂节省量": 7.5,
    "注射技术类型": "蠕吸式",
    "管路类型": "三筒",
    "NMPA等级": "NMPA ClassII"
  }
};

const mockTargetDevice: Device = {
  brand: 'Bayer',
  model: 'Centargo',
  category: '高压注射器',
  isBase: false,
  imageUrl: '/test-target.png',
  specs: {
    "耗材更换时间_分钟": 2,
    "单次检查总耗时_分钟": 10.33,
    "信息化支持": true,
    "智能协议支持": true,
    "单次检查耗材成本_元": 100,
    "设备采购成本_万元": 33,
    "设备10年折旧率": 8,
    "临床精准度": 9,
    "科研附加值": 9,
    "工作效率": 8,
    "易用性": 8,
    "维护便捷性": 8.5,
    "造影剂节省量": 9,
    "注射技术类型": "活塞式",
    "管路类型": "三筒",
    "NMPA等级": "NMPA ClassIII"
  }
};

describe('Calculation Functions', () => {
  describe('calculateDeltaP', () => {
    it('should calculate time efficiency savings correctly for daily input', () => {
      const result = calculateDeltaP(mockBaseDevice, mockTargetDevice, 50, true, 60);
      
      // Expected calculation with updated device specs:
      // Time saved per patient: 12 - 10.33 = 1.67 minutes
      // Consumable change saving per patient: (6 - 2) / 50 = 0.08 minutes
      // Total time saved per patient: 1.67 + 0.08 = 1.75 minutes
      // Monthly volume: 50 * 24 = 1200 patients
      // Enhancement rate: 60% = 0.6
      // Monthly savings: 1.75 * 1200 * 0.6 * 1 = 1260 yuan (TIME_VALUE_PER_MINUTE = 1)
      
      expect(result).toBeCloseTo(1260, 1);
    });

    it('should calculate time efficiency savings correctly for monthly input', () => {
      const result = calculateDeltaP(mockBaseDevice, mockTargetDevice, 1100, false, 60);
      
      // Same calculation but monthly volume is used directly
      // 1.75 * 1100 * 0.6 * 1 = 1155 yuan
      expect(result).toBeCloseTo(1155, 1);
    });

    it('should handle zero time difference', () => {
      const sameTimeDevice = { ...mockTargetDevice };
      sameTimeDevice.specs["单次检查总耗时_分钟"] = 12;
      sameTimeDevice.specs["耗材更换时间_分钟"] = 6;
      
      const result = calculateDeltaP(mockBaseDevice, sameTimeDevice, 50, true, 60);
      expect(result).toBe(0);
    });
  });

  describe('calculateContrastSavings', () => {
    it('should calculate contrast savings with smart protocol support', () => {
      const result = calculateContrastSavings(mockBaseDevice, mockTargetDevice, 50, true);
      
      // Base device: no smart protocol (0% saving)
      // Target device: smart protocol (20% saving) + efficiency factor
      // Monthly volume: 50 * 22 = 1100
      // Base usage: 1100 * 62 * 1 = 68200 ml
      // Target usage should be less due to smart protocol and efficiency
      
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(68200);
    });

    it('should handle devices without smart protocol', () => {
      const noSmartDevice = { ...mockTargetDevice };
      noSmartDevice.specs["智能协议支持"] = false;
      
      const result = calculateContrastSavings(mockBaseDevice, noSmartDevice, 50, true);
      
      // Should still have some savings due to efficiency difference
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateDeltaV', () => {
    it('should calculate cost savings correctly', () => {
      const contrastSavings = 1000; // ml
      const result = calculateDeltaV(mockBaseDevice, mockTargetDevice, 50, true, contrastSavings, 60);
      
      // Consumable cost saving per patient: 110 - 100 = 10 yuan
      // Monthly volume: 50 * 24 = 1200 patients
      // Enhancement rate: 60% = 0.6 (applied to consumables)
      // Consumable savings: 10 * 1200 * 0.6 = 7200 yuan
      // Contrast savings: 1000 * 2.7 = 2700 yuan (CONTRAST_PRICE_PER_ML = 2.7)
      // Total: 7200 + 2700 = 9900 yuan
      
      expect(result).toBe(9900);
    });

    it('should handle negative consumable cost difference', () => {
      const expensiveTargetDevice = { ...mockTargetDevice };
      expensiveTargetDevice.specs["单次检查耗材成本_元"] = 150;
      
      const result = calculateDeltaV(mockBaseDevice, expensiveTargetDevice, 50, true, 1000, 60);
      
      // Consumable cost difference: 110 - 150 = -40 yuan per patient
      // Monthly: -40 * 1200 * 0.6 = -28800 yuan (with enhancement rate applied)
      // Plus contrast savings: 1000 * 2.7 = 2700 yuan
      // Total: -28800 + 2700 = -26100 yuan
      
      expect(result).toBe(-26100);
    });
  });

  describe('calculateROI', () => {
    it('should calculate complete ROI analysis', () => {
      const result = calculateROI(mockBaseDevice, mockTargetDevice, 50, true, 60);
      
      expect(result).toHaveProperty('deltaP');
      expect(result).toHaveProperty('deltaV');
      expect(result).toHaveProperty('roi');
      expect(result).toHaveProperty('monthlySavings');
      expect(result).toHaveProperty('annualSavings');
      expect(result).toHaveProperty('contrastSavings');
      expect(result).toHaveProperty('additionalRevenue');
      
      expect(result.deltaP).toBeGreaterThanOrEqual(0);
      // deltaV can be negative if target device has higher consumable costs
      expect(typeof result.deltaV).toBe('number');
      expect(result.monthlySavings).toBe(result.deltaP + result.deltaV);
      expect(result.annualSavings).toBe(result.monthlySavings * 12);
      expect(typeof result.additionalRevenue).toBe('number');
    });

    it('should handle higher cost target device', () => {
      const expensiveDevice = { ...mockTargetDevice };
      expensiveDevice.specs["设备采购成本_万元"] = 50;
      
      const result = calculateROI(mockBaseDevice, expensiveDevice, 50, true, 60);
      
      // Should still calculate ROI even with higher investment
      expect(result.roi).toBeDefined();
      expect(typeof result.roi).toBe('number');
      expect(result.additionalRevenue).toBeDefined();
    });
  });

  describe('generateRadarData', () => {
    it('should generate radar chart data for all metrics', () => {
      const result = generateRadarData(mockBaseDevice, mockTargetDevice);
      
      expect(result).toHaveLength(6);
      
      const expectedMetrics = [
        '临床精准度', '工作效率', '易用性', '科研附加值', '维护便捷性', '造影剂节省量'
      ];
      
      result.forEach((item, index) => {
        expect(item.subject).toBe(expectedMetrics[index]);
        expect(item.centargo).toBe(mockTargetDevice.specs[expectedMetrics[index].replace('临床精准度', '临床精准度').replace('工作效率', '工作效率').replace('易用性', '易用性').replace('科研附加值', '科研附加值').replace('维护便捷性', '维护便捷性').replace('造影剂节省量', '造影剂节省量')] as number);
        expect(item.comparison).toBe(mockBaseDevice.specs[expectedMetrics[index].replace('临床精准度', '临床精准度').replace('工作效率', '工作效率').replace('易用性', '易用性').replace('科研附加值', '科研附加值').replace('维护便捷性', '维护便捷性').replace('造影剂节省量', '造影剂节省量')] as number);
        expect(item.fullMark).toBe(10);
      });
    });
  });

  describe('Formatting Functions', () => {
    describe('formatCurrency', () => {
      it('should format currency in Chinese Yuan', () => {
        expect(formatCurrency(12345)).toBe('¥12,345');
        expect(formatCurrency(0)).toBe('¥0');
        expect(formatCurrency(-1000)).toBe('-¥1,000');
      });
    });

    describe('formatPercent', () => {
      it('should format percentage correctly', () => {
        expect(formatPercent(25.5)).toBe('25.5%');
        expect(formatPercent(100)).toBe('100%');
        expect(formatPercent(0)).toBe('0%');
      });
    });

    describe('formatNumber', () => {
      it('should format numbers with specified decimals', () => {
        expect(formatNumber(123.456)).toBe('123.5');
        expect(formatNumber(123.456, 2)).toBe('123.46');
        expect(formatNumber(1000)).toBe('1,000');
      });
    });

    describe('formatVolume', () => {
      it('should format volume with ml unit', () => {
        expect(formatVolume(123.45)).toBe('123.5 ml');
        expect(formatVolume(1000)).toBe('1,000 ml');
      });
    });
  });

  describe('calculateExtraCTExams', () => {
    it('should calculate additional CT exams from saved time', () => {
      const savedHours = 2;
      const examTime = 5; // minutes
      
      const result = calculateExtraCTExams(savedHours, examTime);
      
      // 2 hours = 120 minutes
      // 120 / 5 = 24 additional exams
      expect(result).toBe(24);
    });

    it('should handle fractional results', () => {
      const savedHours = 1.5;
      const examTime = 7;
      
      const result = calculateExtraCTExams(savedHours, examTime);
      
      // 1.5 hours = 90 minutes
      // 90 / 7 ≈ 12.86 exams
      expect(result).toBeCloseTo(12.86, 2);
    });
  });

  describe('calculateTotalAdditionalExams', () => {
    it('should calculate total additional exams (enhanced + plain)', () => {
      const result = calculateTotalAdditionalExams(mockBaseDevice, mockTargetDevice, 50, true, 60);
      
      // Should return a number representing total additional exams
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should handle different enhancement rates', () => {
      const result100 = calculateTotalAdditionalExams(mockBaseDevice, mockTargetDevice, 50, true, 100);
      const result50 = calculateTotalAdditionalExams(mockBaseDevice, mockTargetDevice, 50, true, 50);
      const result0 = calculateTotalAdditionalExams(mockBaseDevice, mockTargetDevice, 50, true, 0);
      
      // All should return valid numbers
      expect(typeof result100).toBe('number');
      expect(typeof result50).toBe('number');
      expect(typeof result0).toBe('number');
      expect(result100).toBeGreaterThanOrEqual(0);
      expect(result50).toBeGreaterThanOrEqual(0);
      expect(result0).toBeGreaterThanOrEqual(0);
    });

    it('should handle monthly vs daily input', () => {
      const dailyResult = calculateTotalAdditionalExams(mockBaseDevice, mockTargetDevice, 50, true, 60);
      const monthlyResult = calculateTotalAdditionalExams(mockBaseDevice, mockTargetDevice, 1200, false, 60);
      
      // Results should be similar (50 daily * 24 days = 1200 monthly)
      expect(Math.abs(dailyResult - monthlyResult)).toBeLessThan(1);
    });
  });

  describe('calculateActualAdditionalRevenue', () => {
    it('should calculate actual additional revenue from saved time', () => {
      const result = calculateActualAdditionalRevenue(mockBaseDevice, mockTargetDevice, 50, true, 60);
      
      // Should return a number representing actual additional revenue
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should match calculateAdditionalRevenue result', () => {
      const actualResult = calculateActualAdditionalRevenue(mockBaseDevice, mockTargetDevice, 50, true, 60);
      const additionalResult = calculateAdditionalRevenue(mockBaseDevice, mockTargetDevice, 50, true, 60);
      
      // Both functions should return the same result for consistency
      expect(actualResult).toBe(additionalResult);
    });

    it('should handle different enhancement rates consistently', () => {
      const result100 = calculateActualAdditionalRevenue(mockBaseDevice, mockTargetDevice, 50, true, 100);
      const result50 = calculateActualAdditionalRevenue(mockBaseDevice, mockTargetDevice, 50, true, 50);
      const result0 = calculateActualAdditionalRevenue(mockBaseDevice, mockTargetDevice, 50, true, 0);
      
      // All should return valid numbers
      expect(typeof result100).toBe('number');
      expect(typeof result50).toBe('number');
      expect(typeof result0).toBe('number');
      expect(result100).toBeGreaterThanOrEqual(0);
      expect(result50).toBeGreaterThanOrEqual(0);
      expect(result0).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateAdditionalRevenue', () => {
    it('should calculate additional revenue from saved time', () => {
      const result = calculateAdditionalRevenue(mockBaseDevice, mockTargetDevice, 50, true, 60);
      
      // Should return a number representing potential additional revenue
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should handle different enhancement rates', () => {
      const result100 = calculateAdditionalRevenue(mockBaseDevice, mockTargetDevice, 50, true, 100);
      const result50 = calculateAdditionalRevenue(mockBaseDevice, mockTargetDevice, 50, true, 50);
      
      // Both should return numbers
      expect(typeof result100).toBe('number');
      expect(typeof result50).toBe('number');
      expect(result100).toBeGreaterThanOrEqual(0);
      expect(result50).toBeGreaterThanOrEqual(0);
    });

    it('should handle zero enhancement rate', () => {
      const result = calculateAdditionalRevenue(mockBaseDevice, mockTargetDevice, 50, true, 0);
      
      // With 0% enhancement rate, there should still be some revenue from plain scans
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateMonthlyRevenueBreakdown', () => {
    it('should calculate monthly revenue breakdown correctly', () => {
      const result = calculateMonthlyRevenueBreakdown(mockTargetDevice, 1000, 60, 500, 10000);
      
      // Enhanced scans: 1000 * 0.6 = 600 scans
      // Plain scans: 1000 * 0.4 = 400 scans
      // Enhanced revenue: 600 * 269.5 = 161700 yuan
      // Plain revenue: 400 * 228 = 91200 yuan
      // Contrast savings: 500 * 2.7 = 1350 yuan
      // Additional exam revenue: 10000 yuan
      // Total: 161700 + 91200 + 1350 + 10000 = 264250 yuan
      
      expect(result.enhancedScans.count).toBe(600);
      expect(result.enhancedScans.revenue).toBe(161700);
      expect(result.plainScans.count).toBe(400);
      expect(result.plainScans.revenue).toBe(91200);
      expect(result.contrastSavings).toBe(1350);
      expect(result.additionalExamRevenue).toBe(10000);
      expect(result.totalMonthlyRevenue).toBe(264250);
    });

    it('should handle zero enhancement rate', () => {
      const result = calculateMonthlyRevenueBreakdown(mockTargetDevice, 1000, 0, 0, 0);
      
      // All scans should be plain scans
      expect(result.enhancedScans.count).toBe(0);
      expect(result.plainScans.count).toBe(1000);
      expect(result.plainScans.revenue).toBe(228000); // 1000 * 228
      expect(result.contrastSavings).toBe(0);
      expect(result.additionalExamRevenue).toBe(0);
      expect(result.totalMonthlyRevenue).toBe(228000);
    });

    it('should handle 100% enhancement rate', () => {
      const result = calculateMonthlyRevenueBreakdown(mockTargetDevice, 1000, 100, 1000, 5000);
      
      // All scans should be enhanced scans
      expect(result.enhancedScans.count).toBe(1000);
      expect(result.enhancedScans.revenue).toBe(269500); // 1000 * 269.5
      expect(result.plainScans.count).toBe(0);
      expect(result.plainScans.revenue).toBe(0);
      expect(result.contrastSavings).toBe(2700); // 1000 * 2.7
      expect(result.additionalExamRevenue).toBe(5000);
      expect(result.totalMonthlyRevenue).toBe(277200);
    });
  });

  describe('generateCumulativeRevenueData', () => {
    it('should generate 12-month cumulative revenue data', () => {
      const result = generateCumulativeRevenueData(mockBaseDevice, mockTargetDevice, 50, true, 60);
      
      expect(result.baselineDevice).toHaveLength(12);
      expect(result.targetDevice).toHaveLength(12);
      expect(result.monthlySavings).toHaveLength(12);
      expect(result.cumulativeSavings).toHaveLength(12);
      
      // Each month should have consistent data structure
      result.baselineDevice.forEach(breakdown => {
        expect(breakdown).toHaveProperty('enhancedScans');
        expect(breakdown).toHaveProperty('plainScans');
        expect(breakdown).toHaveProperty('contrastSavings');
        expect(breakdown).toHaveProperty('additionalExamRevenue');
        expect(breakdown).toHaveProperty('totalMonthlyRevenue');
      });
      
      result.targetDevice.forEach(breakdown => {
        expect(breakdown).toHaveProperty('enhancedScans');
        expect(breakdown).toHaveProperty('plainScans');
        expect(breakdown).toHaveProperty('contrastSavings');
        expect(breakdown).toHaveProperty('additionalExamRevenue');
        expect(breakdown).toHaveProperty('totalMonthlyRevenue');
      });
      
      // Cumulative savings should be increasing
      for (let i = 1; i < result.cumulativeSavings.length; i++) {
        expect(result.cumulativeSavings[i]).toBeGreaterThanOrEqual(result.cumulativeSavings[i - 1]);
      }
    });

    it('should handle custom month count', () => {
      const result = generateCumulativeRevenueData(mockBaseDevice, mockTargetDevice, 50, true, 60, 6);
      
      expect(result.baselineDevice).toHaveLength(6);
      expect(result.targetDevice).toHaveLength(6);
      expect(result.monthlySavings).toHaveLength(6);
      expect(result.cumulativeSavings).toHaveLength(6);
    });

    it('should calculate baseline device with no additional benefits', () => {
      const result = generateCumulativeRevenueData(mockBaseDevice, mockTargetDevice, 50, true, 60);
      
      // Baseline device should have no contrast savings or additional exam revenue
      result.baselineDevice.forEach(breakdown => {
        expect(breakdown.contrastSavings).toBe(0);
        expect(breakdown.additionalExamRevenue).toBe(0);
      });
    });

    it('should calculate target device with additional benefits', () => {
      const result = generateCumulativeRevenueData(mockBaseDevice, mockTargetDevice, 50, true, 60);
      
      // Target device should have contrast savings and additional exam revenue
      result.targetDevice.forEach(breakdown => {
        expect(breakdown.contrastSavings).toBeGreaterThanOrEqual(0);
        expect(breakdown.additionalExamRevenue).toBeGreaterThanOrEqual(0);
      });
    });

    it('should handle monthly vs daily input consistently', () => {
      const dailyResult = generateCumulativeRevenueData(mockBaseDevice, mockTargetDevice, 50, true, 60);
      const monthlyResult = generateCumulativeRevenueData(mockBaseDevice, mockTargetDevice, 1200, false, 60);
      
      // Results should be similar (50 daily * 24 days = 1200 monthly)
      expect(Math.abs(dailyResult.monthlySavings[0] - monthlyResult.monthlySavings[0])).toBeLessThan(100);
    });
  });

  describe('generateCumulativeRevenueChartData', () => {
    it('should convert cumulative model to chart data format', () => {
      const cumulativeModel = generateCumulativeRevenueData(mockBaseDevice, mockTargetDevice, 50, true, 60);
      const chartData = generateCumulativeRevenueChartData(cumulativeModel);
      
      expect(chartData).toHaveLength(12);
      
      chartData.forEach((dataPoint, index) => {
        expect(dataPoint.month).toBe(index + 1);
        expect(dataPoint).toHaveProperty('baseDeviceRevenue');
        expect(dataPoint).toHaveProperty('targetDeviceRevenue');
        expect(dataPoint).toHaveProperty('cumulativeBaseline');
        expect(dataPoint).toHaveProperty('cumulativeTarget');
        expect(dataPoint).toHaveProperty('monthlySavings');
        
        // Cumulative values should be increasing
        if (index > 0) {
          expect(dataPoint.cumulativeBaseline).toBeGreaterThanOrEqual(chartData[index - 1].cumulativeBaseline);
          expect(dataPoint.cumulativeTarget).toBeGreaterThanOrEqual(chartData[index - 1].cumulativeTarget);
        }
      });
    });

    it('should calculate cumulative values correctly', () => {
      const cumulativeModel = generateCumulativeRevenueData(mockBaseDevice, mockTargetDevice, 50, true, 60);
      const chartData = generateCumulativeRevenueChartData(cumulativeModel);
      
      // First month cumulative should equal first month revenue
      expect(chartData[0].cumulativeBaseline).toBe(chartData[0].baseDeviceRevenue);
      expect(chartData[0].cumulativeTarget).toBe(chartData[0].targetDeviceRevenue);
      
      // Second month cumulative should equal sum of first two months
      if (chartData.length > 1) {
        const expectedBaseline = chartData[0].baseDeviceRevenue + chartData[1].baseDeviceRevenue;
        const expectedTarget = chartData[0].targetDeviceRevenue + chartData[1].targetDeviceRevenue;
        
        expect(chartData[1].cumulativeBaseline).toBeCloseTo(expectedBaseline, 2);
        expect(chartData[1].cumulativeTarget).toBeCloseTo(expectedTarget, 2);
      }
    });

    it('should maintain consistency with monthly savings', () => {
      const cumulativeModel = generateCumulativeRevenueData(mockBaseDevice, mockTargetDevice, 50, true, 60);
      const chartData = generateCumulativeRevenueChartData(cumulativeModel);
      
      chartData.forEach((dataPoint, index) => {
        const expectedSavings = dataPoint.targetDeviceRevenue - dataPoint.baseDeviceRevenue;
        expect(dataPoint.monthlySavings).toBeCloseTo(expectedSavings, 2);
        expect(dataPoint.monthlySavings).toBe(cumulativeModel.monthlySavings[index]);
      });
    });
  });
});
