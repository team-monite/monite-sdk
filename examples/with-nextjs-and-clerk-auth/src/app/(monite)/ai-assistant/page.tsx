import { AIPageContent } from '@/app/(monite)/ai-assistant/content';
import { Box } from '@mui/material';

export default async function AIAssistantPage() {
  return (
    <Box className="Monite-AiAssistant Monite-PageContainer">
      <AIPageContent />
    </Box>
  );
}
