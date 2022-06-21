declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      [key: string]: string;
    };
  }
}
