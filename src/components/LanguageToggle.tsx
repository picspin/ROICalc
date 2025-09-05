import React from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage } = useI18n();
  
  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white shadow-sm border border-neutral-200 hover:bg-neutral-50 transition-colors"
      title={language === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <Globe className="h-4 w-4 text-neutral-600" />
      <span className="text-sm font-medium text-neutral-700">
        {language === 'zh' ? 'EN' : '中文'}
      </span>
    </button>
  );
};

export default LanguageToggle;