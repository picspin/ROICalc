export type Language = 'zh' | 'en';

export interface Translations {
  // Navigation
  nav: {
    parameterSettings: string;
    resultsAnalysis: string;
    backToSettings: string;
  };
  
  // Header
  header: {
    title: string;
    subtitle: string;
    author: string;
  };
  
  // Input Section
  input: {
    title: string;
    patientVolume: string;
    volumeType: {
      daily: string;
      monthly: string;
    };
    targetDevice: string;
    baseDevice: string;
    ctDeviceCount: string;
    calculateButton: string;
    deviceSelection: {
      target: string;
      base: string;
    };
  };
  
  // Results Section
  results: {
    title: string;
    timeEfficiency: string;
    costEfficiency: string;
    totalMonthlySavings: string;
    totalAnnualSavings: string;
    roi: string;
    contrastSavings: string;
    performanceComparison: string;
    parameterComparison: string;
    additionalExams: string;
    metrics: {
      clinicalAccuracy: string;
      workEfficiency: string;
      usability: string;
      researchValue: string;
      maintenanceConvenience: string;
      contrastSaving: string;
    };
    specifications: {
      consumableChangeTime: string;
      examTotalTime: string;
      informationSupport: string;
      smartProtocolSupport: string;
      consumableCost: string;
      purchaseCost: string;
      depreciationRate: string;
      injectionTechnology: string;
      tubeType: string;
      nmpaLevel: string;
    };
    units: {
      minutes: string;
      yuan: string;
      tenThousandYuan: string;
      percent: string;
      ml: string;
      exams: string;
    };
    values: {
      yes: string;
      no: string;
      pistonType: string;
      peristalticType: string;
      doubleTube: string;
      tripleTube: string;
    };
  };
  
  // Footer
  footer: {
    copyright: string;
    version: string;
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
  };
}