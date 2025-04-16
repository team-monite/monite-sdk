import { useEffect, useRef, useState } from 'react';

export const useFollowLastItem = <T>(item?: T) => {
  const ref = useRef<null | HTMLDivElement>(null);

  const [isCloseToBottom, setIsCloseToBottom] = useState(true);

  useEffect(() => {
    const chatContainer = ref.current;
    const isAutoScroll = chatContainer && isCloseToBottom;

    if (!isAutoScroll || !item) {
      return;
    }

    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [isCloseToBottom, item]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const checkScrollPosition = (chatContainer: HTMLDivElement) => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;

      if (scrollHeight - scrollTop <= clientHeight + 200) {
        setIsCloseToBottom(true);

        return;
      }

      setIsCloseToBottom(false);
    };

    const chatContainer = ref.current;

    chatContainer.addEventListener('scroll', () =>
      checkScrollPosition(chatContainer)
    );

    return () => {
      chatContainer.removeEventListener('scroll', () =>
        checkScrollPosition(chatContainer)
      );
    };
  }, []);

  return ref;
};
