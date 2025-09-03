import { create } from 'zustand';
import { 
  getBaseDevice, 
  getDeviceById 
} from '../data/devices';
import { 
  calculateROI,
  generateRadarData
} from '../utils/calculations';
import type { 
  InputData, 
  CalculationResult, 
  ComparisonRadarData, 
  Device 
} from '../types';

interface AppState {
  // Input state
  patientVolume: number;
  volumeType: 'daily' | 'monthly';
  targetDeviceId: string;
  baseDeviceId: string;
  ctDeviceCount: number;
  ctEnhancementRate: number; // New: 0-100 percentage
  
  // Result state
  calculationResult: CalculationResult | null;
  radarData: ComparisonRadarData[];
  
  // UI state
  activeTab: 'input' | 'results';
  isLoading: boolean;
  
  // Actions
  setPatientVolume: (volume: number) => void;
  setVolumeType: (type: 'daily' | 'monthly') => void;
  setTargetDeviceId: (id: string) => void;
  setBaseDeviceId: (id: string) => void;
  setCtDeviceCount: (count: number) => void;
  setCtEnhancementRate: (rate: number) => void;
  calculateResults: () => void;
  setActiveTab: (tab: 'input' | 'results') => void;
}

const useAppStore = create<AppState>((set, get) => ({
  // Default input values
  patientVolume: 50,
  volumeType: 'daily',
  targetDeviceId: 'Bayer-Centargo',
  baseDeviceId: getBaseDevice(),
  ctDeviceCount: 1,
  ctEnhancementRate: 60, // Default 60% enhancement rate
  
  // Default result state
  calculationResult: null,
  radarData: [],
  
  // Default UI state
  activeTab: 'input',
  isLoading: false,
  
  // Actions
  setPatientVolume: (volume) => set({ patientVolume: volume }),
  
  setVolumeType: (type) => set({ volumeType: type }),
  
  setTargetDeviceId: (id) => set({ targetDeviceId: id }),
  
  setBaseDeviceId: (id) => set({ baseDeviceId: id }),
  
  setCtDeviceCount: (count) => set({ ctDeviceCount: count }),
  
  setCtEnhancementRate: (rate) => set({ ctEnhancementRate: Math.max(0, Math.min(100, rate)) }),
  
  calculateResults: () => {
    set({ isLoading: true });
    
    const { patientVolume, volumeType, targetDeviceId, baseDeviceId, ctEnhancementRate } = get();
    const isDaily = volumeType === 'daily';
    
    const targetDevice = getDeviceById(targetDeviceId);
    const baseDevice = getDeviceById(baseDeviceId);
    
    if (!targetDevice || !baseDevice) {
      set({ 
        isLoading: false,
        calculationResult: null,
        radarData: []
      });
      return;
    }
    
    // Calculate results
    const result = calculateROI(
      baseDevice,
      targetDevice,
      patientVolume,
      isDaily,
      ctEnhancementRate
    );
    
    // Generate radar chart data
    const radarData = generateRadarData(baseDevice, targetDevice);
    
    // Update state with results
    set({
      calculationResult: result,
      radarData,
      isLoading: false,
      activeTab: 'results'
    });
  },
  
  setActiveTab: (tab) => set({ activeTab: tab })
}));

export default useAppStore;