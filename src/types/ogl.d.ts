declare module 'ogl' {
  export class Renderer {
    gl: WebGLRenderingContext;
    constructor(options?: { alpha?: boolean });
    setSize(width: number, height: number): void;
    render(options: { scene: Transform; camera: Camera }): void;
  }

  export class Camera {
    fov: number;
    position: { x: number; y: number; z: number };
    aspect: number;
    constructor(gl: WebGLRenderingContext);
    perspective(options: { aspect: number }): void;
  }

  export class Transform {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
    constructor();
    setParent(parent: Transform): void;
  }

  export class Plane {
    constructor(
      gl: WebGLRenderingContext,
      options?: { 
        widthSegments?: number; 
        heightSegments?: number 
      }
    );
  }

  export class Mesh extends Transform {
    constructor(
      gl: WebGLRenderingContext, 
      options: { 
        geometry: any; 
        program: Program 
      }
    );
  }

  export class Program {
    uniforms: Record<string, { value: any }>;
    constructor(
      gl: WebGLRenderingContext, 
      options: { 
        vertex?: string; 
        fragment?: string; 
        uniforms?: Record<string, { value: any }>; 
        transparent?: boolean;
        depthTest?: boolean;
        depthWrite?: boolean;
        cullFace?: boolean;
      }
    );
  }

  export class Texture {
    image: HTMLImageElement | HTMLCanvasElement | OffscreenCanvas | null;
    needsUpdate: boolean;
    constructor(
      gl: WebGLRenderingContext, 
      options?: { 
        generateMipmaps?: boolean;
        minFilter?: number;
        magFilter?: number;
      }
    );
  }
} 