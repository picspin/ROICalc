import React from 'react';

// 图片导入处理助手
const getImageUrl = (src: string): string => {
  // 处理不同环境下的图片路径
  // 如果图片已经是完整URL或者以http开头，直接返回
  if (src.startsWith('http') || src.startsWith('data:')) {
    return src;
  }
  
  // 确保以/开头的路径
  const path = src.startsWith('/') ? src : `/${src}`;
  
  try {
    // 尝试使用Vite的import.meta.url处理(生产环境)
    return new URL(path, import.meta.url).href;
  } catch (error) {
    // 降级方案：直接返回路径
    return path;
  }
};

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback?: string;
}

const Image: React.FC<ImageProps> = ({ src, fallback = '/images/placeholder.png', ...rest }) => {
  const [imgSrc, setImgSrc] = React.useState<string>(getImageUrl(src));
  const [error, setError] = React.useState<boolean>(false);

  // 图片加载错误时使用fallback
  const handleError = () => {
    if (!error) {
      setImgSrc(getImageUrl(fallback));
      setError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      onError={handleError}
      {...rest}
    />
  );
};

export default Image; 