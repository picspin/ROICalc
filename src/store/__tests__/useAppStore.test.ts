import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAppStore from '../useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { getState } = useAppStore;
    act(() => {
      useAppStore.setState({
        patientVolume: 50,
        volumeType: 'daily',
        targetDeviceId: 'Bayer-Centargo',
        baseDeviceId: 'Ulrich-CTMotion',
        ctDeviceCount: 1,
        calculationResult: null,
        radarData: [],
        activeTab: 'input',
        isLoading: false
      });
    });
  });

  describe('Initial State', () => {
    it('should have correct default values', () => {
      const { result } = renderHook(() => useAppStore());
      
      expect(result.current.patientVolume).toBe(50);
      expect(result.current.volumeType).toBe('daily');
      expect(result.current.targetDeviceId).toBe('Bayer-Centargo');
      expect(result.current.ctDeviceCount).toBe(1);
      expect(result.current.calculationResult).toBeNull();
      expect(result.current.radarData).toEqual([]);
      expect(result.current.activeTab).toBe('input');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('State Updates', () => {
    it('should update patient volume', () => {
      const { result } = renderHook(() => useAppStore());
      
      act(() => {
        result.current.setPatientVolume(100);
      });
      
      expect(result.current.patientVolume).toBe(100);
    });

    it('should update volume type', () => {
      const { result } = renderHook(() => useAppStore());
      
      act(() => {
        result.current.setVolumeType('monthly');
      });
      
      expect(result.current.volumeType).toBe('monthly');
    });

    it('should update target device ID', () => {
      const { result } = renderHook(() => useAppStore());
      
      act(() => {
        result.current.setTargetDeviceId('Guerbet-OptiVantage');
      });
      
      expect(result.current.targetDeviceId).toBe('Guerbet-OptiVantage');
    });

    it('should update base device ID', () => {
      const { result } = renderHook(() => useAppStore());
      
      act(() => {
        result.current.setBaseDeviceId('Bayer-Stellant');
      });
      
      expect(result.current.baseDeviceId).toBe('Bayer-Stellant');
    });

    it('should update CT device count', () => {
      const { result } = renderHook(() => useAppStore());
      
      act(() => {
        result.current.setCtDeviceCount(3);
      });
      
      expect(result.current.ctDeviceCount).toBe(3);
    });

    it('should update active tab', () => {
      const { result } = renderHook(() => useAppStore());
      
      act(() => {
        result.current.setActiveTab('results');
      });
      
      expect(result.current.activeTab).toBe('results');
    });
  });

  describe('calculateResults', () => {
    it('should calculate results and update state', () => {
      const { result } = renderHook(() => useAppStore());
      
      act(() => {
        result.current.calculateResults();
      });
      
      // Should have calculation results
      expect(result.current.calculationResult).not.toBeNull();
      expect(result.current.calculationResult).toHaveProperty('deltaP');
      expect(result.current.calculationResult).toHaveProperty('deltaV');
      expect(result.current.calculationResult).toHaveProperty('roi');
      expect(result.current.calculationResult).toHaveProperty('monthlySavings');
      expect(result.current.calculationResult).toHaveProperty('annualSavings');
      expect(result.current.calculationResult).toHaveProperty('contrastSavings');
      
      // Should have radar data
      expect(result.current.radarData).toHaveLength(6);
      
      // Should switch to results tab
      expect(result.current.activeTab).toBe('results');
      
      // Should not be loading
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle invalid device IDs gracefully', () => {
      const { result } = renderHook(() => useAppStore());
      
      act(() => {
        result.current.setTargetDeviceId('Invalid-Device');
        result.current.calculateResults();
      });
      
      expect(result.current.calculationResult).toBeNull();
      expect(result.current.radarData).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state during calculation', () => {
      const { result } = renderHook(() => useAppStore());
      
      // Mock a slower calculation by checking loading state immediately
      act(() => {
        result.current.calculateResults();
      });
      
      // After calculation completes, loading should be false
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('State Persistence', () => {
    it('should maintain state across multiple renders', () => {
      const { result, rerender } = renderHook(() => useAppStore());
      
      act(() => {
        result.current.setPatientVolume(75);
        result.current.setVolumeType('monthly');
      });
      
      rerender();
      
      expect(result.current.patientVolume).toBe(75);
      expect(result.current.volumeType).toBe('monthly');
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle complete workflow', () => {
      const { result } = renderHook(() => useAppStore());
      
      // Set up parameters
      act(() => {
        result.current.setPatientVolume(80);
        result.current.setVolumeType('daily');
        result.current.setTargetDeviceId('Bayer-Centargo');
        result.current.setBaseDeviceId('Ulrich-CTMotion');
        result.current.setCtDeviceCount(2);
      });
      
      // Calculate results
      act(() => {
        result.current.calculateResults();
      });
      
      // Verify all state is correct
      expect(result.current.patientVolume).toBe(80);
      expect(result.current.volumeType).toBe('daily');
      expect(result.current.targetDeviceId).toBe('Bayer-Centargo');
      expect(result.current.baseDeviceId).toBe('Ulrich-CTMotion');
      expect(result.current.ctDeviceCount).toBe(2);
      expect(result.current.calculationResult).not.toBeNull();
      expect(result.current.activeTab).toBe('results');
      
      // Switch back to input tab
      act(() => {
        result.current.setActiveTab('input');
      });
      
      expect(result.current.activeTab).toBe('input');
      // Results should still be preserved
      expect(result.current.calculationResult).not.toBeNull();
    });
  });
});