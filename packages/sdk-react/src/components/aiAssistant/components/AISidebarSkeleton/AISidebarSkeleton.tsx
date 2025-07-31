import React from 'react';

export const AISidebarSkeleton = () => {
  return (
    <div className="mtw:flex mtw:flex-col mtw:gap-3 mtw:px-7 mtw:animate-pulse">
      <div className="mtw:bg-gray-200 mtw:h-5 mtw:rounded" />

      <div className="mtw:flex mtw:flex-col mtw:gap-2">
        <div className="mtw:bg-gray-200 mtw:h-9 mtw:rounded" />

        <div className="mtw:bg-gray-200 mtw:h-9 mtw:rounded" />

        <div className="mtw:bg-gray-200 mtw:h-9 mtw:rounded" />

        <div className="mtw:bg-gray-200 mtw:h-9 mtw:rounded" />

        <div className="mtw:bg-gray-200 mtw:h-9 mtw:rounded" />

        <div className="mtw:bg-gray-200 mtw:h-9 mtw:rounded" />
      </div>
    </div>
  );
};
