import { useEffect, useState } from 'react';

export const useIsTextTruncated = (
  element: HTMLElement | null,
  text: string
): boolean => {
  const [isTextTruncated, setIsTextTruncated] = useState(false);

  useEffect(() => {
    if (element) {
      setIsTextTruncated(element.scrollWidth > element.clientWidth);
    }
  }, [element, text]);

  return isTextTruncated;
};
