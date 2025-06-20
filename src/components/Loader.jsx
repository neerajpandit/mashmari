import React, { useEffect, useState } from 'react';

const Loader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-200 p-6">
      <h2 className="text-2xl font-semibold mb-6 text-[#4c0b4d] animate-pulse">Loading... Please wait</h2>

      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-full shadow-lg h-8 relative overflow-hidden">

        <div
          className="h-full bg-[#4c0b4d] rounded-full transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-[#4c0b4d]">
          {progress}%
        </span>
      </div>

      <div className="mt-6 text-sm text-gray-600">Preparing your content...</div>
    </div>
  );
};

export default Loader;
