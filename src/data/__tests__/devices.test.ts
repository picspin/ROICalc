import { describe, it, expect } from 'vitest';
import {
  devicesData,
  getDeviceById,
  getBaseDevice,
  getDeviceOptions,
  getBrandModels
} from '../devices';

describe('Device Data Functions', () => {
  describe('devicesData', () => {
    it('should have valid structure', () => {
      expect(devicesData).toHaveProperty('version');
      expect(devicesData).toHaveProperty('lastUpdated');
      expect(devicesData).toHaveProperty('devices');
      expect(typeof devicesData.devices).toBe('object');
    });

    it('should contain expected devices', () => {
      const deviceIds = Object.keys(devicesData.devices);
      
      expect(deviceIds).toContain('Bayer-Centargo');
      expect(deviceIds).toContain('Ulrich-CTMotion');
      expect(deviceIds.length).toBeGreaterThan(0);
    });

    it('should have devices with required properties', () => {
      Object.values(devicesData.devices).forEach(device => {
        expect(device).toHaveProperty('brand');
        expect(device).toHaveProperty('model');
        expect(device).toHaveProperty('category');
        expect(device).toHaveProperty('isBase');
        expect(device).toHaveProperty('imageUrl');
        expect(device).toHaveProperty('specs');
        
        // Check specs structure
        expect(device.specs).toHaveProperty('耗材更换时间_分钟');
        expect(device.specs).toHaveProperty('单次检查总耗时_分钟');
        expect(device.specs).toHaveProperty('设备采购成本_万元');
        expect(device.specs).toHaveProperty('临床精准度');
      });
    });
  });

  describe('getDeviceById', () => {
    it('should return correct device for valid ID', () => {
      const device = getDeviceById('Bayer-Centargo');
      
      expect(device).toBeDefined();
      expect(device?.brand).toBe('Bayer');
      expect(device?.model).toBe('Centargo');
    });

    it('should return undefined for invalid ID', () => {
      const device = getDeviceById('NonExistent-Device');
      expect(device).toBeUndefined();
    });
  });

  describe('getBaseDevice', () => {
    it('should return a valid base device ID', () => {
      const baseDeviceId = getBaseDevice();
      
      expect(typeof baseDeviceId).toBe('string');
      expect(baseDeviceId.length).toBeGreaterThan(0);
      
      const device = getDeviceById(baseDeviceId);
      expect(device).toBeDefined();
      expect(device?.isBase).toBe(true);
    });

    it('should return consistent result', () => {
      const baseDevice1 = getBaseDevice();
      const baseDevice2 = getBaseDevice();
      
      expect(baseDevice1).toBe(baseDevice2);
    });
  });

  describe('getDeviceOptions', () => {
    it('should return array of device options', () => {
      const options = getDeviceOptions();
      
      expect(Array.isArray(options)).toBe(true);
      expect(options.length).toBeGreaterThan(0);
      
      options.forEach(option => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('name');
        expect(typeof option.id).toBe('string');
        expect(typeof option.name).toBe('string');
      });
    });

    it('should include all devices from devicesData', () => {
      const options = getDeviceOptions();
      const deviceIds = Object.keys(devicesData.devices);
      
      expect(options.length).toBe(deviceIds.length);
      
      deviceIds.forEach(id => {
        const option = options.find(opt => opt.id === id);
        expect(option).toBeDefined();
      });
    });

    it('should format names correctly', () => {
      const options = getDeviceOptions();
      const bayerCentargo = options.find(opt => opt.id === 'Bayer-Centargo');
      
      expect(bayerCentargo?.name).toBe('Bayer Centargo');
    });
  });

  describe('getBrandModels', () => {
    it('should group devices by brand', () => {
      const brandModels = getBrandModels();
      
      expect(typeof brandModels).toBe('object');
      expect(Object.keys(brandModels).length).toBeGreaterThan(0);
      
      Object.entries(brandModels).forEach(([brand, models]) => {
        expect(typeof brand).toBe('string');
        expect(Array.isArray(models)).toBe(true);
        expect(models.length).toBeGreaterThan(0);
        
        models.forEach(modelId => {
          const device = getDeviceById(modelId);
          expect(device?.brand).toBe(brand);
        });
      });
    });

    it('should include Bayer brand with multiple models', () => {
      const brandModels = getBrandModels();
      
      expect(brandModels).toHaveProperty('Bayer');
      expect(Array.isArray(brandModels.Bayer)).toBe(true);
      expect(brandModels.Bayer).toContain('Bayer-Centargo');
    });
  });

  describe('Device Specifications Validation', () => {
    it('should have valid numeric ranges for all devices', () => {
      Object.values(devicesData.devices).forEach(device => {
        const specs = device.specs;
        
        // Time values should be positive
        expect(specs["耗材更换时间_分钟"]).toBeGreaterThan(0);
        expect(specs["单次检查总耗时_分钟"]).toBeGreaterThan(0);
        
        // Cost values should be positive
        expect(specs["单次检查耗材成本_元"]).toBeGreaterThan(0);
        expect(specs["设备采购成本_万元"]).toBeGreaterThan(0);
        
        // Rating values should be between 0 and 10
        expect(specs["临床精准度"]).toBeGreaterThanOrEqual(0);
        expect(specs["临床精准度"]).toBeLessThanOrEqual(10);
        expect(specs["工作效率"]).toBeGreaterThanOrEqual(0);
        expect(specs["工作效率"]).toBeLessThanOrEqual(10);
        
        // Depreciation rate should be reasonable
        expect(specs["设备10年折旧率"]).toBeGreaterThan(0);
        expect(specs["设备10年折旧率"]).toBeLessThan(100);
      });
    });

    it('should have valid enum values', () => {
      Object.values(devicesData.devices).forEach(device => {
        const specs = device.specs;
        
        expect(['活塞式', '蠕吸式']).toContain(specs["注射技术类型"]);
        expect(['双筒', '三筒']).toContain(specs["管路类型"]);
        expect(['NMPA ClassII', 'NMPA ClassIII']).toContain(specs["NMPA等级"]);
      });
    });
  });
});