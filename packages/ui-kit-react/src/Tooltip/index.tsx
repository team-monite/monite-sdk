import ReactTooltip, { TooltipProps } from 'react-tooltip';
import React from 'react';
import styled from '@emotion/styled';

import { THEMES } from '..';

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
  return (
    <StyledTooltip
      backgroundColor={THEMES.default.colors.black}
      textColor={THEMES.default.colors.white}
      effect="solid"
      place="bottom"
      multiline
      clickable
      {...props}
    />
  );
};

export default GlobalTooltip;
