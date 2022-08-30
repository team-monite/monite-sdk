import styled from '@emotion/styled';

import SpinnerIcon from './spinner';

interface SpinnerProps {
  pxSize: number;
}

const getPxSize = ({ pxSize = 16 }: SpinnerProps) => pxSize;
const Spinner = styled(SpinnerIcon, {
  shouldForwardProp: (prop) => !['pxSize'].includes(prop as string),
})<SpinnerProps>`
  animation: spinner-spin 1s linear infinite;

  margin: auto;
  width: ${getPxSize}px;
  height: ${getPxSize}px;
  line-height: ${getPxSize}px;

  @keyframes spinner-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Spinner;
