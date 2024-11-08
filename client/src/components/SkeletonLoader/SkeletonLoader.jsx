// SkeletonLoader.js
import React from 'react';

const SkeletonLoader = ({ width, height }) => {
  return (
    <div
      className="bg-gray-300 animate-pulse"
      style={{ width: width || '100%', height: height || '20px' }}
    ></div>
  );
};

export default SkeletonLoader;
