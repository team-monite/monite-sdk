'use client';

import { useState } from 'react';

import { AIAssistant } from '@monite/sdk-react';
import { Send } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  createSvgIcon,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const promptExamples = [
  {
    description: 'What is my current DSO (Days sales outstanding)?',
  },
  {
    description: 'List all customers who have overdue payments',
  },
  {
    description: 'Provide an analysis of my current working capital',
  },
  {
    description: 'Generate a list of all my existing customers',
  },
  {
    description: 'Predict my net income in the next 30 days',
  },
  {
    description: 'What is the average time taken to settle payables?',
  },
];

export default function AiAssistantPage() {
  const [replyShown, setReplyShown] = useState(false);

  const onCardClick = () => {
    // Do nothing on click - Alex told not to show fake response
    // setReplyShown(true);
  };

  return (
    <Box className="Monite-PageContainer">
      <AIAssistant />
    </Box>
  );
}
