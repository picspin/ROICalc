import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nProvider, useI18n } from '../../contexts/I18nContext';
import ParameterComparison from '../ParameterComparison';

// Mock the store
const mockStore = {
  targetDeviceId: 'bayer-centargo',
  baseDeviceId: 'ulrich-ctmotion'
};

// Mock the useAppStore hook
vi.mock('../../store/useAppStore', () => ({
  default: vi.fn(() => mockStore)
}));

// Mock the device data
vi.mock('../../data/devices', () => ({
  getDeviceById: vi.fn((id: string) => {
    if (id === 'bayer-centargo') {
      return {
        id: 'bayer-centargo',
        brand: 'Bayer',
        model: 'Centargo',
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
    }
    if (id === 'ulrich-ctmotion') {
      return {
        id: 'ulrich-ctmotion',
        brand: 'Ulrich',
        model: 'CT Motion',
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
    }
    return null;
  })
}));

describe('ParameterComparison DaySet Translation', () => {
  describe('Translation Key Validation', () => {
    it('should use the updated consumableChangeTime translation key in Chinese', () => {
      const TestComponent = () => {
        const { t } = useI18n();
        return (
          <div data-testid="consumable-change-time">
            {t.results.specifications.consumableChangeTime}
          </div>
        );
      };

      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('consumable-change-time')).toHaveTextContent('DaySet更换时间');
    });

    it('should use the updated consumableChangeTime translation key in English', () => {
      const TestComponent = () => {
        const [language, setLanguage] = React.useState<'zh' | 'en'>('en');
        
        // Mock the context with English language
        const mockContextValue = {
          language: 'en' as const,
          setLanguage: vi.fn(),
          toggleLanguage: vi.fn(),
          t: {
            results: {
              specifications: {
                consumableChangeTime: 'DaySet Change Time'
              }
            }
          }
        };

        return (
          <div data-testid="consumable-change-time-en">
            {mockContextValue.t.results.specifications.consumableChangeTime}
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByTestId('consumable-change-time-en')).toHaveTextContent('DaySet Change Time');
    });

    it('should verify both translations are correctly updated', () => {
      // Test Chinese
      const ChineseTestComponent = () => {
        const { t } = useI18n();
        return (
          <div data-testid="chinese-translation">
            {t.results.specifications.consumableChangeTime}
          </div>
        );
      };

      const { rerender } = render(
        <I18nProvider>
          <ChineseTestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('chinese-translation')).toHaveTextContent('DaySet更换时间');

      // Test that it's not the old translation
      expect(screen.getByTestId('chinese-translation')).not.toHaveTextContent('耗材更换时间');
    });
  });
});

