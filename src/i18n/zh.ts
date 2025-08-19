import { Translations } from '../types/i18n';

export const zhTranslations: Translations = {
  nav: {
    parameterSettings: '参数设置',
    resultsAnalysis: '结果分析',
    backToSettings: '返回参数设置',
  },
  
  header: {
    title: 'CT高注增强效益工具表',
    subtitle: '数据可视化分析工具',
    author: '作者: Xiaolei Zhu',
  },
  
  input: {
    title: '参数设置',
    patientVolume: '患者量',
    volumeType: {
      daily: '每日患者量',
      monthly: '每月患者量',
    },
    targetDevice: '目标设备',
    baseDevice: '基准设备',
    ctDeviceCount: 'CT设备数量',
    calculateButton: '计算ROI',
    deviceSelection: {
      target: '选择目标设备',
      base: '选择基准设备',
    },
  },
  
  results: {
    title: '投资回报率分析结果',
    timeEfficiency: '时间效益 (ΔP)',
    costEfficiency: '成本效益 (ΔV)',
    totalMonthlySavings: '月度总节省',
    totalAnnualSavings: '年度总节省',
    roi: '投资回报率',
    contrastSavings: '造影剂节省量',
    performanceComparison: '设备性能对比',
    parameterComparison: '参数对比',
    additionalExams: '可增加检查数量',
    metrics: {
      clinicalAccuracy: '临床精准度',
      workEfficiency: '工作效率',
      usability: '易用性',
      researchValue: '科研附加值',
      maintenanceConvenience: '维护便捷性',
      contrastSaving: '造影剂节省量',
    },
    specifications: {
      consumableChangeTime: '耗材更换时间',
      examTotalTime: '单次检查总耗时',
      informationSupport: '信息化支持',
      smartProtocolSupport: '智能协议支持',
      consumableCost: '单次检查耗材成本',
      purchaseCost: '设备采购成本',
      depreciationRate: '设备10年折旧率',
      injectionTechnology: '注射技术类型',
      tubeType: '管路类型',
      nmpaLevel: 'NMPA等级',
    },
    units: {
      minutes: '分钟',
      yuan: '元',
      tenThousandYuan: '万元',
      percent: '%',
      ml: 'ml',
      exams: '次检查',
    },
    values: {
      yes: '是',
      no: '否',
      pistonType: '活塞式',
      peristalticType: '蠕吸式',
      doubleTube: '双筒',
      tripleTube: '三筒',
    },
  },
  
  footer: {
    copyright: '© 2024 CT高注增强效益工具表. 保留所有权利.',
    version: '版本',
  },
  
  common: {
    loading: '加载中...',
    error: '错误',
    success: '成功',
    cancel: '取消',
    confirm: '确认',
  },
};