declare module '@emotion/styled' {
  export interface Theme {
    colors: {
      [key: string]: string;
    };
  }

  import { CreateStyled } from '@emotion/styled/types/index';

  export * from '@emotion/styled/types/index';
  const customStyled: CreateStyled<Theme>;
  export default customStyled;
}
