import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const Q = new URLSearchParams(location.search);
let DIR = 1;
let W = innerWidth, H = innerHeight;
const T = 0;
const LOW = innerWidth < 700;

// ---------- palettes ----------
const PALS = {
  1: { name: 'neon', bg: 0x0c0a1c, fog: 0x15112e, wall: '#3a3263', wall2: '#2b2550', floor: '#5a3a35', wood: '#7a4b3a', fabric: '#4b3f8a', fabric2: '#e2577f',
    lamp: 0xffb36b, keyA: 0xff3d8b, keyB: 0x35e0ff, shadow: [0.10, 0.06, 0.22], ink: [0.09, 0.05, 0.16], rim: 0x7fe9ff,
    sky: ['#120c33', '#3b1a5e', '#ff3d8b'], portal: ['#ff3d8b', '#35e0ff', '#ffd27a'], hemiSky: 0x5a4aa8, hemiGround: 0x1a0f22, exposure: 1.05 },
  2: { name: 'gold', bg: 0x2a1220, fog: 0x6b3a3a, wall: '#c98a58', wall2: '#a86a48', floor: '#7a4528', wood: '#9a5a33', fabric: '#3f6f73', fabric2: '#e8b45a',
    lamp: 0xffc070, keyA: 0xffb347, keyB: 0xff6a3d, shadow: [0.28, 0.12, 0.22], ink: [0.22, 0.08, 0.12], rim: 0xffe0a0,
    sky: ['#ffd27a', '#ff8a4c', '#6b2f5e'], portal: ['#ffcf6b', '#ff6a3d', '#fff4d0'], hemiSky: 0xffb27a, hemiGround: 0x4a1e2e, exposure: 0.78 },
  3: { name: 'holo', bg: 0x0a0614, fog: 0x1a0c2c, wall: '#2a1a44', wall2: '#1e1236', floor: '#241634', wood: '#3a2850', fabric: '#6a3cc8', fabric2: '#ffcc4d',
    lamp: 0xb45cff, keyA: 0xb45cff, keyB: 0xffcc4d, shadow: [0.08, 0.04, 0.16], ink: [0.06, 0.02, 0.12], rim: 0xffd76a,
    sky: ['#0a0620', '#3a0f6e', '#b45cff'], portal: ['#b45cff', '#ffcc4d', '#7af3ff'], hemiSky: 0x6a40c0, hemiGround: 0x140a22, exposure: 1.05 },
};
let PAL = PALS[1];

// ---------- rng ----------
let seed = 12345 + DIR * 77;
const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
const rr = (a, b) => a + (b - a) * rnd();

// ---------- renderer ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, LOW ? 1 : 1.25)); renderer.setSize(W, H);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = PAL.exposure;
document.getElementById('stage').appendChild(renderer.domElement);
let scene = new THREE.Scene();
scene.background = new THREE.Color(PAL.bg);
scene.fog = new THREE.FogExp2(PAL.fog, 0.035);
const camera = new THREE.PerspectiveCamera(40, W / H, 0.05, 200);

// ---------- painted textures & toon material ----------
const gradMap = (() => { const d = new Uint8Array([40, 110, 190, 255]); const t = new THREE.DataTexture(d, 4, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const texCache = {};
function paintTex(hex, strokes = 120, size = 256) {
  const k = hex + strokes; if (texCache[k]) return texCache[k];
  const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d');
  const base = new THREE.Color(hex); g.fillStyle = hex; g.fillRect(0, 0, size, size);
  for (let i = 0; i < strokes; i++) {
    const col = base.clone().offsetHSL(rr(-0.02, 0.02), rr(-0.08, 0.08), rr(-0.08, 0.08));
    g.strokeStyle = '#' + col.getHexString(); g.globalAlpha = rr(0.15, 0.45); g.lineWidth = rr(6, 22); g.lineCap = 'round';
    const x = rr(0, size), y = rr(0, size), a = rr(-0.5, 0.5) + (i % 2 ? 0 : Math.PI / 2), L = rr(20, 90);
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * L * .5 + rr(-10, 10), y + Math.sin(a) * L * .5 + rr(-10, 10), x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; texCache[k] = t; return t;
}
const rimCol = new THREE.Color(PAL.rim);
function toon(hex, opt = {}) {
  const { rim: _r, ...rest } = opt; const m = new THREE.MeshToonMaterial({ color: 0xffffff, map: paintTex(hex), gradientMap: gradMap, ...rest });
  m.onBeforeCompile = s => {
    s.uniforms.rimColor = { value: rimCol }; s.uniforms.rimAmt = { value: opt.rim ?? 0.45 };
    s.fragmentShader = 'uniform vec3 rimColor; uniform float rimAmt;\n' + s.fragmentShader.replace('#include <dithering_fragment>',
      'float rimF = 1.0 - clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0);\n gl_FragColor.rgb += rimColor * smoothstep(0.62, 0.7, rimF) * rimAmt;\n#include <dithering_fragment>');
  };
  return m;
}
const glow = (hex, i = 3) => new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(i), toneMapped: false });
function box(w, h, d, mat, x, y, z, r = 0.04, parent = scene) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.1, h / 2.1, d / 2.1)), mat);
  m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m;
}
function cyl(rt, rb, h, mat, x, y, z, seg = 20, parent = scene) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m;
}

