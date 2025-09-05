/* eslint-disable import/no-default-export */
declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.pdf' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}
