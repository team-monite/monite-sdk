import type { UseChatOptions } from '@ai-sdk/react';
import type { JSONValue, UIMessage, Message } from '@ai-sdk/ui-utils';

export interface ChartData {
  field_value: number;
  field_name: string;
}

export interface Chart {
  chart_type: 'bar' | 'pie';
  chart_metric: string;
  data_points: ChartData[];
}

export interface TextPart {
  id: number;
  type: 'text';
  content: string;
}

export interface ChartPart {
  id: number;
  type: 'chart';
  content: Chart;
}

export type Part = TextPart | ChartPart;

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  is_starred: boolean;
}

export interface Conversations {
  [title: string]: Conversation[];
}

export interface ConversationHistory extends Conversation {
  messages: AIMessage[];
}

export interface AIMessage {
  id: string;
  created_at: string;
  role: 'system' | 'user' | 'assistant' | 'data';
  content: string;
}

export interface Prompt {
  id: string;
  content: string;
  created_at: string;
}

export type Feedback = 'like' | 'dislike';

export type ChatOptions = UseChatOptions & {
  experimental_prepareRequestBody?: (options: {
    id: string;
    messages: UIMessage[];
    requestData?: JSONValue;
    requestBody?: object;
  }) => unknown;
};

export type AIView = 'start' | 'chat' | 'history';
export type AIChatStatus = 'ready' | 'submitted' | 'streaming' | 'error';
export type SortDirection = 'asc' | 'desc';

export type { Message, UIMessage };
