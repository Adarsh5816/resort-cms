declare module 'react/jsx-runtime';
declare module 'react';
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
