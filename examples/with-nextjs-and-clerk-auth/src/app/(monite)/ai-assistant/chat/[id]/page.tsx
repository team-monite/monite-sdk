import { Box } from '@mui/material';

import { AIChatContent } from '@/app/(monite)/ai-assistant/chat/[id]/content';
import { getConversation } from '@/lib/monite-api/get-conversation';

interface AiAssistantChatPageProps {
  params: {
    id: string;
  };
}

export default async function AiAssistantChatPage({
  params,
}: AiAssistantChatPageProps) {
  const { id } = params;

  const { messages } = (await getConversation(id)) || {};

  return (
    <Box className="Monite-PageContainer Monite-AiAssistant">
      <AIChatContent conversationId={id} messages={messages || []} />
    </Box>
  );
}
