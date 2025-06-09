import { useRef, useEffect } from 'react';
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Mesh,
  Program,
  Texture,
} from 'ogl';

import './CircularGallery.css';

interface GalleryItem {
  image: string;
  text: string;
  description?: string;
  technologies?: string[];
  githubUrl?: string;
  liveUrl?: string;
  category?: string;
  issuer?: string;
  date?: string;
  pdf?: string;
}

interface CircularGalleryProps {
  items?: GalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  onItemClick?: (item: GalleryItem) => void;
}

function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  // eslint-disable-next-line @typescript-eslint/no-invalid-this
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: any) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function createTextTexture(gl: WebGLRenderingContext, text: string, font = "bold 30px monospace", color = "black") {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return { texture: new Texture(gl), width: 0, height: 0 };
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(parseInt(font, 10) * 1.2);
  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  gl: WebGLRenderingContext;
  plane: any;
  renderer: any;
  text: string;
  textColor: string;
  font: string;
  mesh: any;
  constructor({ gl, plane, renderer, text, textColor = "#545050", font = "30px sans-serif" }: { gl: WebGLRenderingContext, plane: any, renderer: any, text: string, textColor?: string, font?: string }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }
  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor
    );
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = this.plane.scale.y * 0.15;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.05;
    this.mesh.setParent(this.plane);
  }
}

interface MediaParams {
  geometry: any;
  gl: WebGLRenderingContext;
  image: string;
  index: number;
  length: number;
  renderer: any;
  scene: any;
  screen: { width: number; height: number };
  text: string;
  viewport: { width: number; height: number };
  bend: number;
  textColor: string;
  borderRadius?: number;
  font?: string;
  item: GalleryItem;
}

