import styled from '@emotion/styled';

export const ColumnList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: flex-start;
    margin-bottom: 4px;

    svg:first-of-type {
      margin-right: 16px;
      margin-top: 2px;
      flex-shrink: 0;
    }
  }
`;
