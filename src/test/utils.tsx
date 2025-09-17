import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Custom render function that can be extended with providers if needed
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data for testing
export const mockDeviceSpecs = {
  "耗材更换时间_分钟": 1,
  "单次检查总耗时_分钟": 6,
  "信息化支持": true,
  "智能协议支持": true,
  "单次检查耗材成本_元": 105,
  "设备采购成本_万元": 30,
  "设备10年折旧率": 9,
  "临床精准度": 8,
  "科研附加值": 8,
  "工作效率": 7.5,
  "易用性": 7.5,
  "维护便捷性": 7.5,
  "造影剂节省量": 8,
  "注射技术类型": "活塞式" as const,
  "管路类型": "三筒" as const,
  "NMPA等级": "NMPA ClassIII" as const
};

export const createMockDevice = (overrides = {}) => ({
  brand: 'Test',
  model: 'Device',
  category: '高压注射器',
  isBase: false,
  imageUrl: '/test.png',
  specs: { ...mockDeviceSpecs, ...overrides }
});

// Helper to wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));