class Media {
  extra: number;
  geometry: any;
  gl: WebGLRenderingContext;
  image: string;
  index: number;
  length: number;
  renderer: any;
  scene: any;
  screen: { width: number; height: number };
  text: string;
  viewport: { width: number; height: number };
  bend: number;
  textColor: string;
  borderRadius: number;
  font: string;
  program: any;
  plane: any;
  title: any;
  speed: number = 0;
  scale: number = 0;
  width: number = 0;
  widthTotal: number = 0;
  x: number = 0;
  padding: number = 0;
  isBefore: boolean = false;
  isAfter: boolean = false;
  item: GalleryItem;

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
    item
  }: MediaParams) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font || "bold 30px monospace";
    this.item = item;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }
  createShader() {
    const texture = new Texture(this.gl, { 
      generateMipmaps: true,
      minFilter: this.gl.LINEAR_MIPMAP_LINEAR,
      magFilter: this.gl.LINEAR
    });
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 4;
    tempCanvas.height = 4;
    const ctx = tempCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1a202c';
      ctx.fillRect(0, 0, 4, 4);
      texture.image = tempCanvas;
    }
    
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uIsScrolling;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          
          float waveStrength = uIsScrolling > 0.5 ? 0.0 : 0.5;
          float waveSpeed = uIsScrolling > 0.5 ? 0.0 : 0.1;
          
          p.z = (sin(p.x * 4.0 + uTime * waveSpeed) * waveStrength + 
                cos(p.y * 2.0 + uTime * waveSpeed) * waveStrength) * 0.1;
                
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        uniform float uIsScrolling;
        uniform float uIsClickable;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          if(d > 0.0) {
            discard;
          }
          
          gl_FragColor = color;
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
        uIsScrolling: { value: 0.0 },
        uIsClickable: { value: 1.0 }
      },
      transparent: true,
      cullFace: false
    });
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      texture.image = img;
      texture.needsUpdate = true;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
    
    let retries = 0;
    img.onerror = () => {
      if (retries < 3) {
        retries++;
        console.warn(`Failed to load image: ${this.image}, retrying (${retries}/3)...`);
        setTimeout(() => { img.src = this.image; }, 1000);
      }
    };
    
    img.src = this.image;
  }
  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
    
    if (this.plane && this.plane.program) {
      this.plane.program.uniforms.uIsClickable = { value: 1.0 };
    }
  }
  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font
    });
  }
  update(scroll: { current: number; last: number; isScrolling?: boolean }, direction: 'left' | 'right') {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = Math.max((H * H + B_abs * B_abs) / (2 * B_abs), 1);
      const effectiveX = Math.min(Math.abs(x), H * 0.8);

      const arc = Math.max(0, R - Math.sqrt(R * R - effectiveX * effectiveX));
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.min(Math.asin(effectiveX / R), Math.PI / 4);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.min(Math.asin(effectiveX / R), Math.PI / 4);
      }
    }

    this.speed = scroll.current - scroll.last;
    const isScrollingFast = (scroll.isScrolling === true);
    
    if (!isScrollingFast) {
      this.program.uniforms.uTime.value += 0.01;
    }
    
    this.program.uniforms.uSpeed.value = 0;
    if (this.program.uniforms.uIsScrolling) {
      this.program.uniforms.uIsScrolling.value = isScrollingFast ? 1.0 : 0.0;
    }

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.plane.position.x = this.x - scroll.current - this.extra;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.plane.position.x = this.x - scroll.current - this.extra;
      this.isBefore = this.isAfter = false;
    }
  }
  onResize({ screen, viewport }: { screen?: { width: number; height: number }, viewport?: { width: number; height: number } } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

interface AppOptions {
  items?: GalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  onItemClick?: (item: GalleryItem) => void;
}

class App {
  container: HTMLElement;
  scroll: { ease: number; current: number; target: number; last: number; position?: number; isScrolling: boolean; scrollTimeout: ReturnType<typeof setTimeout> | null };
  onCheckDebounce: Function;
  renderer: any;
  gl!: WebGLRenderingContext;
  camera: any;
  scene: any;
  screen: { width: number; height: number };
  viewport: { width: number; height: number };
  planeGeometry: any;
  mediasImages: GalleryItem[];
  medias: Media[];
  isDown: boolean;
  start: number;
  raf: number;
  boundOnResize: any;
  boundOnWheel: any;
  boundOnTouchDown: any;
  boundOnTouchMove: any;
  boundOnTouchUp: any;
  onItemClick?: (item: GalleryItem) => void;

  constructor(container: HTMLElement, { items, bend, textColor = "#ffffff", borderRadius = 0, font = "bold 30px DM Sans", onItemClick }: AppOptions = {}) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.scroll = { 
      ease: 0.06,
      current: 0, 
      target: 0, 
      last: 0,
      isScrolling: false,
      scrollTimeout: null as ReturnType<typeof setTimeout> | null
    };
    this.onCheckDebounce = debounce(this.onCheck, 200);
    this.screen = { width: 0, height: 0 };
    this.viewport = { width: 0, height: 0 };
    this.mediasImages = [];
    this.medias = [];
    this.isDown = false;
    this.start = 0;
    this.raf = 0;
    this.onItemClick = onItemClick;
    
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
    this.container.addEventListener('click', this.handleClick.bind(this));
  }
  createRenderer() {
    this.renderer = new Renderer({ alpha: true });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas as HTMLCanvasElement);
  }
  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }
  createScene() {
    this.scene = new Transform();
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    });
  }
  createMedias(items?: GalleryItem[], bend = 1, textColor?: string, borderRadius?: number, font?: string) {
    const defaultItems = [
      { image: `https://picsum.photos/seed/1/800/600`, text: 'Bridge' },
      { image: `https://picsum.photos/seed/2/800/600`, text: 'Desk Setup' },
      { image: `https://picsum.photos/seed/3/800/600`, text: 'Waterfall' },
      { image: `https://picsum.photos/seed/4/800/600`, text: 'Strawberries' },
      { image: `https://picsum.photos/seed/5/800/600`, text: 'Deep Diving' },
      { image: `https://picsum.photos/seed/16/800/600`, text: 'Train Track' },
      { image: `https://picsum.photos/seed/17/800/600`, text: 'Santorini' },
      { image: `https://picsum.photos/seed/8/800/600`, text: 'Blurry Lights' },
      { image: `https://picsum.photos/seed/9/800/600`, text: 'New York' },
      { image: `https://picsum.photos/seed/10/800/600`, text: 'Good Boy' },
      { image: `https://picsum.photos/seed/21/800/600`, text: 'Coastline' },
      { image: `https://picsum.photos/seed/12/800/600`, text: "Palm Trees" }
    ];
    
    const preloadImages = (sources: string[]): Promise<void[]> => {
      return Promise.all(
        sources.map(
          (src) => 
            new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = src;
            })
        )
      );
    };
    
    const galleryItems = items && items.length ? items : defaultItems;
    
    preloadImages(galleryItems.map(item => item.image));
    
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor: textColor || "#ffffff",
        borderRadius,
        font,
        item: data
      });
    });
  }
  onTouchDown(e: MouseEvent | TouchEvent) {
    if (this.scroll.scrollTimeout) {
      clearTimeout(this.scroll.scrollTimeout);
      this.scroll.scrollTimeout = null;
    }
    this.scroll.isScrolling = true;
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = 'touches' in e ? e.touches[0].clientX : e.clientX;
  }
  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    this.scroll.isScrolling = true;
    if (this.scroll.scrollTimeout) {
      clearTimeout(this.scroll.scrollTimeout);
    }
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * 0.05;
    this.scroll.target = (this.scroll.position || 0) + distance;
  }
  onTouchUp() {
    this.isDown = false;
    if (this.scroll.scrollTimeout) {
      clearTimeout(this.scroll.scrollTimeout);
    }
    this.scroll.scrollTimeout = setTimeout(() => {
      this.scroll.isScrolling = false;
    }, 150);
    this.onCheck();
  }
  onWheel() {
    this.scroll.isScrolling = true;
    if (this.scroll.scrollTimeout) {
      clearTimeout(this.scroll.scrollTimeout);
    }
    this.scroll.scrollTimeout = setTimeout(() => {
      this.scroll.isScrolling = false;
    }, 150);
    this.scroll.target += 2;
    this.onCheckDebounce();
  }
  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }
  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport })
      );
    }
  }
  update() {
    const easeValue = this.scroll.isScrolling ? 0.08 : 0.05;
    const delta = this.scroll.target - this.scroll.current;
    
    if (Math.abs(delta) < 0.001) {
      this.scroll.current = this.scroll.target;
    } else {
      this.scroll.current += delta * easeValue;
    }
    
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    
    if (this.medias) {
      this.medias.forEach((media) => {
        if (media.program && media.program.uniforms.tMap && media.program.uniforms.tMap.value) {
          media.program.uniforms.tMap.value.needsUpdate = true;
        }
        
        media.update(this.scroll, direction);
        
        if (media.program && media.program.uniforms && media.program.uniforms.uIsScrolling) {
          media.program.uniforms.uIsScrolling.value = this.scroll.isScrolling ? 1.0 : 0.0;
        }
      });
    }
    
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }
  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    window.addEventListener('resize', this.boundOnResize);
    window.addEventListener('mousewheel', this.boundOnWheel);
    window.addEventListener('wheel', this.boundOnWheel);
    window.addEventListener('mousedown', this.boundOnTouchDown);
    window.addEventListener('mousemove', this.boundOnTouchMove);
    window.addEventListener('mouseup', this.boundOnTouchUp);
    window.addEventListener('touchstart', this.boundOnTouchDown);
    window.addEventListener('touchmove', this.boundOnTouchMove);
    window.addEventListener('touchend', this.boundOnTouchUp);
  }
  handleClick(e: MouseEvent) {
    if (!this.onItemClick) return;
    
    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert to normalized device coordinates
    const ndcX = (x / this.screen.width) * 2 - 1;
    const ndcY = -((y / this.screen.height) * 2 - 1);
    
    // Find the closest item
    let closestItem: GalleryItem | null = null;
    let minDistance = Infinity;
    
    this.medias.forEach(media => {
      const itemX = media.plane.position.x;
      const distance = Math.abs(itemX - ndcX);
      if (distance < minDistance) {
        minDistance = distance;
        closestItem = media.item;
      }
    });
    
    if (closestItem && minDistance < 0.5) {
      this.onItemClick(closestItem);
    }
  }
  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.boundOnResize);
    window.removeEventListener('mousewheel', this.boundOnWheel);
    window.removeEventListener('wheel', this.boundOnWheel);
    window.removeEventListener('mousedown', this.boundOnTouchDown);
    window.removeEventListener('mousemove', this.boundOnTouchMove);
    window.removeEventListener('mouseup', this.boundOnTouchUp);
    window.removeEventListener('touchstart', this.boundOnTouchDown);
    window.removeEventListener('touchmove', this.boundOnTouchMove);
    window.removeEventListener('touchend', this.boundOnTouchUp);
    this.container.removeEventListener('click', this.handleClick.bind(this));
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = "bold 30px DM Sans",
  onItemClick
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // @ts-ignore
    const app = new App(containerRef.current, { items, bend, textColor, borderRadius, font, onItemClick });
    return () => {
      // @ts-ignore
      app.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, onItemClick]);
  return (
    <div className='circular-gallery' ref={containerRef} />
  );
} 