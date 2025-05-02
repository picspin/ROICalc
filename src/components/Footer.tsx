import React from 'react';
import { Info } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-50 py-4 mt-8 border-t border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
          <div className="flex items-center space-x-1 mb-2 md:mb-0">
            <Info className="h-4 w-4" />
            <span>数据基于 2023 - 2024 年设备参数和市场价格</span>
          </div>
          <div>
            <p>© 放射科高注 ROI 对比工具 | 版本 1.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;