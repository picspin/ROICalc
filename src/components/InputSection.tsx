import React from 'react';
import { Calculator, ChevronDown } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { useI18n } from '../contexts/I18nContext';
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

  const { t } = useI18n();
  const deviceOptions = getDeviceOptions();
  const targetDevice = getDeviceById(targetDeviceId);
  const baseDevice = getDeviceById(baseDeviceId);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main content: Input form with device images on sides */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 items-center">
        {/* Left Device Image */}
        <div className="w-full md:w-1/4 flex justify-center">
          {targetDevice && (
            <div className="p-4 bg-white rounded-lg shadow-sm transition-all hover:shadow-md">
              <div className="aspect-square flex items-center justify-center overflow-hidden bg-neutral-50 rounded-md p-4">
                <img 
                  src={targetDevice.imageUrl} 
                  alt={`${targetDevice.brand} ${targetDevice.model}`}
                  className="max-h-40 object-contain mix-blend-multiply"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/5769/5769530.png";
                  }}
                />
              </div>
              <p className="text-sm text-center mt-3 text-neutral-600 font-medium">
                {t.input.targetDevice}
              </p>
              <p className="text-xs text-center text-neutral-500">
                {targetDevice.brand} {targetDevice.model}
              </p>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="flex-1 w-full">
          <div className="bg-white rounded-lg shadow-card p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-neutral-800 mb-6 flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-primary-500" />
              {t.input.title}
            </h2>

            <div className="space-y-6">
              {/* Patient Volume Input */}
              <div className="space-y-2">
                <label htmlFor="patientVolume" className="block text-sm font-medium text-neutral-700">
                  {t.input.patientVolume}
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
                      {t.input.volumeType.daily}
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
                      {t.input.volumeType.monthly}
                    </button>
                  </div>
                </div>
              </div>

              {/* CT Device Count Input */}
              <div className="space-y-2">
                <label htmlFor="ctDeviceCount" className="block text-sm font-medium text-neutral-700">
                  {t.input.ctDeviceCount}
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

              {/* Device Selections - Two column layout on larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Target Device Selection */}
                <div className="space-y-2">
                  <label htmlFor="targetDevice" className="block text-sm font-medium text-neutral-700">
                    {t.input.targetDevice}
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
                    {t.input.baseDevice}
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
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateResults}
                className="w-full mt-6 flex items-center justify-center py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md transition shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
              >
{t.input.calculateButton}
              </button>
            </div>
          </div>
        </div>

        {/* Right Device Image */}
        <div className="w-full md:w-1/4 flex justify-center">
          {baseDevice && (
            <div className="p-4 bg-white rounded-lg shadow-sm transition-all hover:shadow-md">
              <div className="aspect-square flex items-center justify-center overflow-hidden bg-neutral-50 rounded-md p-4">
                <img 
                  src={baseDevice.imageUrl} 
                  alt={`${baseDevice.brand} ${baseDevice.model}`}
                  className="max-h-40 object-contain mix-blend-multiply"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/5769/5769530.png";
                  }}
                />
              </div>
              <p className="text-sm text-center mt-3 text-neutral-600 font-medium">
                {t.input.baseDevice}
              </p>
              <p className="text-xs text-center text-neutral-500">
                {baseDevice.brand} {baseDevice.model}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputSection;
