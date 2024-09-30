import { useState, useRef, useCallback, useEffect, MouseEvent } from 'react';

export const useDragScroll = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - (containerRef.current?.offsetLeft || 0);
      const walk = x - startX;
      if (containerRef.current) {
        containerRef.current.scrollLeft = scrollLeft - walk;
      }
    },
    [isDragging, startX, scrollLeft]
  );

  const handleWheel = useCallback((e: WheelEvent) => {
    if (containerRef.current) {
      if (e.deltaMode === 0 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        containerRef.current.scrollLeft += e.deltaX * 2;
      } else {
        e.preventDefault();
      }
    }
  }, []);

  useEffect(() => {
    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('wheel', handleWheel);
      return () => {
        currentRef.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleWheel]);

  return {
    containerRef,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
    isDragging,
  };
};
