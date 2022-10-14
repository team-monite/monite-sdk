import styled from '@emotion/styled';

export const Prices = styled.div`
  margin-top: 24px;

  font-size: 16px;
  font-weight: 400;
  line-height: 24px;

  > * + * {
    margin-top: 8px;
  }
`;

// TODO how it works? :-)
export const PriceRow = styled.div<{ total?: boolean }>(
  ({ total }) => `
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  ${
    total
      ? `
    font-weight: 600;
  `
      : ''
  }
`
);
