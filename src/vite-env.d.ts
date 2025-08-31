/// <reference types="vite/client" />

// Declaração para que o TypeScript entenda os imports de módulos SCSS
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}