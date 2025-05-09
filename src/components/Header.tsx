import React from 'react';
import useAppStore from '../store/useAppStore';
import Image from './Image';

const Header: React.FC = () => {
  const { setActiveTab } = useAppStore();

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
              CT高注增强效益工具表
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-neutral-600">数据可视化分析工具</span>
          </div>
        </div>
        <div className="mt-2 text-sm text-neutral-500 text-right">
          <span>作者: Xiaolei Zhu | </span>
          <a href="mailto:zxl1412@gmail.com" className="hover:text-primary-600">zxl1412@gmail.com</a>
        </div>
      </div>
    </header>
  );
};

export default Header;