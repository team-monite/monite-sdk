import { Chart, Conversation, Conversations, Part } from '../types';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { format } from 'date-fns';
import isThisMonth from 'date-fns/isThisMonth';

export const createConversationGroups = (
  conversations: Conversation[],
  i18: I18n
) => {
  const conversationObject =
    conversations.reduce<Conversations>((groups, conversation) => {
      const { created_at: createdAt } = conversation;

      // eslint-disable-next-line lingui/no-unlocalized-strings
      const monthYear = format(new Date(createdAt), 'MMMM yyyy');
      const thisMonth = isThisMonth(new Date(createdAt));

      const key = thisMonth ? t(i18)`This month` : monthYear;

      if (groups[key]) {
        return {
          ...groups,
          [key]: [...groups[key], conversation],
        };
      }

      return {
        ...groups,
        [key]: [conversation],
      };
    }, {}) || {};

  return (
    Object.entries(conversationObject).map(([key, value]) => ({
      title: key,
      conversations: value,
    })) || []
  );
};

export const setCursorAtTheEnd = (element: HTMLElement) => {
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(element);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);

  element.focus();
};

export const removeTags = (str: string) => {
  if (!str) {
    return '';
  }

  return str.replace(/(<([^>]+)>)/gi, ' ');
};

export const splitByTags = (text: string) => {
  const regex = /<([a-zA-Z0-9_-]+)>([\s\S]*?)<\/\1>/g;
  const result: Part[] = [];

  let lastIndex = 0;
  let match;
  let id = 1;

  while ((match = regex.exec(text)) !== null) {
    const [_, tagName, tagContent] = match;
    const matchStart = match.index;
    const matchEnd = regex.lastIndex;

    if (matchStart > lastIndex) {
      const textBefore = text.slice(lastIndex, matchStart).trim();

      if (textBefore) {
        result.push({ type: 'text', content: textBefore, id });
        id = id + 1;
      }
    }

    let parsedContent: string | Chart = tagContent;

    try {
      parsedContent = JSON.parse(tagContent);
    } catch (_) {
      // continue regardless error
    }

    if (tagName === 'chart') {
      result.push({
        type: tagName,
        content: parsedContent as Chart,
        id,
      });
    }

    id = id + 1;
    lastIndex = matchEnd;
  }

  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex).trim();

    if (remainingText) {
      result.push({ type: 'text', content: remainingText, id });
    }
  }

  return result;
};

interface GetChatTotalHeightParams {
  isSubmitted: boolean;
  height: number;
  isError: boolean;
  isMobile: boolean;
}

export const getChatTotalHeight = ({
  isSubmitted,
  height,
  isError,
  isMobile,
}: GetChatTotalHeightParams) => {
  if (isSubmitted) {
    return `${height + 30}px`;
  }

  if (isError) {
    return isMobile ? `${height + 140}px` : `${height + 120}px`;
  }

  return `${height}px`;
};

export const fixMarkdownListIndentation = (text: string) => {
  return text.replace(/(^|\n)( {3})- /g, '$1    - ');
};

export const sanitizeEntityName = (str: string) =>
  str.replace(/[^\p{L}\p{N}\s]/gu, '').trim();
