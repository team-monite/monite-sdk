declare module '*.module.less' {
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
