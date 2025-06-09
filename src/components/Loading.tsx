import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LoadingProps {
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ fullScreen = true }) => {
  return (
    <div className={`
      flex items-center justify-center
      ${fullScreen ? 'fixed inset-0 bg-[#0f172a] z-50' : 'w-full h-full'}
    `}>
      <div className="w-96 h-96 md:w-[500px] md:h-[500px]">
        <DotLottieReact
          src="https://lottie.host/385721b7-da9c-402c-b7c3-6fd96a513460/13Gg9iJglm.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
};

export default Loading; 