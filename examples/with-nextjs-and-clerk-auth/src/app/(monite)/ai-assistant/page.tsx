import { Box } from '@mui/material';

import { AIPageContent } from '@/app/(monite)/ai-assistant/content';

export default async function AIAssistantPage() {
  return (
    <Box className="Monite-AiAssistant Monite-PageContainer">
      <AIPageContent />
    </Box>
  );
}