// ---------- canvas textures (screens, posters, cards, skyline) ----------
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
const codeTex = (accent) => canvasTex(512, 300, (g, w, h) => {
  g.fillStyle = '#18204a'; g.fillRect(0, 0, w, h);
  const cols = ['#7fe9ff', '#ff6fa8', '#ffd27a', '#9d8cff', '#8af5b0', '#cfc8ff'];
  for (let y = 18; y < h - 8; y += 15) { let x = 18 + Math.floor(rnd() * 4) * 18; const n = 1 + Math.floor(rnd() * 5);
    for (let i = 0; i < n && x < w - 30; i++) { const L = rr(20, 90); g.fillStyle = cols[Math.floor(rnd() * cols.length)]; g.globalAlpha = 0.85; g.fillRect(x, y, L, 7); x += L + 10; } }
  g.globalAlpha = 1; g.fillStyle = accent; g.fillRect(0, 0, w, 10);
});
function skyTex() {
  return canvasTex(1024, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, PAL.sky[0]); gr.addColorStop(.65, PAL.sky[1]); gr.addColorStop(1, PAL.sky[2]);
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    if (DIR === 2) { // low sun
      const s = g.createRadialGradient(w * .62, h * .7, 10, w * .62, h * .7, 260); s.addColorStop(0, '#fff6d8'); s.addColorStop(.25, '#ffd27a'); s.addColorStop(1, 'rgba(255,140,60,0)');
      g.fillStyle = s; g.fillRect(0, 0, w, h);
      g.fillStyle = '#7a3a4a'; for (let i = 0; i < 9; i++) { g.globalAlpha = .5; g.beginPath(); g.ellipse(rr(0, w), rr(h * .2, h * .5), rr(80, 200), rr(8, 20), 0, 0, 7); g.fill(); }
      g.globalAlpha = 1;
    }
    // skyline silhouettes, 3 layers
    for (let L = 0; L < 3; L++) {
      const col = new THREE.Color(PAL.sky[1]).lerp(new THREE.Color(DIR === 2 ? '#4a1e34' : '#06040e'), .45 + L * .25);
      let x = -20;
      while (x < w) {
        const bw = rr(30, 90) * (1 + L * .3), bh = rr(.18, .55) * h * (1 - L * .25) + (DIR === 2 ? -40 : 0);
        g.fillStyle = '#' + col.getHexString(); g.fillRect(x, h - bh, bw, bh);
        if (DIR !== 2) for (let yy = h - bh + 8; yy < h - 6; yy += 12) for (let xx = x + 5; xx < x + bw - 6; xx += 10) if (rnd() < .22 - L * .05) {
          g.fillStyle = rnd() < .6 ? '#ffd9a0' : (rnd() < .5 ? '#' + new THREE.Color(PAL.keyA).getHexString() : '#' + new THREE.Color(PAL.keyB).getHexString()); g.fillRect(xx, yy, 4, 5); }
        x += bw + rr(0, 8);
      }
    }
    if (DIR !== 2) { // neon signs
      for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? '#' + new THREE.Color(PAL.keyA).getHexString() : '#' + new THREE.Color(PAL.keyB).getHexString(); g.shadowColor = g.fillStyle; g.shadowBlur = 18; g.fillRect(rr(0, w), rr(h * .45, h * .85), rr(10, 16), rr(40, 90)); }
      g.shadowBlur = 0;
    }
    if (DIR === 1) { g.strokeStyle = 'rgba(200,220,255,.25)'; g.lineWidth = 1.2; for (let i = 0; i < 420; i++) { const x = rr(0, w), y = rr(0, h); g.beginPath(); g.moveTo(x, y); g.lineTo(x - 6, y + rr(20, 40)); g.stroke(); } }
  });
}
function posterTex(i) {
  return canvasTex(300, 420, (g, w, h) => {
    g.fillStyle = ['#' + new THREE.Color(PAL.keyA).getHexString(), PAL.fabric2, PAL.fabric][i % 3]; g.fillRect(0, 0, w, h);
    g.fillStyle = '#120e1c'; g.beginPath(); g.arc(w / 2, h * .42, w * .3, 0, 7); g.fill();
    g.fillStyle = '#f5efe4'; g.font = '900 54px Impact, sans-serif'; g.fillText(['404', 'DEV', 'MMI'][i % 3], 26, h - 40);
  });
}

