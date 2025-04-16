import React, { type FC, type PropsWithChildren } from 'react';

import { AssistantLogo } from '@/components/aiAssistant/components/AssistantLogo/AssistantLogo';

export const AssistantMessageWrapper: FC<PropsWithChildren> = ({
  children,
}) => (
  <>
    <div className="mtw:shrink-0 mtw:-mt-0.5">
      <AssistantLogo sx={{ fontSize: 20 }} />
    </div>

    {children}
  </>
);
