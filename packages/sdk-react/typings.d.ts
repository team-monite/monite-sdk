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

declare module 'pdfjs-dist/build/pdf.min' {
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  export const version: string;
}
