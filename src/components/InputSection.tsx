import React from 'react';
import { Calculator, ChevronDown } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { getDeviceOptions, getDeviceById } from '../data/devices';

const InputSection: React.FC = () => {
  const {
    patientVolume,
    volumeType,
    targetDeviceId,
    baseDeviceId,
    ctDeviceCount,
    setPatientVolume,
    setVolumeType,
    setTargetDeviceId,
    setBaseDeviceId,
    setCtDeviceCount,
    calculateResults
  } = useAppStore();

  const deviceOptions = getDeviceOptions();
  const targetDevice = getDeviceById(targetDeviceId);
  const baseDevice = getDeviceById(baseDeviceId);

  return (
    <div className="flex gap-6">
      {/* Device Images */}
      <div className="w-1/4 flex flex-col items-center">
        {targetDevice && (
          <div className="mb-4">
            <img 
              src={targetDevice.imageUrl} 
              alt={`${targetDevice.brand} ${targetDevice.model}`}
              className="w-full object-contain"
            />
            <p className="text-sm text-center mt-2 text-neutral-600">
              目标设备
            </p>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow-card p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-primary-500" />
            输入参数
          </h2>

          <div className="space-y-6">
            {/* Patient Volume Input */}
            <div className="space-y-2">
              <label htmlFor="patientVolume" className="block text-sm font-medium text-neutral-700">
                患者增强量
              </label>
              <div className="flex items-center space-x-3">
                <input
                  id="patientVolume"
                  type="number"
                  min="1"
                  value={patientVolume}
                  onChange={(e) => setPatientVolume(Number(e.target.value))}
                  className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-neutral-800 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
                />
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                      volumeType === 'daily'
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                    }`}
                    onClick={() => setVolumeType('daily')}
                  >
                    每日
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                      volumeType === 'monthly'
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                    }`}
                    onClick={() => setVolumeType('monthly')}
                  >
                    每月
                  </button>
                </div>
              </div>
            </div>

            {/* CT Device Count Input */}
            <div className="space-y-2">
              <label htmlFor="ctDeviceCount" className="block text-sm font-medium text-neutral-700">
                CT设备数量
              </label>
              <input
                id="ctDeviceCount"
                type="number"
                min="1"
                value={ctDeviceCount}
                onChange={(e) => setCtDeviceCount(Number(e.target.value))}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-800 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
              />
            </div>

            {/* Target Device Selection */}
            <div className="space-y-2">
              <label htmlFor="targetDevice" className="block text-sm font-medium text-neutral-700">
                目标设备
              </label>
              <div className="relative">
                <select
                  id="targetDevice"
                  value={targetDeviceId}
                  onChange={(e) => setTargetDeviceId(e.target.value)}
                  className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-800 appearance-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
                >
                  {deviceOptions.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
              </div>
            </div>

            {/* Comparison Device Selection */}
            <div className="space-y-2">
              <label htmlFor="baseDevice" className="block text-sm font-medium text-neutral-700">
                对比设备
              </label>
              <div className="relative">
                <select
                  id="baseDevice"
                  value={baseDeviceId}
                  onChange={(e) => setBaseDeviceId(e.target.value)}
                  className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-800 appearance-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
                >
                  {deviceOptions.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateResults}
              className="w-full flex items-center justify-center py-2.5 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md transition shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
            >
              计算 ROI 并对比
            </button>
          </div>
        </div>
      </div>

      {/* Device Images */}
      <div className="w-1/4 flex flex-col items-center">
        {baseDevice && (
          <div className="mb-4">
            <img 
              src={baseDevice.imageUrl} 
              alt={`${baseDevice.brand} ${baseDevice.model}`}
              className="w-full object-contain"
            />
            <p className="text-sm text-center mt-2 text-neutral-600">
              对比设备
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSection;