'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type * as THREE_NS from 'three';

/* ------------------------------------------------------------------ *
 * Hero accent: a WebGL glowing-particle burst (cyan) that stands in
 * for a profile photo, plus a cursor spark trail armed for 10s on
 * hover. Ported from the Claude Design handoff (Home.dc.html).
 * ------------------------------------------------------------------ */

const PERSPECTIVE = 0.15;
const REACH = 2.7;

const CFG = {
  color: '#22d3ee',
  hot: '#ffffff',
  density: 14,
  streak: 8,
  speed: 16,
  size: 4,
  bloom: 9,
  rim: 18,
  haze: 12,
  spin: 5,
  sizePercent: 100,
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const SETTINGS = {
  rays: Math.round(50 + CFG.density * CFG.density * 7),
  perRay: Math.round(1 + CFG.streak * 1.7),
  speed: CFG.speed * 0.05,
  size: 1.2 + CFG.size * 1.4,
  bloom: CFG.bloom * 0.075,
  rim: CFG.rim / 20,
  haze: CFG.haze * 0.075,
  spin: CFG.spin * 0.05,
};

const P_VERT = [
  'attribute float aOffset;',
  'attribute float aSeed;',
  'uniform float uTime;',
  'uniform float uSpeed;',
  'uniform float uRadius;',
  'uniform float uSize;',
  'uniform float uRim;',
  'uniform float uPixelRatio;',
  'varying float vLife;',
  'varying float vBright;',
  'void main() {',
  '  float t = fract(aOffset + uTime * uSpeed * (0.65 + aSeed * 0.7));',
  '  float life = mix(aSeed, 1.0, uRim);',
  '  float r = uRadius * life * (1.0 - pow(1.0 - t, 3.0));',
  '  vec4 mv = modelViewMatrix * vec4(position * r, 1.0);',
  '  gl_Position = projectionMatrix * mv;',
  '  float shrink = 1.0 - t * 0.45;',
  '  gl_PointSize = uSize * shrink * uPixelRatio * (10.0 / max(0.001, -mv.z));',
  '  float birth = smoothstep(0.0, 0.05, t);',
  '  float death = 1.0 - smoothstep(0.82, 1.0, t);',
  '  float flick = 0.5 + 0.5 * sin(uTime * 9.0 + aSeed * 43.0 + aOffset * 61.0);',
  '  vBright = birth * death * flick;',
  '  vLife = t;',
  '}',
].join('\n');

const P_FRAG = [
  'uniform vec3 uColor;',
  'uniform vec3 uHot;',
  'varying float vLife;',
  'varying float vBright;',
  'void main() {',
  '  float d = length(gl_PointCoord - 0.5) * 2.0;',
  '  if (d > 1.0) discard;',
  '  float fall = 1.0 - d;',
  '  float shape = pow(fall, 5.0) + pow(fall, 1.6) * 0.3;',
  '  vec3 col = mix(uHot, uColor, smoothstep(0.0, 0.55, vLife));',
  '  float a = shape * vBright;',
  '  gl_FragColor = vec4(col * a, a);',
  '}',
].join('\n');

const H_VERT = [
  'varying vec2 vUv;',
  'void main() {',
  '  vUv = uv;',
  '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
  '}',
].join('\n');

const H_FRAG = [
  'uniform vec3 uColor;',
  'uniform float uHaze;',
  'varying vec2 vUv;',
  'void main() {',
  '  float d = length(vUv - 0.5) * 2.0;',
  '  if (d > 1.0) discard;',
  '  float haze = pow(1.0 - d, 1.5);',
  '  float a = clamp(haze * uHaze, 0.0, 1.0);',
  '  gl_FragColor = vec4(uColor * a, a);',
  '}',
].join('\n');

const Q_VERT = [
  'varying vec2 vUv;',
  'void main() {',
  '  vUv = uv;',
  '  gl_Position = vec4(position.xy, 0.0, 1.0);',
  '}',
].join('\n');

const BLUR_FRAG = [
  'uniform sampler2D tDiffuse;',
  'uniform vec2 uStep;',
  'varying vec2 vUv;',
  'void main() {',
  '  vec4 sum = texture2D(tDiffuse, vUv) * 0.227027;',
  '  sum += texture2D(tDiffuse, vUv + uStep * 1.3846) * 0.3162162;',
  '  sum += texture2D(tDiffuse, vUv - uStep * 1.3846) * 0.3162162;',
  '  sum += texture2D(tDiffuse, vUv + uStep * 3.2307) * 0.0702702;',
  '  sum += texture2D(tDiffuse, vUv - uStep * 3.2307) * 0.0702702;',
  '  gl_FragColor = sum;',
  '}',
].join('\n');

const COMPOSITE_FRAG = [
  'uniform sampler2D tBase;',
  'uniform sampler2D tNear;',
  'uniform sampler2D tWide;',
  'uniform float uBloom;',
  'varying vec2 vUv;',
  'void main() {',
  '  vec4 base = texture2D(tBase, vUv);',
  '  vec4 glow = texture2D(tNear, vUv) * 0.85 + texture2D(tWide, vUv) * 1.15;',
  '  vec4 col = base + glow * uBloom;',
  '  gl_FragColor = vec4(col.rgb, clamp(col.a, 0.0, 1.0));',
  '}',
].join('\n');

function buildParticleCloud(THREE: typeof THREE_NS, rays: number, perRay: number) {
  const count = rays * perRay;
  const dir = new Float32Array(count * 3);
  const offset = new Float32Array(count);
  const seed = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  let i = 0;
  for (let r = 0; r < rays; r++) {
    const y = 1 - (r / Math.max(1, rays - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * r;
    let dx = Math.cos(theta) * ring + (Math.random() - 0.5) * 0.1;
    let dy = y + (Math.random() - 0.5) * 0.1;
    let dz = Math.sin(theta) * ring + (Math.random() - 0.5) * 0.1;
    const len = Math.hypot(dx, dy, dz) || 1;
    dx /= len;
    dy /= len;
    dz /= len;
    const rayLife = 0.6 + Math.random() * 0.4;
    const phase = Math.random();
    for (let p = 0; p < perRay; p++) {
      dir[i * 3] = dx;
      dir[i * 3 + 1] = dy;
      dir[i * 3 + 2] = dz;
      offset[i] = phase + (p / perRay) * 0.2;
      seed[i] = rayLife;
      i++;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(dir, 3));
  geometry.setAttribute('aOffset', new THREE.BufferAttribute(offset, 1));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  return geometry;
}

class BurstScene {
  private THREE: typeof THREE_NS;
  private container: HTMLElement;
  private scene: THREE_NS.Scene;
  private camera: THREE_NS.PerspectiveCamera;
  private group: THREE_NS.Group;
  private renderer: THREE_NS.WebGLRenderer;
  private dpr: number;
  private material: THREE_NS.ShaderMaterial;
  private geometry: THREE_NS.BufferGeometry;
  private hazeGeometry: THREE_NS.PlaneGeometry;
  private hazeMaterial: THREE_NS.ShaderMaterial;
  private haze: THREE_NS.Mesh;
  private quadScene: THREE_NS.Scene;
  private quadCamera: THREE_NS.Camera;
  private quadGeometry: THREE_NS.PlaneGeometry;
  private blurMaterial: THREE_NS.ShaderMaterial;
  private compositeMaterial: THREE_NS.ShaderMaterial;
  private quad: THREE_NS.Mesh;
  private targets: (THREE_NS.WebGLRenderTarget | null)[] = [null, null, null, null, null];
  private time = 0;
  private spinAngle = 0;
  private width = 0;
  private height = 0;
  private frameId = 0;
  private lastT = 0;
  private disposed = false;
  private animated: boolean;

  constructor(THREE: typeof THREE_NS, container: HTMLElement, animated: boolean) {
    this.THREE = THREE;
    this.container = container;
    this.animated = animated;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 2000);
    this.group = new THREE.Group();

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
    });
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);
    const el = this.renderer.domElement;
    el.style.position = 'absolute';
    el.style.inset = '0';
    el.style.width = '100%';
    el.style.height = '100%';
    container.appendChild(el);

    this.material = new THREE.ShaderMaterial({
      vertexShader: P_VERT,
      fragmentShader: P_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: SETTINGS.speed },
        uRadius: { value: REACH },
        uSize: { value: SETTINGS.size },
        uRim: { value: SETTINGS.rim },
        uPixelRatio: { value: this.dpr },
        uColor: { value: new THREE.Color(CFG.color) },
        uHot: { value: new THREE.Color(CFG.hot) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });

    this.geometry = buildParticleCloud(THREE, SETTINGS.rays, SETTINGS.perRay);
    const points = new THREE.Points(this.geometry, this.material);
    points.frustumCulled = false;
    this.group.add(points);

    this.hazeGeometry = new THREE.PlaneGeometry(1, 1);
    this.hazeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(CFG.color) },
        uHaze: { value: SETTINGS.haze },
      },
      vertexShader: H_VERT,
      fragmentShader: H_FRAG,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });
    this.haze = new THREE.Mesh(this.hazeGeometry, this.hazeMaterial);
    this.haze.scale.setScalar(REACH * 2.6);

    this.scene.add(this.haze);
    this.scene.add(this.group);

    this.quadScene = new THREE.Scene();
    this.quadCamera = new THREE.Camera();
    this.quadGeometry = new THREE.PlaneGeometry(2, 2);

    this.blurMaterial = new THREE.ShaderMaterial({
      vertexShader: Q_VERT,
      fragmentShader: BLUR_FRAG,
      uniforms: { tDiffuse: { value: null }, uStep: { value: new THREE.Vector2() } },
      depthTest: false,
      depthWrite: false,
    });

    this.compositeMaterial = new THREE.ShaderMaterial({
      vertexShader: Q_VERT,
      fragmentShader: COMPOSITE_FRAG,
      uniforms: {
        tBase: { value: null },
        tNear: { value: null },
        tWide: { value: null },
        uBloom: { value: SETTINGS.bloom },
      },
      depthTest: false,
      depthWrite: false,
      transparent: true,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
    });

    this.quad = new THREE.Mesh(this.quadGeometry, this.blurMaterial);
    this.quad.frustumCulled = false;
    this.quadScene.add(this.quad);
  }

  private makeTargets(w: number, h: number) {
    this.disposeTargets();
    const THREE = this.THREE;
    const opts = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
    };
    const scaled = (n: number, by: number) => Math.max(1, Math.floor(n / by));
    this.targets = [
      new THREE.WebGLRenderTarget(w, h, opts),
      new THREE.WebGLRenderTarget(scaled(w, 2), scaled(h, 2), opts),
      new THREE.WebGLRenderTarget(scaled(w, 2), scaled(h, 2), opts),
      new THREE.WebGLRenderTarget(scaled(w, 4), scaled(h, 4), opts),
      new THREE.WebGLRenderTarget(scaled(w, 4), scaled(h, 4), opts),
    ];
  }

  private disposeTargets() {
    this.targets.forEach((rt) => rt && rt.dispose());
    this.targets = [null, null, null, null, null];
  }

  private blurPass(
    source: THREE_NS.Texture,
    target: THREE_NS.WebGLRenderTarget,
    dx: number,
    dy: number
  ) {
    this.blurMaterial.uniforms.tDiffuse.value = source;
    (this.blurMaterial.uniforms.uStep.value as THREE_NS.Vector2).set(
      dx / target.width,
      dy / target.height
    );
    this.quad.material = this.blurMaterial;
    this.renderer.setRenderTarget(target);
    this.renderer.clear();
    this.renderer.render(this.quadScene, this.quadCamera);
  }

  setSize(width: number, height: number) {
    if (this.disposed || width <= 0 || height <= 0) return;
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height, false);
    this.makeTargets(
      Math.max(1, Math.floor(width * this.dpr)),
      Math.max(1, Math.floor(height * this.dpr))
    );
    this.updateCamera();
    if (!this.animated) this.step(0);
  }

  private updateCamera() {
    const w = Math.max(1, this.width);
    const h = Math.max(1, this.height);
    const aspect = w / h;
    const distance = 1 / PERSPECTIVE;
    const sizePct = clamp(CFG.sizePercent, 20, 200);
    const span = 7.4 * (100 / sizePct);
    const visibleHeight = aspect < 1 ? span / aspect : span;
    this.camera.aspect = aspect;
    this.camera.position.set(0, 0, distance);
    this.camera.lookAt(0, 0, 0);
    this.camera.fov = 2 * Math.atan(visibleHeight / 2 / distance) * (180 / Math.PI);
    this.camera.near = Math.max(0.1, distance - 20);
    this.camera.far = distance + 20;
    this.camera.updateProjectionMatrix();
  }

  start() {
    if (!this.animated) {
      this.step(0);
      return;
    }
    this.lastT = performance.now();
    const loop = () => {
      this.frameId = requestAnimationFrame(loop);
      const now = performance.now();
      let dt = (now - this.lastT) / 1000;
      this.lastT = now;
      if (!isFinite(dt) || dt < 0) dt = 0;
      if (dt > 0.05) dt = 0.05;
      this.step(dt);
    };
    loop();
  }

  private step(dt: number) {
    if (this.disposed) return;
    this.time += dt;
    this.spinAngle += SETTINGS.spin * dt;
    this.material.uniforms.uTime.value = this.time;
    this.group.rotation.y = this.spinAngle;
    this.group.rotation.x = Math.sin(this.spinAngle * 0.6) * 0.35;

    const [base, hA, hB, qA, qB] = this.targets;
    if (!base || !hA || !hB || !qA || !qB) {
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.scene, this.camera);
      return;
    }
    this.renderer.setRenderTarget(base);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.blurPass(base.texture, hA, 1, 0);
    this.blurPass(hA.texture, hB, 0, 1);
    this.blurPass(hB.texture, qA, 1, 0);
    this.blurPass(qA.texture, qB, 0, 1);
    const c = this.compositeMaterial.uniforms;
    c.tBase.value = base.texture;
    c.tNear.value = hB.texture;
    c.tWide.value = qB.texture;
    this.quad.material = this.compositeMaterial;
    this.renderer.setRenderTarget(null);
    this.renderer.clear();
    this.renderer.render(this.quadScene, this.quadCamera);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    this.geometry.dispose();
    this.material.dispose();
    this.hazeGeometry.dispose();
    this.hazeMaterial.dispose();
    this.quadGeometry.dispose();
    this.blurMaterial.dispose();
    this.compositeMaterial.dispose();
    this.disposeTargets();
    this.renderer.dispose();
    const el = this.renderer.domElement;
    if (el.parentNode === this.container) this.container.removeChild(el);
  }
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const SPARK_COLORS = ['#22d3ee', '#67e8f9', '#ffffff'];

