import React from 'react';

// 图片导入处理助手
const getImageUrl = (src: string): string => {
  // 如果图片已经是完整URL或者以http开头，直接返回
  if (src.startsWith('http') || src.startsWith('data:')) {
    return src;
  }
  
  // 确保首个字符是/
  const path = src.startsWith('/') ? src : `/${src}`;
  
  // 在Vite中，/public目录下的资源可直接通过根路径访问
  return path;
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