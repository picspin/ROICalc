import React from 'react';
import { Stethoscope } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Stethoscope 
              className="h-8 w-8 text-primary-500" 
            />
            <h1 className="text-xl font-semibold text-neutral-800">放射科高注 ROI 对比</h1>
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