'use client';

import { useEffect, useState } from 'react';
import { usePrevious } from 'react-use';

import { useSearchParams } from 'next/navigation';

import { Alert, CircularProgress, Snackbar, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

export const DemoDataGenerationProgress = () => {
  const displayDemoDataGenerationProgress = useSearchParams().has(
    'display_demo_data_generation_progress'
  );

  const [isDemoDataLogStreamOpen, setIsDemoDataLogStreamOpen] = useState(
    displayDemoDataGenerationProgress
  );

  useEffect(() => {
    if (displayDemoDataGenerationProgress) setIsDemoDataLogStreamOpen(true);
  }, [displayDemoDataGenerationProgress]);

  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isDemoDataLogStreamOpen) return;

    const eventSource = new EventSource('/api/demo-data-generation/log', {
      withCredentials: true,
    });

    eventSource.addEventListener('close', (event) => {
      setMessage('');
      eventSource.close();
    });

    eventSource.addEventListener('message', (event) => {
      queryClient.invalidateQueries();
      setMessage(event.data);
    });

    return () => {
      eventSource.close();
    };
  }, [isDemoDataLogStreamOpen, queryClient]);

  const lastMessage = usePrevious(message);

  if (!isDemoDataLogStreamOpen) return null;

  return (
    <Snackbar open={!!message}>
      <Alert severity="info" icon={<CircularProgress size={22} />}>
        <Typography variant="body2">{message || lastMessage}</Typography>
      </Alert>
    </Snackbar>
  );
};
