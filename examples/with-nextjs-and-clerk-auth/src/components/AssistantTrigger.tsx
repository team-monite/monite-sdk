'use client';

import { AIAssistant } from '@monite/sdk-react';
import { useEffect, useState } from 'react';

export const AssistantTrigger = () => {
  const [isDevEnvironment, setIsDevEnvironment] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDevEnvironment(
        window.location.hostname.includes('localhost') ||
          window.location.hostname.includes('dev') ||
          window.location.hostname.includes('sandbox')
      );
    }
  }, []);

  if (!isDevEnvironment) return null;

  return <AIAssistant />;
};
