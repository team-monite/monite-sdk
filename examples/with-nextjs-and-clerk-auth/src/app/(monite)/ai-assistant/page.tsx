import { Box } from '@mui/material';

import { AIStartPageContent } from '@/app/(monite)/ai-assistant/content';
import { createConversation } from '@/lib/monite-api/create-conversation';

export default async function AIAssistantPage() {
  const { id } = (await createConversation()) || {};

  if (!id) return null;

  return (
    <Box className="Monite-AiAssistant Monite-PageContainer">
      <AIStartPageContent conversationId={id} />
    </Box>
  );
}
