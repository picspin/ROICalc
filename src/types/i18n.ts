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
    parameterComparisonTitle: string;
    additionalExams: string;
    workEfficiencyImprovement: string;
    monthlyExamIncrease: string;
    analysisConclusion: string;
    monthlySavingsHours: string;
    workHours: string;
    minutes: string;
    cases: string;
    potentialRevenue: string;
    benefitsFrom: string;
    timeEfficiencyDetail: string;
    additionalExamsDetail: string;
    costEfficiencyDetail: string;
    contrastSavingsDetail: string;
    researchValue: string;
    worthyInvestment: string;
    cautiousEvaluation: string;
    annualSavings: string;
    smartProtocolBenefit: string;
    references: string;
    contactForMoreInfo: string;
    highResearchValueExplanation: string;
    unclearResearchValueExplanation: string;
    equivalentToSaving: string;
    researchRatings: {
      significant: string;
      high: string;
      unclear: string;
    };
    analysisConclusionContent: {
      contrast: string;
      comparedTo: string;
      monthlyEfficiencyImprovement: string;
      equivalentTo: string;
      workHours: string;
      benefitsFrom: string;
      timeEfficiency: string;
      timeEfficiencyCalculation: string;
      timeSavingsPerPatient: string;
      totalTimeSavings: string;
      additionalExams: string;
      additionalExamsCalculation: string;
      monthlyTimeSavings: string;
      examTime: string;
      additionalExamsCount: string;
      potentialRevenueIncrease: string;
      costEfficiency: string;
      costEfficiencyReference: string;
      contrastSavings: string;
      contrastSavingsValue: string;
      researchValueRating: string;
      researchValueSignificant: string;
      researchValueSmartProtocol: string;
      researchValueCaution: string;
      contactForMoreInfo: string;
      highResearchValueExplanation: string;
      unclearResearchValueExplanation: string;
      conclusion: string;
      worthyInvestment: string;
      cautiousEvaluation: string;
      annualSavings: string;
      smartProtocolBenefit: string;
    };
    charts: {
      radarTitle: string;
      radarSubtitle: string;
      barTitle: string;
      barSubtitle: string;
      monthlySavings: string;
      annualSavings: string;
      roi: string;
      monthlyContrastSavings: string;
      comparisonNote: string;
      economicBenefitDifference: string;
      percentStudyNote: string;
      and: string;
    };
    radarTooltips: {
      clinicalAccuracy: string;
      workEfficiency: string;
      usability: string;
      researchValue: string;
      maintenanceConvenience: string;
      contrastSaving: string;
    };
    parameterComparison: {
      title: string;
      valueComparison: string;
      parameter: string;
      comparison: string;
      yes: string;
      no: string;
    };
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
      points: string;
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
    dataDisclaimer: string;
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
