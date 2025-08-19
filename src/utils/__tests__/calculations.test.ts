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
  calculateExtraCTExams
} from '../calculations';
import { Device } from '../../types';

// Mock device data for testing
const mockBaseDevice: Device = {
  brand: 'Ulrich',
  model: 'CTMotion',
  category: '高压注射器',
  isBase: true,
  imageUrl: '/test-base.png',
  specs: {
    "耗材更换时间_分钟": 2,
    "单次检查总耗时_分钟": 7,
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
    "耗材更换时间_分钟": 0.33,
    "单次检查总耗时_分钟": 5,
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
      const result = calculateDeltaP(mockBaseDevice, mockTargetDevice, 50, true);
      
      // Expected calculation:
      // Time saved per patient: 7 - 5 = 2 minutes
      // Consumable change saving per patient: (2 - 0.33) / 50 = 0.0334 minutes
      // Total time saved per patient: 2 + 0.0334 = 2.0334 minutes
      // Monthly volume: 50 * 22 = 1100 patients
      // Monthly savings: 2.0334 * 1100 * 2 = 4473.48 yuan
      
      expect(result).toBeCloseTo(4473.48, 1);
    });

    it('should calculate time efficiency savings correctly for monthly input', () => {
      const result = calculateDeltaP(mockBaseDevice, mockTargetDevice, 1100, false);
      
      // Same calculation but monthly volume is used directly
      expect(result).toBeCloseTo(4473.48, 1);
    });

    it('should handle zero time difference', () => {
      const sameTimeDevice = { ...mockTargetDevice };
      sameTimeDevice.specs["单次检查总耗时_分钟"] = 7;
      sameTimeDevice.specs["耗材更换时间_分钟"] = 2;
      
      const result = calculateDeltaP(mockBaseDevice, sameTimeDevice, 50, true);
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
      const result = calculateDeltaV(mockBaseDevice, mockTargetDevice, 50, true, contrastSavings);
      
      // Consumable cost saving per patient: 110 - 100 = 10 yuan
      // Monthly volume: 50 * 22 = 1100
      // Consumable savings: 10 * 1100 = 11000 yuan
      // Contrast savings: 1000 * 2 = 2000 yuan
      // Total: 13000 yuan
      
      expect(result).toBe(13000);
    });

    it('should handle negative consumable cost difference', () => {
      const expensiveTargetDevice = { ...mockTargetDevice };
      expensiveTargetDevice.specs["单次检查耗材成本_元"] = 150;
      
      const result = calculateDeltaV(mockBaseDevice, expensiveTargetDevice, 50, true, 1000);
      
      // Consumable cost difference: 110 - 150 = -40 yuan per patient
      // Monthly: -40 * 1100 = -44000 yuan
      // Plus contrast savings: 2000 yuan
      // Total: -42000 yuan
      
      expect(result).toBe(-42000);
    });
  });

  describe('calculateROI', () => {
    it('should calculate complete ROI analysis', () => {
      const result = calculateROI(mockBaseDevice, mockTargetDevice, 50, true);
      
      expect(result).toHaveProperty('deltaP');
      expect(result).toHaveProperty('deltaV');
      expect(result).toHaveProperty('roi');
      expect(result).toHaveProperty('monthlySavings');
      expect(result).toHaveProperty('annualSavings');
      expect(result).toHaveProperty('contrastSavings');
      
      expect(result.deltaP).toBeGreaterThanOrEqual(0);
      // deltaV can be negative if target device has higher consumable costs
      expect(typeof result.deltaV).toBe('number');
      expect(result.monthlySavings).toBe(result.deltaP + result.deltaV);
      expect(result.annualSavings).toBe(result.monthlySavings * 12);
    });

    it('should handle higher cost target device', () => {
      const expensiveDevice = { ...mockTargetDevice };
      expensiveDevice.specs["设备采购成本_万元"] = 50;
      
      const result = calculateROI(mockBaseDevice, expensiveDevice, 50, true);
      
      // Should still calculate ROI even with higher investment
      expect(result.roi).toBeDefined();
      expect(typeof result.roi).toBe('number');
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
});