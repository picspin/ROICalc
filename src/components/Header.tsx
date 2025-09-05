import React from 'react';
import useAppStore from '../store/useAppStore';
import { useI18n } from '../contexts/I18nContext';
import LanguageToggle from './LanguageToggle';

const Header: React.FC = () => {
  const { setActiveTab } = useAppStore();
  const { t } = useI18n();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src="/images/Icon/ct-scan.svg" 
              alt="CT Scan Icon"
              className="h-8 w-8" 
            />
            <button 
              onClick={() => setActiveTab('input')}
              className="text-xl font-semibold text-neutral-800 hover:text-primary-600 transition-colors"
            >
              {t.header.title}
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-neutral-600">{t.header.subtitle}</span>
            <LanguageToggle />
          </div>
        </div>
        <div className="mt-2 text-sm text-neutral-500 text-right">
          <span>{t.header.author} | </span>
          <a href="mailto:zxl1412@gmail.com" className="hover:text-primary-600">zxl1412@gmail.com</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
