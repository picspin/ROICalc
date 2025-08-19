import React from 'react';
import { Info } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

const Footer: React.FC = () => {
  const { t } = useI18n();
  
  return (
    <footer className="bg-neutral-50 py-4 mt-8 border-t border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
          <div className="flex items-center space-x-1 mb-2 md:mb-0">
            <Info className="h-4 w-4" />
            <span>{t.footer.dataDisclaimer}</span>
          </div>
          <div>
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;