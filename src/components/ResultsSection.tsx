import React from 'react';
import { ArrowDown, ArrowUp, Clock, DollarSign, PercentSquare, Droplets, BookOpen } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { getDeviceById } from '../data/devices';
import { formatCurrency, formatPercent, formatVolume } from '../utils/calculations';
import BarChartComponent from './charts/BarChart';
import RadarChartComponent from './charts/RadarChart';
import ParameterComparison from './ParameterComparison';

const ResultsSection: React.FC = () => {
  const { calculationResult, targetDeviceId, baseDeviceId } = useAppStore();
  
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

  // Calculate contrast agent savings cost
  const contrastSavingsCost = contrastSavings * 2; // 2 Yuan/ml

  // 确定科研应用价值评级
  const determineResearchValue = () => {
    // 检查条件：科研附加值>7，是否活塞式，是否三筒，是否NMPA ClassIII，智能协议支持，信息化支持
    const conditions = [
      targetDevice.specs["科研附加值"] > 7,
      targetDevice.specs["注射技术类型"] === "活塞式",
      targetDevice.specs["管路类型"] === "三筒",
      targetDevice.specs["NMPA等级"] === "NMPA ClassIII",
      targetDevice.specs["智能协议支持"],
      targetDevice.specs["信息化支持"]
    ];
    
    // 计算满足的条件数量
    const satisfiedCount = conditions.filter(Boolean).length;
    
    if (satisfiedCount === 6) {
      return {
        rating: "显著",
        explanation: "1.Centargo作为多通道活塞式高压注射器具备首个医疗器械临床三类证，提供精准稳定和个性化的增强注射方案 2.智能化协议及P3T双流提供更多个性化注射扫描方案，进一步优化图像质量；3. 结合最新的光子计数CT应用，提供更多科研价值。\n\n想要了解更多Centargo临床科研特点，请联系👉Bayer AS Group (xiaolei.zhu@bayer.com），并加以参考文献4,5,6,9,10"
      };
    } else if (satisfiedCount >= 3) {
      return {
        rating: "较高",
        explanation: "该设备具备信息化支持，活塞式和多通道管路特色，可以为精准的临床科研应用提供有力支撑"
      };
    } else {
      return {
        rating: "不明显",
        explanation: "该设备可用于临床，如果开展相关科研需要更多证据以及额外选配一些功能"
      };
    }
  };

  const researchValue = determineResearchValue();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-card p-4 hover:shadow-card-hover transition-shadow">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-primary-100 p-2 rounded-full">
              <Clock className="h-5 w-5 text-primary-600" />
            </div>
            <h3 className="text-sm font-medium text-neutral-600">工作效率提升</h3>
          </div>
          <p className="text-2xl font-bold text-neutral-800">
            {efficiencyImprovement.toFixed(1)}%
          </p>
          <p className="text-sm text-neutral-500 mt-1">
            每月节省 {monthlyTimeSaved.toFixed(1)} 工作小时
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-card p-4 hover:shadow-card-hover transition-shadow">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-[#FFF4ED] p-2 rounded-full">
              <Droplets className="h-5 w-5 text-[#E46C0A]" />
            </div>
            <h3 className="text-sm font-medium text-neutral-600">月造影剂节省<sup>1,2,3,4</sup></h3>
          </div>
          <p className="text-2xl font-bold text-neutral-800">
            {formatVolume(contrastSavings)}
          </p>
          <p className="text-sm text-neutral-500 mt-1">
            价值约 {formatCurrency(contrastSavingsCost)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-card p-4 hover:shadow-card-hover transition-shadow">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-primary-100 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-primary-600" />
            </div>
            <h3 className="text-sm font-medium text-neutral-600">年度节省</h3>
          </div>
          <p className="text-2xl font-bold text-neutral-800">
            {formatCurrency(annualSavings)}
          </p>
          <p className="text-sm text-neutral-500 mt-1">
            相比 {baseDevice.brand} {baseDevice.model}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-card p-4 hover:shadow-card-hover transition-shadow">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-secondary-100 p-2 rounded-full">
              <PercentSquare className="h-5 w-5 text-secondary-600" />
            </div>
            <h3 className="text-sm font-medium text-neutral-600">投资回报率</h3>
          </div>
          <p className="text-2xl font-bold text-neutral-800">
            {formatPercent(roi)}
          </p>
          <div className="flex items-center mt-1 text-sm">
            {isWorthyInvestment ? (
              <>
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">高投资价值</span>
              </>
            ) : (
              <>
                <ArrowDown className="h-4 w-4 text-amber-500 mr-1" />
                <span className="text-amber-600">投资谨慎</span>
              </>
            )}
          </div>
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
        <h2 className="text-lg font-semibold mb-4 text-neutral-800">分析结论</h2>
        <div className="space-y-4 text-neutral-700">
          <p>
            对比分析显示，使用 <a href="https://www.radiologysolutions.bayer.com/medrad-centargo-ct" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">{targetDevice.brand} {targetDevice.model}</a><sup>6</sup> 相比 {baseDevice.brand} {baseDevice.model}，
            <span className="font-bold text-primary-700 bg-primary-50 px-2 py-1 rounded">医院每月可提升工作效率 {efficiencyImprovement.toFixed(1)}%，相当于节省 {monthlyTimeSaved.toFixed(1)} 个工作小时。</span>
          </p>
          
          <div className="space-y-2">
            <p className="font-medium">收益主要来自以下方面：</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">时间效益 (∆P):</span> {formatCurrency(deltaP)}/月
                <p className="text-sm text-neutral-600 mt-1">
                  根据<a href="https://doi.org/10.2147/mder.s353221" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">PerCenT研究</a><sup>7</sup>，通过优化工作流程和自动化操作，患者检查时间节省40-63%。计算方法：
                </p>
                <ul className="list-decimal pl-5 text-sm text-neutral-600 mt-1 space-y-1">
                  <li>每患者时间节省 = 基准设备检查时间 ({baseDevice.specs["单次检查总耗时_分钟"]}分钟) - 目标设备检查时间 ({targetDevice.specs["单次检查总耗时_分钟"]}分钟)</li>
                  <li>总时间节省 = 每患者时间节省 × 月患者量 × 时间成本</li>
                </ul>
              </li>
              <li>
                <span className="font-medium">成本效益 (∆V):</span> {formatCurrency(deltaV)}/月
                <p className="text-sm text-neutral-600 mt-1">
                  通过智能协议和高效耗材管理实现成本优化，包括耗材成本和对比剂节省，参考<a href="https://doi.org/10.1109/tbme.2020.3003131" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">CARE研究</a><sup>8</sup>。计算方法：
                </p>
                <ul className="list-decimal pl-5 text-sm text-neutral-600 mt-1 space-y-1">
                  <li>耗材成本节省 = (基准耗材成本 - 目标设备耗材成本 ) × 月患者量</li>
                  <li>对比剂节省费用 = 对比剂节省量 ({formatVolume(contrastSavings)}) × 对比剂单价</li>
                  <li>月度成本总节省 = 耗材成本节省 + 对比剂节省费用</li>
                </ul>
              </li>
              <li>
                <span className="font-medium">造影剂节省:</span> {formatVolume(contrastSavings)}/月
                <p className="text-sm text-neutral-600 mt-1">
                  在DRG/DIP政策支付模式下，<strong>不应只考虑耗材，而也要考虑对比剂的节省</strong>。{targetDevice.brand} {targetDevice.model}采用多通道管路系统、智能个性化注射方案，实现造影剂用量的精准控制<sup>1,2,3,4</sup>。计算方法：
                </p>
                <ul className="list-decimal pl-5 text-sm text-neutral-600 mt-1 space-y-1">
                  <li>基础用量：每位患者平均使用约为60ml造影剂</li>
                  <li>智能协议支持时可节省20%用量</li>
                  <li>设备效率差异带来额外15%的节省潜力</li>
                  <li>对比剂节省经济价值 = 月度节省量 × 对比剂单价 (约2元/ml)</li>
                </ul>
              </li>
              <li>
                <span className="font-medium">科研应用价值:</span> <span className={`font-medium ${
                  researchValue.rating === "显著" ? "text-green-600" : 
                  researchValue.rating === "较高" ? "text-blue-600" : "text-amber-600"
                }`}>{researchValue.rating}</span>
                <p className="text-sm text-neutral-600 mt-1">
                  {researchValue.explanation}
                </p>
              </li>
            </ul>
          </div>
          
          <p className="mt-4">
            从临床及经济角度考虑，{targetDevice.brand} {targetDevice.model} 
            {isWorthyInvestment 
              ? <span className="text-green-600 font-medium"> 是一项值得的投资</span>
              : <span className="text-amber-600 font-medium"> 需要谨慎评估其投资价值</span>
            }，
            投资回报率为 <span className="font-semibold">{formatPercent(roi)}</span>。
            {targetDevice.specs["智能协议支持"] && 
              <span className="text-primary-600"> 特别是其智能协议可带来高价值的对比剂节省，直接转化为经济效益和患者安全性提升。</span>
            }
          </p>

          <div className="mt-8 text-sm text-neutral-600 space-y-2">
            <h3 className="font-semibold">参考文献：</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Mihl C et al. Evaluation of individually body weight adapted contrast media injection in coronary CT-angiography. Eur J Radiol. 2016;85(4):830-6. doi: <a href="https://doi.org/10.1016/j.ejrad.2015.12.031" target="_blank" rel="noopener noreferrer">10.1016/j.ejrad.2015.12.031</a></li>
              <li>Martens B et al. Individually Body Weight-Adapted Contrast Media Application in Computed Tomography Imaging of the Liver at 90 kVp. Invest Radiol. 2019;54(3):177-182. doi: <a href="https://doi.org/10.1097/rli.0000000000000525" target="_blank" rel="noopener noreferrer">10.1097/rli.0000000000000525</a></li>
              <li>Hendriks BMF et al. Individually tailored contrast enhancement in CT pulmonary angiography. Br J Radiol. 2016;89(1061):20150850. doi: <a href="https://doi.org/10.1259/bjr.20150850" target="_blank" rel="noopener noreferrer">10.1259/bjr.20150850</a></li>
              <li>Seifarth H et al. Introduction of an individually optimized protocol for the injection of contrast medium for coronary CT angiography. Eur Radiol. 2009;19(10):2373-82. doi: <a href="https://doi.org/10.1007/s00330-009-1421-7" target="_blank" rel="noopener noreferrer">10.1007/s00330-009-1421-7</a></li>
              <li><a href="https://www.radiologysolutions.bayer.com/products/dosing-software/personalized-dosing-software" target="_blank" rel="noopener noreferrer">Smart Protocol个性化剂量方案及P3T双流注射方案</a></li>
              <li><a href="https://www.bayer.com.cn/zh-hans/baieryingxiangzhenduanxiecentargoliangxiangdiqijiejinbohui" target="_blank" rel="noopener noreferrer">国内首个三类证CT高压注射系统Centargo</a></li>
              <li>Kemper, C.A. et.al. (2022). Performance of Centargo: A novel Piston based injection System for High Throughput in CE CT. Medical Devices(Auckland, NZ)15, 79. doi: <a href="https://doi.org/10.2147/mder.s353221" target="_blank" rel="noopener noreferrer">10.2147/mder.s353221</a></li>
              <li>Mcdemott MC .et.al. IEEE Trans Biomed Eng. 2021. doi: <a href="https://doi.org/10.1109/tbme.2020.3003131" target="_blank" rel="noopener noreferrer">10.1109/tbme.2020.3003131</a></li>
              <li>McDermott MC, Sartoretti T, Stammen L, Martens B, Jost G, Pietsch H, Gutjahr R, Schmidt B, Flohr TG, Alkadhi H, Wildberger JE. Countering Calcium Blooming With Personalized Contrast Media Injection Protocols: The 1-2-3 Rule for Photon-Counting Detector CCTA. Invest Radiol. 2024 Oct 1;59(10):684-690. doi: <a href="https://doi.org/10.1097/RLI.0000000000001078" target="_blank" rel="noopener noreferrer">10.1097/RLI.0000000000001078</a></li>
              <li>Caruso D, De Santis D, Tremamunno G, Santangeli C, Polidori T, Bona GG, Zerunian M, Del Gaudio A, Pugliese L, Laghi A. Deep learning reconstruction algorithm and high-concentration contrast medium: feasibility of a double-low protocol in coronary computed tomography angiography. Eur Radiol. 2025 Apr;35(4):2213-2221. doi: <a href="https://doi.org/10.1007/s00330-024-11059-x" target="_blank" rel="noopener noreferrer">10.1007/s00330-024-11059-x</a></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;