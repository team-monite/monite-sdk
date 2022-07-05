import styled from '@emotion/styled';

export const Wrapper = styled.div(
  ({ theme }) => `
  width: 496px;
  max-width: 100vw;
  margin: 0px auto;
  padding: 80px 0;

  > * + * {
    margin-block-start: 32px;
  }

  a {
    color: ${theme.colors.blue};
    text-decoration: none;

    &:hover {
      color: ${theme.colors.primaryDarker};
    }
  }
`
);

export const Logo = styled.div`
  text-align: center;

  img {
    display: inline-block;
    width: 120px;
  }
`;

export const Content = styled.div(
  ({ theme }) => `
  background: white;
  border: 1px solid ${theme.colors.lightGrey2};
  border-radius: 8px;
  padding: 47px 46px 47px 46px;

  display: flex;
  flex-direction: column;

  text-align: center;

  > * + * {
    margin-block-start: 24px;
  }

  h2 {
    margin: 0;
    font-size: 32px;
    font-weight: 600;
    line-height: 40px;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;

    button[type='submit'] {
      margin-block-start: 16px;
      width: 100%;
    }
  }
`
);