// ---------- portal shader ----------
const portalMat = new THREE.ShaderMaterial({ fog: false,
  transparent: true, depthWrite: false, toneMapped: false,
  uniforms: { t: { value: T }, spawn: { value: 1 }, cA: { value: new THREE.Color(PAL.portal[0]) }, cB: { value: new THREE.Color(PAL.portal[1]) }, cC: { value: new THREE.Color(PAL.portal[2]) } },
  vertexShader: 'varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: `varying vec2 vUv; uniform float t, spawn; uniform vec3 cA,cB,cC;
  float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
  void main(){ vec2 p=(vUv-.5)*vec2(1.,2.2); float r=length(p); float a=atan(p.y,p.x);
    float sw = a + 3.5/(r+.15) - t*.8;
    float f = fbm(vec2(cos(sw),sin(sw))*r*3. + vec2(r*4.-t*.5));
    float bands = smoothstep(.45,.75,f);
    vec3 col = mix(cA,cB,smoothstep(.2,.8,fbm(vec2(sw*1.3,r*5.))));
    col = mix(col, cC, bands*.7);
    col += cC*pow(max(0.,1.-r*1.8),4.)*1.2;
    float edge = smoothstep(.0,.08,min(min(vUv.x,1.-vUv.x),min(vUv.y,1.-vUv.y)));
    // apparition : le portail s'ouvre depuis le centre, bord déchiqueté et lumineux
    float en = (fbm(vec2(a*2.5, t*.9))-.5)*.35*spawn; float R = spawn*1.45 + en;
    float m = 1.-smoothstep(R-.06, R, r);
    float rim = (1.-smoothstep(0.,.09,abs(r-R))) * (1.-smoothstep(.8,1.,spawn)) * step(.001,spawn);
    col += mix(cC,vec3(1.),.5)*rim*3.;
    gl_FragColor=vec4(col*1.25, edge*max(m,rim)); }`
});

// ---------- painterly post pass ----------
const Painterly = {
  uniforms: { tDiffuse: { value: null }, res: { value: new THREE.Vector2(W, H) }, shadowTint: { value: new THREE.Vector3(...PAL.shadow) }, ink: { value: new THREE.Vector3(...PAL.ink) } },
  vertexShader: 'varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 res; uniform vec3 shadowTint, ink; varying vec2 vUv;
  float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
  float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
  vec3 S(vec2 uv){return texture2D(tDiffuse,uv).rgb;}
  float L(vec3 c){return dot(c,vec3(.299,.587,.114));}
  void main(){
    vec2 px=1./res;
    // brush displacement
    vec2 uv = vUv + (vec2(n(vUv*res/18.), n(vUv*res/18.+7.))-.5)*px*5.;
    // 4-sector kuwahara
    const int R=3; vec3 m[4]; vec3 s2[4];
    for(int k=0;k<4;k++){m[k]=vec3(0.);s2[k]=vec3(0.);}
    for(int j=0;j<=R;j++)for(int i=0;i<=R;i++){
      vec3 c0=S(uv+vec2(-i,-j)*px); m[0]+=c0; s2[0]+=c0*c0;
      vec3 c1=S(uv+vec2( i,-j)*px); m[1]+=c1; s2[1]+=c1*c1;
      vec3 c2=S(uv+vec2( i, j)*px); m[2]+=c2; s2[2]+=c2*c2;
      vec3 c3=S(uv+vec2(-i, j)*px); m[3]+=c3; s2[3]+=c3*c3; }
    float N=float((R+1)*(R+1)); float best=1e9; vec3 col=vec3(0.);
    for(int k=0;k<4;k++){ vec3 mu=m[k]/N; vec3 v=abs(s2[k]/N-mu*mu); float sv=v.r+v.g+v.b; if(sv<best){best=sv;col=mu;} }
    // ink edges (sobel on luminance)
    float tl=L(S(vUv+px*vec2(-1,1))),t=L(S(vUv+px*vec2(0,1))),tr=L(S(vUv+px*vec2(1,1)));
    float l=L(S(vUv+px*vec2(-1,0))),r=L(S(vUv+px*vec2(1,0)));
    float bl=L(S(vUv+px*vec2(-1,-1))),b=L(S(vUv+px*vec2(0,-1))),br=L(S(vUv+px*vec2(1,-1)));
    float gx=-tl-2.*l-bl+tr+2.*r+br, gy=-tl-2.*t-tr+bl+2.*b+br; float e=smoothstep(.18,.5,sqrt(gx*gx+gy*gy));
    col = mix(col, ink, e*.45);
    // canvas / brush grain
    vec2 sp = mat2(.8,-.6,.6,.8)*(vUv*res); float strokes = n(vec2(sp.x/5., sp.y/22.)+n(vUv*9.)*3.);
    col *= .97 + strokes*.06;
    // grade: tinted shadows, saturation
    float lum=L(col); col = mix(col, col+shadowTint*.5, (1.-smoothstep(.0,.45,lum))*.8);
    col = mix(vec3(lum), col, 1.22); vec3 cc=clamp(col,0.,1.); col += (cc*cc*(3.-2.*cc)-cc)*0.4;
    // vignette + grain
    vec2 q=vUv-.5; col *= 1.-dot(q,q)*.9;
    col += (h(vUv*res+.3)-.5)*.035;
    gl_FragColor=vec4(col,1.);
  }`
};

// ---------- shared bits ----------
function dust(count, spread, center, color = 0xffe7b8, size = 0.03) {
  const g = new THREE.BufferGeometry(); const p = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) { p[i * 3] = center.x + rr(-spread.x, spread.x); p[i * 3 + 1] = center.y + rr(-spread.y, spread.y); p[i * 3 + 2] = center.z + rr(-spread.z, spread.z); }
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const tex = canvasTex(64, 64, (c) => { const r = c.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.3, 'rgba(255,255,255,.6)'); r.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = r; c.fillRect(0, 0, 64, 64); });
  const m = new THREE.PointsMaterial({ color: new THREE.Color(color).multiplyScalar(2.5), size, map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
  const pts = new THREE.Points(g, m); scene.add(pts); return pts;
}
function beam(from, to, radius, color, opacity = 0.18) {
  const len = from.distanceTo(to); const geo = new THREE.CylinderGeometry(radius * .4, radius, len, 24, 1, true); geo.translate(0, -len / 2, 0);
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
  m.position.copy(from); m.lookAt(to); m.rotateX(-Math.PI / 2); scene.add(m); return m;
}

// ---------- ROOM ----------
function buildRoom({ doorOpen = 0 } = {}) {
  const EGG = { screens: [], posters: [] };
  const wallM = toon(PAL.wall, { rim: 0 }), wall2M = toon(PAL.wall2, { rim: 0 }), floorM = toon(PAL.floor, { rim: 0 }), woodM = toon(PAL.wood), darkM = toon('#1c1726'), fabM = toon(PAL.fabric), fab2M = toon(PAL.fabric2), whiteM = toon('#e9dfd0');
  box(6.4, 0.2, 6.4, floorM, 0, -0.1, 0, 0.02);
  // floor planks lines
  const lineM = toon('#2a1a24', { rim: 0 }); for (let i = -3; i <= 3; i += 0.45) box(0.015, 0.01, 6.3, lineM, i, 0.005, 0, 0.004);
  // back wall with window (x 0..1.6, y 1.0..2.3) and door (x 2.0..2.9, y 0..2.1)
  const WZ = -3.1, Hh = 3.2;
  box(3.0, Hh, 0.2, wallM, -1.5, Hh / 2, WZ); // left part x -3..0
  box(0.4, Hh, 0.2, wallM, 1.8, Hh / 2, WZ); // between window & door 1.6..2.0
  box(1.6, 1.0, 0.2, wallM, 0.8, 0.5, WZ); box(1.6, 0.9, 0.2, wallM, 0.8, 2.75, WZ); // under/over window
  box(0.9, 1.1, 0.2, wallM, 2.45, 2.65, WZ); // over door
  box(0.3, Hh, 0.2, wallM, 3.05, Hh / 2, WZ);
  box(0.2, Hh, 6.4, wall2M, -3.1, Hh / 2, 0); // left wall
  box(0.2, Hh, 6.4, wall2M, 3.3, Hh / 2, 0); box(6.6, Hh, 0.2, wallM, 0.1, Hh / 2, 3.3); const ceiling = box(6.8, 0.2, 6.8, wall2M, 0.1, Hh + 0.1, 0);
  // fenêtre côté entrée + étagère de jeux
  const fwin = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.0), new THREE.MeshBasicMaterial({ map: skyTex(), toneMapped: false })); fwin.rotation.y = Math.PI; fwin.position.set(1.2, 1.8, 3.19); scene.add(fwin);
  const fwM = toon('#efe2cf');
  box(1.5, 0.06, 0.1, fwM, 1.2, 1.28, 3.15, 0.01); box(1.5, 0.06, 0.1, fwM, 1.2, 2.32, 3.15, 0.01); box(0.06, 1.1, 0.1, fwM, 0.47, 1.8, 3.15, 0.01); box(0.06, 1.1, 0.1, fwM, 1.93, 1.8, 3.15, 0.01); box(0.04, 1.0, 0.08, fwM, 1.2, 1.8, 3.15, 0.01);
  box(1.6, 0.05, 0.3, toon(PAL.wood), -1.2, 1.4, 3.05, 0.01);
  const console_ = box(0.5, 0.12, 0.3, toon('#2a2440'), -1.6, 1.49, 3.05, 0.03); const cart = box(0.12, 0.16, 0.03, glow(PAL.keyA, 1.6), -1.25, 1.5, 3.05, 0.01); const cart2 = box(0.12, 0.16, 0.03, glow(PAL.keyB, 1.6), -1.08, 1.5, 3.05, 0.01); for (const m of [console_, cart, cart2]) m.userData.egg = 'console'; EGG.console = [cart, cart2];
  // neon sign
  const neon = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.55), new THREE.MeshBasicMaterial({ map: canvasTex(512, 256, (g, w, h) => { g.font = '900 170px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; const c = DIR === 2 ? '#ffcf6b' : '#' + new THREE.Color(PAL.keyA).getHexString(); g.shadowColor = c; g.shadowBlur = 24; g.fillStyle = c; g.fillText('</>', w / 2, h / 2 + 6); g.shadowBlur = 0; g.fillStyle = '#fff6ec'; g.fillText('</>', w / 2, h / 2 + 6); }), transparent: true, toneMapped: false })); neon.material.color.setScalar(2.2); neon.position.set(-1.65, 2.25, WZ + 0.12); scene.add(neon);
  const nl = new THREE.PointLight(DIR === 2 ? 0xffcf6b : PAL.keyA, 6, 3.5, 1.6); nl.position.set(-1.65, 2.2, WZ + 0.5); scene.add(nl);
  // window frame + panes
  const frameM = toon('#efe2cf');
  box(1.7, 0.08, 0.3, frameM, 0.8, 1.0, WZ + 0.05); box(1.7, 0.08, 0.3, frameM, 0.8, 2.3, WZ + 0.05);
  box(0.08, 1.38, 0.3, frameM, 0.0, 1.65, WZ + 0.05); box(0.08, 1.38, 0.3, frameM, 1.6, 1.65, WZ + 0.05); box(0.05, 1.3, 0.12, frameM, 0.8, 1.65, WZ + 0.05);
  box(1.8, 0.06, 0.4, frameM, 0.8, 0.97, WZ + 0.2); // sill
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(9, 4.5), new THREE.MeshBasicMaterial({ map: skyTex(), toneMapped: false, fog: false }));
  sky.position.set(0.8, 1.9, WZ - 2.2); scene.add(sky);
  // door
  const doorPivot = new THREE.Group(); doorPivot.position.set(2.0, 0, WZ + 0.05); scene.add(doorPivot);
  const door = box(0.88, 2.08, 0.07, toon(PAL.wood, { rim: .3 }), 0.44, 1.04, 0, 0.02, doorPivot);
  box(0.6, 0.7, 0.02, toon(PAL.wall2), 0.44, 1.5, 0.045, 0.01, doorPivot); box(0.6, 0.7, 0.02, toon(PAL.wall2), 0.44, 0.6, 0.045, 0.01, doorPivot);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), toon('#e8c070')); knob.position.set(0.8, 1.0, 0.08); doorPivot.add(knob);
  doorPivot.rotation.y = doorOpen * 1.25;
  box(0.06, 2.15, 0.26, frameM, 1.98, 1.07, WZ + 0.05); box(0.06, 2.15, 0.26, frameM, 2.92, 1.07, WZ + 0.05); box(1.0, 0.06, 0.26, frameM, 2.45, 2.13, WZ + 0.05);
  // portal behind door
  const portal = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 2.1), portalMat.clone()); portal.material.uniforms.spawn.value = 0; portal.position.set(2.45, 1.04, WZ - 0.06); scene.add(portal);
  const voidBox = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.6, 7), new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide, fog: false })); voidBox.position.set(2.45, 1.1, WZ - 3.55); scene.add(voidBox);
  const pl = new THREE.PointLight(new THREE.Color(PAL.portal[0]), 1.2, 7, 1.6); pl.position.set(2.45, 1.2, WZ + 0.6); scene.add(pl);
  // light leak under closed door
  if (false) { const leak = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.03), glow(PAL.portal[0], 4)); leak.position.set(2.45, 0.015, WZ + 0.1); leak.rotation.x = -Math.PI / 2; scene.add(leak); }
  // desk
  box(2.3, 0.07, 0.75, woodM, -1.75, 0.76, -2.55); box(0.06, 0.74, 0.7, woodM, -2.85, 0.37, -2.55); box(0.06, 0.74, 0.7, woodM, -0.65, 0.37, -2.55);
  box(0.5, 0.5, 0.65, woodM, -1.0, 0.45, -2.55); // drawer
  // monitors
  const mon = (x, rotY, w) => { const g = new THREE.Group(); g.position.set(x, 0.8, -2.72); g.rotation.y = rotY; scene.add(g);
    box(w, w * .58, 0.04, darkM, 0, 0.42, 0, 0.02, g); const scr = new THREE.Mesh(new THREE.PlaneGeometry(w * .94, w * .52), new THREE.MeshBasicMaterial({ map: codeTex('#' + new THREE.Color(PAL.keyB).getHexString()), toneMapped: false }));
    scr.material.color.setScalar(4); scr.position.set(0, 0.42, 0.025); g.add(scr); EGG.screens.push(scr); scr.userData.egg = 'screen'; box(0.06, 0.25, 0.05, darkM, 0, 0.12, -0.02, 0.01, g); box(0.3, 0.02, 0.18, darkM, 0, 0.01, 0, 0.01, g); };
  mon(-2.05, 0.18, 0.72); mon(-1.3, -0.12, 0.72);
  const ml = new THREE.PointLight(PAL.keyB, 8, 3.5, 1.6); ml.position.set(-1.7, 1.25, -2.1); scene.add(ml);
  box(0.6, 0.03, 0.2, darkM, -1.7, 0.81, -2.32, 0.01); // keyboard
  for (let i = 0; i < 12; i++) box(0.035, 0.012, 0.035, glow(i % 2 ? PAL.keyA : PAL.keyB, 1.5), -1.97 + i * .05, 0.83, -2.32, 0.005);
  const mug = cyl(0.045, 0.04, 0.1, toon(PAL.fabric2), -0.95, 0.84, -2.35); mug.userData.egg = 'mug'; EGG.mug = mug;
  // canard en plastique (debug)
  const duck = new THREE.Group(); duck.position.set(-0.78, 0.8, -2.5); duck.rotation.y = 0.7; scene.add(duck); EGG.duck = duck;
  const dM = toon('#ffd23f', { rim: .6 }); const db = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), dM); db.scale.set(1.25, 0.8, 1); db.position.y = 0.055; const dh = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), dM); dh.position.set(0.05, 0.13, 0); const dbk = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.05, 8), toon('#ff8a2a')); dbk.rotation.z = -Math.PI / 2; dbk.position.set(0.105, 0.125, 0);
  for (const m of [db, dh, dbk]) { m.castShadow = true; m.userData.egg = 'duck'; duck.add(m); }
  // desk lamp
  cyl(0.1, 0.12, 0.03, darkM, -2.7, 0.81, -2.4); const arm = cyl(0.015, 0.015, 0.55, darkM, -2.7, 1.07, -2.4); arm.rotation.z = -0.4;
  const shade = cyl(0.04, 0.12, 0.14, toon('#e8b45a'), -2.58, 1.33, -2.4); shade.rotation.z = 0.8; shade.userData.egg = 'lamp';
  const lampL = new THREE.PointLight(PAL.lamp, DIR === 2 ? 6 : 14, 6, 1.4); lampL.position.set(-2.45, 1.22, -2.35); lampL.castShadow = true; lampL.shadow.mapSize.set(1024, 1024); lampL.shadow.bias = -0.002; scene.add(lampL);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), glow(PAL.lamp, 5)); bulb.position.set(-2.5, 1.27, -2.38); scene.add(bulb); bulb.userData.egg = 'lamp'; EGG.lamp = { light: lampL, bulb, shade };
  // chair
  const ch = new THREE.Group(); ch.position.set(-1.6, 0, -1.7); ch.rotation.y = 0.35; scene.add(ch); EGG.chair = ch;
  box(0.55, 0.1, 0.55, fab2M, 0, 0.5, 0, 0.05, ch); box(0.55, 0.8, 0.1, fab2M, 0, 0.95, 0.27, 0.05, ch); box(0.3, 0.2, 0.06, fabM, 0, 1.25, 0.24, 0.04, ch);
  cyl(0.03, 0.03, 0.4, darkM, 0, 0.25, 0, 10, ch); ch.traverse(o => { if (o.isMesh) o.userData.egg = 'chair'; }); for (let i = 0; i < 5; i++) { const leg = box(0.32, 0.03, 0.04, darkM, Math.cos(i * 1.256) * .15, 0.04, Math.sin(i * 1.256) * .15, 0.01, ch); leg.rotation.y = -i * 1.256; }
  // bed along left wall
  box(1.5, 0.35, 2.3, woodM, -2.25, 0.18, 1.6, 0.06); box(1.42, 0.22, 2.2, whiteM, -2.25, 0.46, 1.6, 0.1);
  const blanket = box(1.48, 0.12, 1.5, fabM, -2.22, 0.6, 1.95, 0.06); blanket.rotation.z = 0.02;
  box(0.6, 0.16, 0.38, toon('#f3e6d6'), -2.55, 0.66, 0.7, 0.08); box(0.55, 0.15, 0.36, fab2M, -1.95, 0.66, 0.72, 0.08);
  box(0.06, 1.0, 1.5, woodM, -2.98, 0.75, 1.6, 0.03); // headboard on wall
  // shelves above bed with books
  for (const y of [1.7, 2.15]) { box(0.3, 0.04, 1.6, woodM, -2.85, y, 1.3, 0.01);
    let z = 0.6; while (z < 2.0) { const bw = rr(0.05, 0.1), bh = rr(0.18, 0.3); const bk = box(0.22, bh, bw, toon([PAL.fabric, PAL.fabric2, '#e9dfd0', PAL.wood, '#3fbf9f'][Math.floor(rnd() * 5)]), -2.83, y + bh / 2 + 0.02, z, 0.01); if (rnd() < .2) bk.rotation.x = 0.25; z += bw + 0.01; } }
  // posters
  for (let i = 0; i < 2; i++) { const p = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.7), new THREE.MeshToonMaterial({ map: posterTex(i), gradientMap: gradMap, side: THREE.DoubleSide })); p.position.set(-2.7 + i * 2.15, 2.1, WZ + 0.11); scene.add(p); p.userData.egg = 'poster'; EGG.posters.push(p); }
  const p3 = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.84), new THREE.MeshToonMaterial({ map: posterTex(2), gradientMap: gradMap })); p3.rotation.y = Math.PI / 2; p3.position.set(-2.99, 2.05, -1.2); scene.add(p3);
  // plants
  const plant = (x, z, s) => { cyl(0.13 * s, 0.1 * s, 0.25 * s, toon('#c8693e'), x, 0.125 * s, z);
    for (let i = 0; i < 9; i++) { const lf = new THREE.Mesh(new THREE.SphereGeometry(0.11 * s, 10, 8), toon(i % 2 ? '#2f8f6a' : '#4fb07a')); lf.scale.set(0.5, 1.6, 0.25); lf.position.set(x + Math.cos(i) * .08 * s, (0.35 + rnd() * .25) * s, z + Math.sin(i) * .08 * s); lf.rotation.set(rr(-.6, .6), i, Math.cos(i) * .7); lf.castShadow = true; scene.add(lf); } };
  plant(-0.45, -2.75, 1.2); plant(1.55, -2.7, 0.8); plant(-2.75, -0.4, 1.6);
  // rug
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.1, 48), toon(PAL.fabric2, { rim: 0 })); rug.rotation.x = -Math.PI / 2; rug.position.set(-0.4, 0.012, 0.2); rug.receiveShadow = true; scene.add(rug);
  const rug2 = new THREE.Mesh(new THREE.RingGeometry(0.8, 0.9, 48), toon(PAL.fabric, { rim: 0 })); rug2.rotation.x = -Math.PI / 2; rug2.position.set(-0.4, 0.014, 0.2); scene.add(rug2);
  // string lights along back wall top + left wall
  const bulbM = glow(DIR === 2 ? '#ffd9a0' : PAL.keyA, 4), bulbM2 = glow(DIR === 2 ? '#fff1cc' : PAL.keyB, 4);
  for (let i = 0; i <= 26; i++) { const t = i / 26; const x = -2.95 + t * 5.9; const y = 2.95 - Math.sin(t * Math.PI * 3) ** 2 * 0.22; const b = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), i % 2 ? bulbM : bulbM2); b.position.set(x, y, WZ + 0.16); scene.add(b); b.userData.egg = 'lights'; }
  EGG.bulbM = [bulbM, bulbM2];
  // window light
  const winCol = DIR === 2 ? 0xffc06a : PAL.keyA;
  const sun = new THREE.SpotLight(winCol, DIR === 2 ? 22 : 18, 12, 0.5, 0.6, 1.2); sun.position.set(0.9, 3.2, WZ - 2.5); sun.target.position.set(-0.6, 0, 0.3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.001; scene.add(sun, sun.target);
  if (DIR === 2) { beam(new THREE.Vector3(0.8, 2.2, WZ), new THREE.Vector3(-0.8, 0, 0.6), 0.9, 0xffc879, 0.045); beam(new THREE.Vector3(0.4, 2.0, WZ), new THREE.Vector3(-1.4, 0, 0.2), 0.5, 0xffd9a0, 0.035); }
  if (DIR === 3) { // LED strip along floor/ceiling
    box(6.0, 0.03, 0.03, glow(PAL.keyA, 3), 0, 3.15, WZ + 0.14, 0.01); box(0.03, 0.03, 6.0, glow(PAL.keyB, 2), -2.95, 3.15, 0, 0.01);
    const led = new THREE.PointLight(PAL.keyA, 6, 6, 1.5); led.position.set(0, 2.9, -2.6); scene.add(led); }
  scene.add(new THREE.HemisphereLight(PAL.hemiSky, PAL.hemiGround, DIR === 2 ? 0.45 : 0.18));
  const fill = new THREE.DirectionalLight(PAL.keyB, DIR === 2 ? 0.4 : 0.8); fill.position.set(4, 3, 4); scene.add(fill);
  dust(DIR === 2 ? 500 : 250, new THREE.Vector3(2.5, 1.4, 2.5), new THREE.Vector3(-0.3, 1.5, -0.5), DIR === 2 ? 0xffe0a0 : 0xd8c8ff, 0.035);
  return { portal, doorPivot, pl, ceiling, eggs: EGG };
}

