import styled from '@emotion/styled';

export const Table = styled.div`
  font-family: 'Faktum', sans-serif;

  * {
    box-sizing: border-box;
  }

  table th {
    padding: 12px;

    font-size: 16px;
    font-weight: 400;
    line-height: 24px;

    color: ${({ theme }) => theme.colors.grey};

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  table td {
    padding: 22px 12px;
    color: ${({ theme }) => theme.colors.black};
    vertical-align: top;

    white-space: nowrap;
  }
`;
