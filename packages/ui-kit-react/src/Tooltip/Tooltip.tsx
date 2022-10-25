import ReactTooltip, { TooltipProps } from 'react-tooltip';
import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';

// TODO: fix types
const StyledTooltip = styled<TooltipProps & any>(ReactTooltip)`
  font-size: 14px !important;
  font-weight: 400;
  line-height: 20px;

  padding: 8px 12px !important;

  width: 240px;

  span {
    text-align: left !important;
    padding: 0 !important;
  }

  a {
    color: #ffffff;
    text-decoration: underline;
  }
`;

const GlobalTooltip = (props: TooltipProps) => {
  const {
    tooltip: { backgroundColor, textColor },
  } = useTheme();

  return (
    <StyledTooltip
      backgroundColor={backgroundColor}
      textColor={textColor}
      effect="solid"
      place="bottom"
      multiline
      clickable
      {...props}
    />
  );
};

export default GlobalTooltip;