// ---------- GALLERY DIMENSION ----------
function nebula(colors) {
  const m = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, toneMapped: false, fog: false,
    uniforms: { a: { value: new THREE.Color(colors[0]) }, b: { value: new THREE.Color(colors[1]) }, c: { value: new THREE.Color(colors[2]) } },
    vertexShader: 'varying vec3 vP; void main(){vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `varying vec3 vP; uniform vec3 a,b,c;
    float h(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
    float n(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+1.),f.x),f.y),f.z);}
    float fbm(vec3 p){float v=0.,s=.5;for(int i=0;i<6;i++){v+=s*n(p);p*=2.1;s*=.5;}return v;}
    void main(){ float f=fbm(vP*2.5+fbm(vP*3.)*1.5); vec3 col=mix(a,b,smoothstep(.35,.75,f)); col=mix(col,c,smoothstep(.62,.9,f)*.8);
      float st=step(.9985,h(floor(vP*420.))); col+=st*vec3(1.2); gl_FragColor=vec4(col,1.);} ` });
  const s = new THREE.Mesh(new THREE.SphereGeometry(80, 64, 32), m); scene.add(s);
}
function buildGallery() {
  scene.fog = new THREE.FogExp2(PAL.fog, DIR === 2 ? 0.03 : 0.045);
  if (DIR === 1) nebula(['#07051a', '#3a1670', '#ff3d8b']);
  if (DIR === 2) nebula(['#ffb066', '#c4506a', '#fff0c0']);
  if (DIR === 3) nebula(['#05030f', '#2a0e5a', '#ffcc4d']);
  scene.add(new THREE.HemisphereLight(PAL.hemiSky, PAL.hemiGround, 1.0));
  const key = new THREE.DirectionalLight(PAL.keyA, 2.2); key.position.set(-5, 6, 4); scene.add(key);
  const back = new THREE.PointLight(PAL.keyB, 30, 30, 1.2); back.position.set(0, 0, -14); scene.add(back);
  const cards = [];
  const cardFrameM = toon('#1a1626', { rim: 0.9 });
  if (DIR === 1 || DIR === 3) {
    // helix tunnel of cards (camera inside, spiral)
    const N = 30;
    for (let i = 0; i < N; i++) {
      const p = PROJECTS[i % PROJECTS.length]; const a = i * 0.78; const z = -i * 1.05; const R = DIR === 3 ? 3.0 : 2.6;
      const g = new THREE.Group(); g.position.set(Math.cos(a) * R, Math.sin(a) * R * .8 + 0.2, z); g.lookAt(0, 0.2, z + 2.5); scene.add(g);
      box(1.32, 1.68, 0.06, cardFrameM, 0, 0, -0.04, 0.05, g);
      const pi = i % PROJECTS.length; const face = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.6), new THREE.MeshBasicMaterial({ map: cardTex(pi), toneMapped: false })); face.material.color.setScalar(1.08); face.position.z = 0.0; g.add(face);
      const back = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.6), new THREE.MeshBasicMaterial({ map: cardBack(), toneMapped: false })); back.rotation.y = Math.PI; back.position.z = -0.075; g.add(back);
      g.rotateZ(rr(-.2, .2)); g.userData = { pi, face, back }; face.userData.card = g; back.userData.card = g; cards.push(g);
    }
    if (DIR === 3) { // laser beams
      for (let i = 0; i < 10; i++) beam(new THREE.Vector3(rr(-6, 6), -4, rr(-30, -6)), new THREE.Vector3(rr(-2, 2), 6, rr(-20, 0)), 0.05, i % 2 ? PAL.keyA : PAL.keyB, 0.5);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.04, 8, 120), glow(PAL.keyB, 4)); ring.position.set(0, 0.2, -9); scene.add(ring);
      const ring2 = ring.clone(); ring2.scale.setScalar(1.25); ring2.position.z = -16; ring2.material = glow(PAL.keyA, 4); scene.add(ring2);
    }
  } else {
    // golden dunes with monoliths carrying cards + huge sun
    const sandM = toon('#c47a48', { rim: 0.1 });
    const dune = new THREE.Mesh(new THREE.PlaneGeometry(120, 120, 200, 200), sandM); dune.rotation.x = -Math.PI / 2;
    const pos = dune.geometry.attributes.position; for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); pos.setZ(i, Math.sin(x * .15 + Math.cos(y * .08) * 2) * 1.2 + Math.sin(y * .23) * .6 + Math.sin(x * .5 + y * .3) * .15); }
    dune.geometry.computeVertexNormals(); dune.position.y = -2.2; dune.receiveShadow = true; scene.add(dune);
    const sunM = new THREE.Mesh(new THREE.SphereGeometry(9, 48, 48), glow('#ffd27a', 1.6)); sunM.material.fog = false; sunM.position.set(2, 4, -60); scene.add(sunM);
    const halo = new THREE.Mesh(new THREE.RingGeometry(9.5, 10.2, 96), glow('#fff2c8', 2)); halo.material.fog = false; halo.position.copy(sunM.position); scene.add(halo);
    key.color.set(0xffc070); key.intensity = 3.5; key.position.set(2, 6, -30); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, far: 80 });
    for (let i = 0; i < 12; i++) {
      const p = PROJECTS[i % PROJECTS.length]; const side = i % 2 ? 1 : -1; const z = -2 - i * 3.2; const x = side * (2.3 + rr(0, .8));
      const g = new THREE.Group(); g.position.set(x, -0.6, z); g.rotation.y = -side * 0.55; scene.add(g);
      box(1.7, 3.6, 0.5, toon('#3a1e2c', { rim: 0.7 }), 0, 0.6, -0.3, 0.08, g);
      const face = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.6), new THREE.MeshBasicMaterial({ map: cardTex(p, i), toneMapped: false })); face.position.set(0, 0.9, -0.04); g.add(face);
      g.rotation.z = rr(-.06, .06);
    }
    // stepping stones path
    for (let i = 0; i < 26; i++) { const s = box(rr(.5, .9), .12, rr(.4, .6), toon('#c88450'), Math.sin(i * .5) * .6, -1.6 + Math.sin(i * .3) * .1, 2 - i * 1.4, .05); s.rotation.y = rr(-.4, .4); }
  }
  // floating shards
  for (let i = 0; i < 60; i++) {
    const s = new THREE.Mesh(new THREE.OctahedronGeometry(rr(.06, .3), 0), toon(i % 3 ? PAL.fabric : PAL.fabric2, { rim: .8 }));
    s.position.set(rr(-7, 7), rr(-4, 5), rr(-40, 4)); s.rotation.set(rr(0, 3), rr(0, 3), 0); s.scale.y = rr(1, 2.5); scene.add(s);
  }
  dust(900, new THREE.Vector3(8, 5, 25), new THREE.Vector3(0, 0, -15), DIR === 2 ? 0xffe0a0 : PAL.keyB, 0.06);
  return { cards };
}

// ---------- SECTION DIMENSION (e.g. "Compétences") ----------
function buildSection() {
  if (DIR === 1) nebula(['#060a1c', '#103a5a', '#35e0ff']);
  if (DIR === 2) nebula(['#3a1430', '#c4506a', '#ffd27a']);
  if (DIR === 3) nebula(['#0a0418', '#3a0f6e', '#ff5cc8']);
  scene.fog = new THREE.FogExp2(PAL.fog, 0.03);
  scene.add(new THREE.HemisphereLight(PAL.hemiSky, PAL.hemiGround, 1.0));
  const key = new THREE.DirectionalLight(PAL.keyB, 2.5); key.position.set(6, 8, 3); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 }); scene.add(key);
  const rockM = toon(DIR === 2 ? '#8a4a3a' : '#3b3560', { rim: 0.6 }), grassM = toon(DIR === 2 ? '#d89a50' : DIR === 3 ? '#4a2a7a' : '#2f8f7a', { rim: .3 });
  const island = (x, y, z, s) => {
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1.6 * s, 1.3 * s, .35 * s, 9), grassM); top.position.set(x, y, z); top.castShadow = top.receiveShadow = true; scene.add(top);
    const bot = new THREE.Mesh(new THREE.ConeGeometry(1.3 * s, 2.6 * s, 9), rockM); bot.rotation.x = Math.PI; bot.position.set(x, y - 1.45 * s, z); bot.castShadow = true; scene.add(bot);
    for (let i = 0; i < 4; i++) { const r = new THREE.Mesh(new THREE.DodecahedronGeometry(rr(.12, .3) * s, 0), rockM); r.position.set(x + rr(-1, 1) * s, y + .25 * s, z + rr(-1, 1) * s); r.castShadow = true; scene.add(r); }
    return top;
  };
  island(0, -1.2, -4, 2.0);
  island(-5.5, 0.8, -8, 1.0); island(5.2, -0.2, -7, 1.1); island(-3.5, 2.6, -14, 0.8); island(4.0, 3.2, -16, 0.7); island(1, 4.5, -24, 0.9);
  if (DIR === 1) { // crystal cluster centerpiece
    for (let i = 0; i < 9; i++) { const h = rr(1.2, 3.4); const c = new THREE.Mesh(new THREE.CylinderGeometry(0, rr(.25, .45), h, 6), new THREE.MeshToonMaterial({ color: new THREE.Color(i % 3 ? PAL.keyB : PAL.keyA).multiplyScalar(0.8), gradientMap: gradMap, emissive: new THREE.Color(i % 3 ? PAL.keyB : PAL.keyA), emissiveIntensity: .25 }));
      c.position.set(rr(-1, 1), -0.9 + h / 2, -4 + rr(-1, 1)); c.rotation.set(rr(-.4, .4), rr(0, 3), rr(-.4, .4)); c.castShadow = true; scene.add(c); }
    const cl = new THREE.PointLight(PAL.keyB, 25, 12, 1.4); cl.position.set(0, 1.5, -3); scene.add(cl);
  }
  if (DIR === 2) { // giant orb + arches
    const orb = new THREE.Mesh(new THREE.SphereGeometry(2.2, 64, 64), glow('#ffcf6b', 1.3)); orb.position.set(0, 2.6, -6); scene.add(orb);
    const ol = new THREE.PointLight(0xffb347, 25, 25, 1.4); ol.position.copy(orb.position); scene.add(ol);
    for (let i = 0; i < 3; i++) { const arch = new THREE.Mesh(new THREE.TorusGeometry(2.8 + i * .9, .18, 8, 40, Math.PI), toon('#5a2a38', { rim: .9 })); arch.position.set(0, -0.9, -6 - i * 1.5); arch.castShadow = true; scene.add(arch); }
    key.color.set(0xffc070);
  }
  if (DIR === 3) { // holographic stage: rings + chrome spheres
    const stage = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.8, .3, 48), toon('#1a1028', { rim: .9 })); stage.position.set(0, -0.85, -4); stage.receiveShadow = true; scene.add(stage);
    for (let i = 0; i < 3; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1.6 + i * .45, .03, 8, 120), glow(i % 2 ? PAL.keyB : PAL.keyA, 4)); r.position.set(0, 1.2, -4); r.rotation.set(1.1 + i * .3, i * .5, 0); scene.add(r); }
    const orb = new THREE.Mesh(new THREE.SphereGeometry(.8, 48, 48), toon('#ffcc4d', { rim: 1.2 })); orb.position.set(0, 1.2, -4); scene.add(orb); orb.userData.egg = 'orb';
    for (let i = 0; i < 12; i++) beam(new THREE.Vector3(Math.cos(i) * 2.6, -0.7, -4 + Math.sin(i) * 2.6), new THREE.Vector3(Math.cos(i) * 4, 9, -4 + Math.sin(i) * 4), .06, i % 2 ? PAL.keyA : PAL.keyB, .45);
    const sl = new THREE.PointLight(PAL.keyA, 18, 15, 1.3); sl.position.set(0, 2, -2); scene.add(sl);
  }
  // waterfall/energy stream from main island
  dust(1200, new THREE.Vector3(10, 7, 14), new THREE.Vector3(0, 1, -10), DIR === 2 ? 0xffe0a0 : PAL.keyB, 0.05);
}

