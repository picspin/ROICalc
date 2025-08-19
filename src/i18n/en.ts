import { Translations } from '../types/i18n';

export const enTranslations: Translations = {
  nav: {
    parameterSettings: 'Parameter Settings',
    resultsAnalysis: 'Results Analysis',
    backToSettings: 'Back to Settings',
  },
  
  header: {
    title: 'CT Contrast Enhancement ROI Calculator',
    subtitle: 'Data Visualization Analysis Tool',
    author: 'Author: Xiaolei Zhu',
  },
  
  input: {
    title: 'Parameter Configuration',
    patientVolume: 'Patient Volume',
    volumeType: {
      daily: 'Daily Patient Volume',
      monthly: 'Monthly Patient Volume',
    },
    targetDevice: 'Target Device',
    baseDevice: 'Baseline Device',
    ctDeviceCount: 'CT Device Count',
    calculateButton: 'Calculate ROI',
    deviceSelection: {
      target: 'Select Target Device',
      base: 'Select Baseline Device',
    },
  },
  
  results: {
    title: 'Return on Investment Analysis Results',
    timeEfficiency: 'Time Efficiency (ΔP)',
    costEfficiency: 'Cost Efficiency (ΔV)',
    totalMonthlySavings: 'Total Monthly Savings',
    totalAnnualSavings: 'Total Annual Savings',
    roi: 'Return on Investment',
    contrastSavings: 'Contrast Agent Savings',
    performanceComparison: 'Device Performance Comparison',
    parameterComparison: 'Parameter Comparison',
    additionalExams: 'Additional Exams Possible',
    metrics: {
      clinicalAccuracy: 'Clinical Accuracy',
      workEfficiency: 'Work Efficiency',
      usability: 'Usability',
      researchValue: 'Research Value',
      maintenanceConvenience: 'Maintenance Convenience',
      contrastSaving: 'Contrast Savings',
    },
    specifications: {
      consumableChangeTime: 'Consumable Change Time',
      examTotalTime: 'Total Exam Time',
      informationSupport: 'Information Support',
      smartProtocolSupport: 'Smart Protocol Support',
      consumableCost: 'Consumable Cost per Exam',
      purchaseCost: 'Device Purchase Cost',
      depreciationRate: '10-Year Depreciation Rate',
      injectionTechnology: 'Injection Technology',
      tubeType: 'Tube Type',
      nmpaLevel: 'NMPA Level',
    },
    units: {
      minutes: 'minutes',
      yuan: 'CNY',
      tenThousandYuan: '10K CNY',
      percent: '%',
      ml: 'ml',
      exams: 'exams',
    },
    values: {
      yes: 'Yes',
      no: 'No',
      pistonType: 'Piston Type',
      peristalticType: 'Peristaltic Type',
      doubleTube: 'Double Tube',
      tripleTube: 'Triple Tube',
    },
  },
  
  footer: {
    copyright: '© 2024 CT Contrast Enhancement ROI Calculator. All rights reserved.',
    version: 'Version',
  },
  
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
  },
};