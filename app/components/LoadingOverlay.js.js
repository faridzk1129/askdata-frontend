import React from "react";

const LoadingOverlay = () => {
  return (
    <div className="w-full h-screen fixed top-0 z-50 left-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm ">
      <span className="text-white text-2xl font-semibold animate-pulse">
        Scanning data
        <span className="animate-[bounce_1s_infinite]">...</span>
      </span>
    </div>
  );
};

export default LoadingOverlay;
