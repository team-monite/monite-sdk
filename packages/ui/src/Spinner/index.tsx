import styled from 'styled-components';

import { ReactComponent as SpinnerIcon } from './spinner.svg';

interface SpinnerProps {
  pxSize: number;
}

const getPxSize = ({ pxSize = 16 }: SpinnerProps) => pxSize;
const Spinner = styled(SpinnerIcon).withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) =>
    !['pxSize'].includes(prop as string) && defaultValidatorFn(prop),
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
