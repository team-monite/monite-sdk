import { Box } from '@mui/material';

import { AIPromptsContent } from '@/app/(monite)/ai-assistant/prompts/content';

export default function AiAssistantChatPage() {
  return (
    <Box className="Monite-PageContainer Monite-AiAssistant">
      <AIPromptsContent />
    </Box>
  );
}
