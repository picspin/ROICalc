import React from 'react';
import { Clock, PlusCircle } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { useI18n } from '../contexts/I18nContext';
import { getDeviceById } from '../data/devices';
import { formatCurrency, formatPercent, formatVolume, calculateExtraCTExams } from '../utils/calculations';
import BarChartComponent from './charts/BarChart';
import RadarChartComponent from './charts/RadarChart';
import ParameterComparison from './ParameterComparison';

const ResultsSection: React.FC = () => {
  const { calculationResult, targetDeviceId, baseDeviceId } = useAppStore();
  const { t } = useI18n();
  
  const targetDevice = getDeviceById(targetDeviceId);
  const baseDevice = getDeviceById(baseDeviceId);
  
  if (!calculationResult || !targetDevice || !baseDevice) {
    return null;
  }
  
  const { deltaP, deltaV, roi, monthlySavings, annualSavings, contrastSavings } = calculationResult;
  
  // Determine if investment is worthy based on ROI
  const isWorthyInvestment = roi > 15;

  // Calculate monthly time value saved in hours
  const monthlyTimeSaved = deltaP / 2 / 60; // Convert from Yuan (2 Yuan/min) to hours
  const monthlyWorkingHours = 26 * 10; // 26 days * 10 hours
  const efficiencyImprovement = ((monthlyWorkingHours / (monthlyWorkingHours - monthlyTimeSaved)) - 1) * 100;

  // Calculate extra CT examinations that can be performed with saved time
  const monthlyExtraCT = calculateExtraCTExams(monthlyTimeSaved, targetDevice.specs["单次检查总耗时_分钟"]);
  
  // Calculate potential extra revenue (assuming 250 Yuan per CT exam)
  const ctExamRevenue = 250; // Yuan per exam
  const potentialExtraRevenue = monthlyExtraCT * ctExamRevenue;

  // Calculate contrast agent savings cost
  const contrastSavingsCost = contrastSavings * 2; // 2 Yuan/ml

  // Determine research application value rating
  const determineResearchValue = () => {
    // Check conditions: research added value > 7, is piston type, is triple tube, is NMPA ClassIII, smart protocol support, information support
    const conditions = [
      targetDevice.specs["科研附加值"] > 7,
      targetDevice.specs["注射技术类型"] === "活塞式",
      targetDevice.specs["管路类型"] === "三筒",
      targetDevice.specs["NMPA等级"] === "NMPA ClassIII",
      targetDevice.specs["智能协议支持"],
      targetDevice.specs["信息化支持"]
    ];
    
    // Calculate the number of satisfied conditions
    const satisfiedCount = conditions.filter(Boolean).length;
    
    if (satisfiedCount === 6) {
      return {
        rating: t.results.researchRatings.significant,
        explanation: <>
          <p>1. {t.results.analysisConclusionContent.researchValueSignificant.replace('{targetBrand}', targetDevice.brand).replace('{targetModel}', targetDevice.model)}<sup>4,6</sup></p>
          <p className="mt-2">2. {t.results.analysisConclusionContent.researchValueSmartProtocol}<sup>5</sup></p>
          <p className="mt-2">3. {t.results.analysisConclusionContent.researchValueCaution.replace('{targetBrand}', targetDevice.brand).replace('{targetModel}', targetDevice.model)}<sup>9,10</sup></p>
          <p className="mt-4">{t.results.analysisConclusionContent.contactForMoreInfo.replace('{targetBrand}', targetDevice.brand)} <a href="mailto:xiaolei.zhu@bayer.com" className="text-primary-600 hover:underline">Bayer AS Group</a></p>
        </>
      };
    } else if (satisfiedCount >= 3) {
      return {
        rating: t.results.researchRatings.high,
        explanation: t.results.highResearchValueExplanation
      };
    } else {
      return {
        rating: t.results.researchRatings.unclear,
        explanation: t.results.unclearResearchValueExplanation
      };
    }
  };

  const researchValue = determineResearchValue();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Work efficiency improvement - highlighted */}
        <div className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow border-2 border-primary-300">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-primary-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-base font-medium text-neutral-700">{t.results.workEfficiencyImprovement}</h3>
          </div>
          <p className="text-3xl font-bold text-primary-700">
            {efficiencyImprovement.toFixed(1)}%
          </p>
          <p className="text-sm text-neutral-600 mt-2">
            {t.results.monthlySavingsHours} <span className="font-semibold">{monthlyTimeSaved.toFixed(1)}</span> {t.results.workHours}，{t.results.equivalentToSaving} <span className="font-semibold">{(monthlyTimeSaved * 60).toFixed(0)}</span> {t.results.minutes}
          </p>
        </div>

        {/* Monthly exam increase - highlighted */}
        <div className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow border-2 border-secondary-300">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-secondary-100 p-3 rounded-full">
              <PlusCircle className="h-6 w-6 text-secondary-600" />
            </div>
            <h3 className="text-base font-medium text-neutral-700">{t.results.monthlyExamIncrease}</h3>
          </div>
          <p className="text-3xl font-bold text-secondary-700">
            {Math.round(monthlyExtraCT)} {t.results.cases}
          </p>
          <p className="text-sm text-neutral-600 mt-2">
            {t.results.potentialRevenue} <span className="font-semibold">{formatCurrency(potentialExtraRevenue)}</span>
          </p>
        </div>

        {/* Monthly contrast savings - new metric card */}
        <div className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow border-2 border-tertiary-300">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-tertiary-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-tertiary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-neutral-700">{t.results.contrastSavings}</h3>
          </div>
          <p className="text-3xl font-bold text-tertiary-700">
            {formatVolume(contrastSavings)}
          </p>
          <p className="text-sm text-neutral-600 mt-2">
            {t.results.charts.monthlyContrastSavings}，{t.results.analysisConclusionContent.equivalentTo} <span className="font-semibold">{formatCurrency(contrastSavingsCost)}</span>
          </p>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarChartComponent />
        <RadarChartComponent />
      </div>
      
      {/* Parameters Comparison Table */}
      <ParameterComparison />
      
      {/* Summary and Recommendation */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-lg font-semibold mb-4 text-neutral-800">{t.results.analysisConclusion}</h2>
        <div className="space-y-4 text-neutral-700">
          <p>
            {t.results.analysisConclusionContent.contrast}{t.results.analysisConclusionContent.comparedTo} <a href="https://www.radiologysolutions.bayer.com/medrad-centargo-ct" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">{targetDevice.brand} {targetDevice.model}</a><sup>6</sup> {t.results.analysisConclusionContent.comparedTo} {baseDevice.brand} {baseDevice.model}，
            <span className="font-bold text-primary-700 bg-primary-50 px-2 py-1 rounded">{t.results.analysisConclusionContent.monthlyEfficiencyImprovement} {efficiencyImprovement.toFixed(1)}%，{t.results.analysisConclusionContent.equivalentTo} {monthlyTimeSaved.toFixed(1)} {t.results.analysisConclusionContent.workHours}。</span>
          </p>
          
          <div className="space-y-2">
            <p className="font-medium">{t.results.analysisConclusionContent.benefitsFrom}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">{t.results.analysisConclusionContent.timeEfficiency}</span> {formatCurrency(deltaP)}/月
                <p className="text-sm text-neutral-600 mt-1">
                  根据<a href="https://doi.org/10.2147/mder.s353221" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">PerCenT研究</a><sup>7</sup>，通过优化工作流程和自动化操作，患者检查时间节省40-63%。{t.results.analysisConclusionContent.timeEfficiencyCalculation}
                </p>
                <ul className="list-decimal pl-5 text-sm text-neutral-600 mt-1 space-y-1">
                  <li>{t.results.analysisConclusionContent.timeSavingsPerPatient.replace('{baseExamTime}', baseDevice.specs["单次检查总耗时_分钟"].toString()).replace('{targetExamTime}', targetDevice.specs["单次检查总耗时_分钟"].toString())}</li>
                  <li>{t.results.analysisConclusionContent.totalTimeSavings}</li>
                </ul>
              </li>
              <li>
                <span className="font-medium">{t.results.analysisConclusionContent.additionalExams}</span> {Math.round(monthlyExtraCT)} 例/月
                <p className="text-sm text-neutral-600 mt-1">
                  该设备通过节省时间可以增加检查量，提高CT设备利用率，{t.results.analysisConclusionContent.additionalExamsCalculation}
                </p>
                <ul className="list-decimal pl-5 text-sm text-neutral-600 mt-1 space-y-1">
                  <li>{t.results.analysisConclusionContent.monthlyTimeSavings.replace('{monthlyTimeSavings}', monthlyTimeSaved.toFixed(1)).replace('{monthlyTimeSavingsMinutes}', (monthlyTimeSaved * 60).toFixed(0))}</li>
                  <li>{t.results.analysisConclusionContent.examTime.replace('{examTime}', targetDevice.specs["单次检查总耗时_分钟"].toString())}</li>
                  <li>{t.results.analysisConclusionContent.additionalExamsCount.replace('{additionalExams}', Math.round(monthlyExtraCT).toString())}</li>
                  <li>{t.results.analysisConclusionContent.potentialRevenueIncrease.replace('{potentialRevenue}', formatCurrency(potentialExtraRevenue))}</li>
                </ul>
              </li>
              <li>
                <span className="font-medium">{t.results.analysisConclusionContent.costEfficiency}</span> {formatCurrency(deltaV)}/月，投资回报率为 {formatPercent(roi)}
                <p className="text-sm text-neutral-600 mt-1">
                  {t.results.analysisConclusionContent.costEfficiencyReference}<a href="https://doi.org/10.1109/tbme.2020.3003131" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">CARE研究</a><sup>8</sup>。
                </p>
              </li>
              <li>
                <span className="font-medium">{t.results.analysisConclusionContent.contrastSavings}</span> {formatVolume(contrastSavings)}/月，价值约 {formatCurrency(contrastSavingsCost)}
                <p className="text-sm text-neutral-600 mt-1">
                  {t.results.analysisConclusionContent.contrastSavingsValue.replace('{targetBrand}', targetDevice.brand).replace('{targetModel}', targetDevice.model)}<sup>1,2,3,4</sup>。
                </p>
              </li>
              <li>
                <span className="font-medium">{t.results.analysisConclusionContent.researchValueRating}</span> <span className={`font-medium ${
                  researchValue.rating === t.results.researchRatings.significant ? "text-green-600" : 
                  researchValue.rating === t.results.researchRatings.high ? "text-blue-600" : "text-amber-600"
                }`}>{researchValue.rating}</span>
                <div className="text-sm text-neutral-600 mt-1">
                  {researchValue.explanation}
                </div>
              </li>
            </ul>
          </div>
          
          <p className="mt-4">
            {t.results.analysisConclusionContent.conclusion.replace('{targetBrand}', targetDevice.brand).replace('{targetModel}', targetDevice.model)}
            {isWorthyInvestment 
              ? <span className="text-green-600 font-medium"> {t.results.analysisConclusionContent.worthyInvestment}</span>
              : <span className="text-amber-600 font-medium"> {t.results.analysisConclusionContent.cautiousEvaluation}</span>
            }，
            {t.results.analysisConclusionContent.annualSavings} <span className="font-semibold">{formatCurrency(annualSavings)}</span>。
            {targetDevice.specs["智能协议支持"] && 
              <span className="text-primary-600"> {t.results.analysisConclusionContent.smartProtocolBenefit}</span>
            }
          </p>

          <div className="mt-8 text-sm text-neutral-600 space-y-2">
            <h3 className="font-semibold">{t.results.references}</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Mihl C et al. Evaluation of individually body weight adapted contrast media injection in coronary CT-angiography. Eur J Radiol. 2016;85(4):830-6. doi: <a href="https://doi.org/10.1016/j.ejrad.2015.12.031" target="_blank" rel="noopener noreferrer">10.1016/j.ejrad.2015.12.031</a></li>
              <li>Martens B et al. Individually Body Weight-Adapted Contrast Media Application in Computed Tomography Imaging of the Liver at 90 kVp. Invest Radiol. 2019;54(3):177-182. doi: <a href="https://doi.org/10.1097/rli.0000000000000525" target="_blank" rel="noopener noreferrer">10.1097/rli.0000000000000525</a></li>
              <li>Hendriks BMF .et al. Individually tailored contrast enhancement in CT pulmonary angiography. Br J Radiol. 2016;89(1061):20150850. doi: <a href="https://doi.org/10.1259/bjr.20150850" target="_blank" rel="noopener noreferrer">10.1259/bjr.20150850</a></li>
              <li>Seifarth H et al. Introduction of an individually optimized protocol for the injection of contrast medium for coronary CT angiography. Eur Radiol. 2009;19(10):2373-82. doi: <a href="https://doi.org/10.1007/s00330-009-1421-7" target="_blank" rel="noopener noreferrer">10.1007/s00330-009-1421-7</a></li>
              <li><a href="https://www.radiologysolutions.bayer.com/products/dosing-software/personalized-dosing-software" target="_blank" rel="noopener noreferrer">Smart Protocol个性化剂量方案及P3T双流注射方案</a></li>
              <li><a href="https://www.bayer.com.cn/zh-hans/baieryingxiangzhenduanxiecentargoliangxiangdiqijiejinbohui" target="_blank" rel="noopener noreferrer">国内首个三类证CT高压注射系统Centargo</a></li>
              <li>Kemper, C.A. et al. (2022). Performance of Centargo: A novel Piston based injection System for High Throughput in CE CT. Medical Devices(Auckland, NZ)15, 79. doi: <a href="https://doi.org/10.2147/mder.s353221" target="_blank" rel="noopener noreferrer">10.2147/mder.s353221</a></li>
              <li>Mcdemott MC et al. IEEE Trans Biomed Eng. 2021. doi: <a href="https://doi.org/10.1109/tbme.2020.3003131" target="_blank" rel="noopener noreferrer">10.1109/tbme.2020.3003131</a></li>
              <li>McDermott MC et al. Countering Calcium Blooming With Personalized Contrast Media Injection Protocols: The 1-2-3 Rule for Photon-Counting Detector CCTA. Invest Radiol. 2024 Oct 1;59(10):684-690. doi: <a href="https://doi.org/10.1097/RLI.0000000000001078" target="_blank" rel="noopener noreferrer">10.1097/RLI.0000000000001078</a></li>
              <li>Caruso D et al. Deep learning reconstruction algorithm and high-concentration contrast medium: feasibility of a double-low protocol in coronary computed tomography angiography. Eur Radiol. 2025 Apr;35(4):2213-2221. doi: <a href="https://doi.org/10.1007/s00330-024-11059-x" target="_blank" rel="noopener noreferrer">10.1007/s00330-024-11059-x</a></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
