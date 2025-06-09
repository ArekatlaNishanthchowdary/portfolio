declare module 'vite-plugin-static-copy' {
  export interface CopyTarget {
    src: string;
    dest: string;
    rename?: string;
    transform?: (contents: Buffer) => Buffer | string;
  }

  export interface CopyOptions {
    targets: CopyTarget[];
    hook?: string;
    verbose?: boolean;
  }

  export function viteStaticCopy(options: CopyOptions): any;
} 