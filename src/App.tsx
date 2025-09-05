import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import useAppStore from './store/useAppStore';
import { useI18n } from './contexts/I18nContext';
import { ArrowLeft, Settings, PieChart } from 'lucide-react';

function App() {
  const { activeTab, setActiveTab } = useAppStore();
  const { t } = useI18n();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 relative" >
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 -z-10 pointer-events-none bg-blend-soft-light opacity-5"
        style={{
          backgroundImage: `url(${
            activeTab === 'input' 
              ? 'https://radiology.bayer.com.au/sites/g/files/vrxlpx51191/files/2023-08/Experience%20MEDRAD%C2%AE%E2%80%AF%20Centargo%E2%80%99s%20Design.png'
              : 'https://www.radiologysolutions.bayer.com/sites/g/files/vrxlpx50981/files/2024-10/PP-M-CEN-US-0190-1_Centargo_LandingPage_Image2%20compressed.png'
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          mixBlendMode: 'multiply'
        }}
      />
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-neutral-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('input')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'input'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>{t.nav.parameterSettings}</span>
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'results'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <PieChart className="h-4 w-4" />
                <span>{t.nav.resultsAnalysis}</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Back button (only on results tab) */}
        {activeTab === 'results' && (
          <button
            onClick={() => setActiveTab('input')}
            className="flex items-center text-sm text-neutral-600 hover:text-primary-600 mb-4 transition"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
{t.nav.backToSettings}
          </button>
        )}
        
        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'input' ? (
            <div className="w-full mx-auto">
              <InputSection />
            </div>
          ) : (
            <ResultsSection />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;