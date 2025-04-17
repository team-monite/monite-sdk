import { Box } from '@mui/material';

import { AIPromptsContent } from '@/app/(monite)/ai-assistant/prompts/content';
import { createConversation } from '@/lib/monite-api/create-conversation';

export default async function AiAssistantChatPage() {
  const { id } = (await createConversation()) || {};

  if (!id) return null;

  return (
    <Box className="Monite-PageContainer Monite-AiAssistant">
      <AIPromptsContent conversationId={id} />
    </Box>
  );
}