export function ParticleBurst() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sparkCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // --- WebGL burst -------------------------------------------------
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let scene: BurstScene | null = null;
    let ro: ResizeObserver | null = null;
    let cancelled = false;

    const animated = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    import('three')
      .then((THREE) => {
        if (cancelled) return;
        scene = new BurstScene(THREE, mount, animated);
        scene.setSize(mount.clientWidth, mount.clientHeight);
        scene.start();
        ro = new ResizeObserver(() => {
          if (scene) scene.setSize(mount.clientWidth, mount.clientHeight);
        });
        ro.observe(mount);
      })
      .catch(() => {
        /* three or WebGL unavailable — the hero just renders without the burst. */
      });

    return () => {
      cancelled = true;
      if (ro) ro.disconnect();
      if (scene) scene.dispose();
    };
  }, []);

  // --- Cursor spark trail, armed for 10s when the burst is hovered --
  useEffect(() => {
    const mount = mountRef.current;
    const canvas = sparkCanvasRef.current;
    if (!mount || !canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let sparks: Spark[] = [];
    let active = false;
    let activeSince = 0;
    let raf: number | null = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const spawn = (x: number, y: number) => {
      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.6 + Math.random() * 2.2;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 0.6 + Math.random() * 0.5,
          size: 1.5 + Math.random() * 2.2,
          color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
        });
      }
    };

    const startRect = mount.getBoundingClientRect();
    let lastPos = {
      x: startRect.left + startRect.width / 2,
      y: startRect.top + startRect.height / 2,
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (active && performance.now() - activeSince > 10000) active = false;
      if (active) spawn(lastPos.x, lastPos.y);

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = 'lighter';
      sparks = sparks.filter((p) => {
        p.life += 1 / 60;
        if (p.life >= p.maxLife) return false;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        const t = p.life / p.maxLife;
        ctx.globalAlpha = 1 - t;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - t * 0.4), 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';

      if (sparks.length === 0 && !active && raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    const onEnter = () => {
      active = true;
      activeSince = performance.now();
      if (!raf) loop();
    };
    const onMove = (e: PointerEvent) => {
      lastPos = { x: e.clientX, y: e.clientY };
      if (!active || performance.now() - activeSince > 10000) return;
      spawn(lastPos.x, lastPos.y);
    };

    mount.addEventListener('pointerenter', onEnter);
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      mount.removeEventListener('pointerenter', onEnter);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <>
      <div ref={mountRef} aria-hidden="true" className="relative aspect-square w-full max-w-[540px]" />
      {mounted &&
        createPortal(
          <canvas
            ref={sparkCanvasRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 h-screen w-screen"
            style={{ zIndex: 999999 }}
          />,
          document.body
        )}
    </>
  );
}
