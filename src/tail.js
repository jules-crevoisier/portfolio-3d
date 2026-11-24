
// ================= PROTOTYPE v7 =================
const PROJECTS = window.__PROJECTS;
const ACC = ['#ff3d8b', '#35e0ff', '#ffd27a', '#a77bff', '#6be3a4', '#ff8a4c'];
const COND = (w, px) => `${w} ${px}px Archivo`;
function setCond(g) { try { g.fontStretch = 'extra-condensed'; } catch (e) {} }

// ---------- cartes projet peintes (reprises de la v2) ----------
function paintFill(g, path, base, light, dark, accent) {
  g.save(); path(); g.fillStyle = base; g.fill(); g.clip();
  for (let i = 0; i < 70; i++) { g.strokeStyle = i % 3 ? light : dark; g.globalAlpha = rr(.08, .3); g.lineWidth = rr(6, 20); g.lineCap = 'round';
    const x = rr(-60, 700), y = rr(-60, 900); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + rr(10, 40), y - rr(10, 40), x + rr(40, 110), y - rr(30, 90)); g.stroke(); }
  g.restore(); g.globalAlpha = 1;
  g.save(); path(); g.lineJoin = 'round'; g.strokeStyle = '#120a1a'; g.lineWidth = 11; g.stroke(); g.restore();
  g.save(); path(); g.clip(); path(); g.strokeStyle = accent; g.lineWidth = 7; g.globalAlpha = .9; g.translate(-6, -5); g.stroke(); g.restore(); g.globalAlpha = 1;
}
const EMBLEM = [
  (g, c) => { // 0 enveloppe + colombe (webmail)
    paintFill(g, () => { g.beginPath(); g.rect(150, 190, 340, 230); }, '#f0e2c4', '#fff8e6', '#a98a5a', c);
    g.strokeStyle = '#120a1a'; g.lineWidth = 10; g.lineJoin = 'round'; g.beginPath(); g.moveTo(150, 190); g.lineTo(320, 320); g.lineTo(490, 190); g.stroke();
    paintFill(g, () => { g.beginPath(); g.moveTo(360, 150); g.quadraticCurveTo(420, 90, 500, 120); g.quadraticCurveTo(450, 140, 445, 175); g.quadraticCurveTo(400, 190, 360, 150); g.closePath(); }, '#d9a441', '#ffe6a8', '#7a4a1e', c);
  },
  (g, c) => { // 1 loupe (crawler SEO)
    g.save(); g.lineCap = 'round'; g.strokeStyle = '#120a1a'; g.lineWidth = 64; g.beginPath(); g.moveTo(385, 345); g.lineTo(465, 430); g.stroke(); g.strokeStyle = '#d9a441'; g.lineWidth = 42; g.stroke(); g.restore();
    paintFill(g, () => { g.beginPath(); g.arc(290, 265, 120, 0, 7); }, '#d9a441', '#ffe6a8', '#7a4a1e', c);
    paintFill(g, () => { g.beginPath(); g.arc(290, 265, 88, 0, 7); }, '#2a1a44', '#5a3a8a', '#0b0614', c);
    g.strokeStyle = c; g.lineWidth = 9; g.lineCap = 'round'; g.shadowColor = c; g.shadowBlur = 14; [[-40, 0], [-10, -30], [25, 10], [55, -20]].reduce((a, b) => { g.beginPath(); g.moveTo(290 + a[0], 280 + a[1]); g.lineTo(290 + b[0], 280 + b[1]); g.stroke(); return b; }); g.shadowBlur = 0;
  },
  (g, c) => { // 2 calendrier (emploi du temps)
    paintFill(g, () => { g.beginPath(); g.rect(160, 170, 320, 270); }, '#f0e2c4', '#fff8e6', '#a98a5a', c);
    paintFill(g, () => { g.beginPath(); g.rect(160, 170, 320, 70); }, '#d9a441', '#ffe6a8', '#7a4a1e', c);
    g.fillStyle = '#120a1a'; [220, 420].forEach(x => { g.fillRect(x - 9, 140, 18, 60); });
    for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) { const on = (r * 4 + k) % 5 === 1; g.fillStyle = on ? c : '#6a4a3a'; g.globalAlpha = on ? 1 : .55; g.fillRect(185 + k * 74, 262 + r * 56, 52, 38); } g.globalAlpha = 1;
  },

  (g, c) => { // cadenas
    paintFill(g, () => { g.beginPath(); g.lineWidth = 34; g.arc(320, 250, 82, Math.PI, 0); }, 'rgba(0,0,0,0)', '#fff', '#000', c);
    g.save(); g.beginPath(); g.arc(320, 250, 82, Math.PI, 0); g.lineWidth = 46; g.strokeStyle = '#120a1a'; g.stroke(); g.lineWidth = 30; g.strokeStyle = '#c9a25a'; g.stroke(); g.lineWidth = 8; g.strokeStyle = '#ffe6a8'; g.globalAlpha = .7; g.beginPath(); g.arc(314, 246, 82, Math.PI * 1.1, Math.PI * 1.6); g.stroke(); g.restore(); g.globalAlpha = 1;
    paintFill(g, () => { g.beginPath(); g.roundRect(196, 240, 248, 210, 30); }, '#d9a441', '#ffe6a8', '#7a4a1e', c);
    paintFill(g, () => { g.beginPath(); g.arc(320, 320, 30, 0, 7); g.moveTo(306, 340); g.lineTo(334, 340); g.lineTo(344, 400); g.lineTo(296, 400); g.closePath(); }, '#1a0f24', '#3a2550', '#000', c);
  },
  (g, c) => { // feuille (écoresponsable)
    const leaf = () => { g.beginPath(); g.moveTo(190, 440); g.bezierCurveTo(170, 260, 300, 150, 470, 150); g.bezierCurveTo(470, 330, 360, 450, 190, 440); g.closePath(); };
    paintFill(g, leaf, '#3fae7a', '#a8f0c0', '#14543a', c);
    g.strokeStyle = '#120a1a'; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(200, 432); g.quadraticCurveTo(330, 330, 440, 180); g.stroke();
    for (let i = 0; i < 5; i++) { const t = .2 + i * .15; const x = 200 + 240 * t, y = 432 - 252 * t; g.lineWidth = 5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 40, y + 34 - i * 6); g.moveTo(x, y); g.lineTo(x - 26, y - 40 + i * 4); g.stroke(); }
  },
  (g, c) => { // portrait encadré
    paintFill(g, () => { g.beginPath(); g.ellipse(320, 300, 150, 175, 0, 0, 7); }, '#d9a441', '#ffe6a8', '#7a4a1e', c);
    paintFill(g, () => { g.beginPath(); g.ellipse(320, 300, 118, 143, 0, 0, 7); }, '#2a1a44', '#5a3a8a', '#0b0614', c);
    paintFill(g, () => { g.beginPath(); g.arc(320, 268, 48, 0, 7); g.moveTo(230, 420); g.quadraticCurveTo(232, 330, 320, 326); g.quadraticCurveTo(408, 330, 410, 420); g.closePath(); }, '#f0d9b5', '#fff4df', '#a06a48', c);
  },
  (g, c) => { // trophée e-sport
    paintFill(g, () => { g.beginPath(); g.moveTo(210, 170); g.lineTo(430, 170); g.quadraticCurveTo(430, 330, 320, 350); g.quadraticCurveTo(210, 330, 210, 170); g.closePath(); }, '#d9a441', '#ffe6a8', '#7a4a1e', c);
    g.lineWidth = 14; g.strokeStyle = '#120a1a'; g.beginPath(); g.arc(210, 225, 42, Math.PI * .5, Math.PI * 1.5); g.stroke(); g.beginPath(); g.arc(430, 225, 42, -Math.PI * .5, Math.PI * .5); g.stroke();
    g.lineWidth = 8; g.strokeStyle = '#d9a441'; g.beginPath(); g.arc(210, 225, 42, Math.PI * .5, Math.PI * 1.5); g.stroke(); g.beginPath(); g.arc(430, 225, 42, -Math.PI * .5, Math.PI * .5); g.stroke();
    paintFill(g, () => { g.beginPath(); g.rect(296, 345, 48, 50); g.roundRect(236, 392, 168, 44, 8); }, '#b8862f', '#ffe6a8', '#5a3414', c);
    g.fillStyle = '#120a1a'; g.font = '900 64px "Cinzel Decorative"'; g.textAlign = 'center'; g.fillText('1', 320, 290); g.textAlign = 'left';
  },
  (g, c) => { // écran vosoft
    paintFill(g, () => { g.beginPath(); g.roundRect(150, 160, 340, 230, 18); }, '#2a1a44', '#5a3a8a', '#0b0614', c);
    paintFill(g, () => { g.beginPath(); g.moveTo(290, 390); g.lineTo(350, 390); g.lineTo(370, 440); g.lineTo(270, 440); g.closePath(); }, '#d9a441', '#ffe6a8', '#7a4a1e', c);
    g.fillStyle = c; g.shadowColor = c; g.shadowBlur = 24; g.font = '900 92px "Cinzel Decorative"'; g.textAlign = 'center'; g.fillText('</>', 320, 310); g.shadowBlur = 0; g.textAlign = 'left';
  },
  (g, c) => { // livre ouvert
    paintFill(g, () => { g.beginPath(); g.moveTo(320, 200); g.quadraticCurveTo(250, 160, 150, 180); g.lineTo(150, 420); g.quadraticCurveTo(250, 400, 320, 440); g.closePath(); }, '#f0e2c4', '#fff8e6', '#a98a5a', c);
    paintFill(g, () => { g.beginPath(); g.moveTo(320, 200); g.quadraticCurveTo(390, 160, 490, 180); g.lineTo(490, 420); g.quadraticCurveTo(390, 400, 320, 440); g.closePath(); }, '#f0e2c4', '#fff8e6', '#a98a5a', c);
    g.strokeStyle = '#6a4a3a'; g.lineWidth = 5; for (let i = 0; i < 6; i++) { const y = 230 + i * 30; g.beginPath(); g.moveTo(180, y); g.quadraticCurveTo(240, y - 12, 295, y + 6); g.moveTo(345, y + 6); g.quadraticCurveTo(400, y - 12, 460, y); g.stroke(); }
  },
  (g, c) => { // 9 sprite pixel art (petit personnage)
    const P = ['..XXXX..', '.XXXXXX.', 'XXOXXOXX', 'XXXXXXXX', '.XX..XX.', '..XXXX..', '.X.XX.X.', 'X..XX..X'], s = 34, x0 = 320 - 4 * s, y0 = 150;
    P.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '.') return; g.fillStyle = '#120a1a'; g.fillRect(x0 + i * s - 4, y0 + j * s - 4, s + 8, s + 8); }));
    P.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '.') return; g.fillStyle = ch === 'O' ? '#120a1a' : (i + j) % 3 ? '#d9a441' : '#ffe6a8'; g.fillRect(x0 + i * s, y0 + j * s, s, s); }));
    g.fillStyle = c; g.shadowColor = c; g.shadowBlur = 16; g.fillRect(x0 + 2 * s + 6, y0 + 2 * s + 6, s - 12, s - 12); g.fillRect(x0 + 5 * s + 6, y0 + 2 * s + 6, s - 12, s - 12); g.shadowBlur = 0;
  },
  (g, c) => { // 10 horloge (rendez-vous)
    paintFill(g, () => { g.beginPath(); g.arc(320, 290, 150, 0, 7); }, '#d9a441', '#ffe6a8', '#7a4a1e', c);
    paintFill(g, () => { g.beginPath(); g.arc(320, 290, 118, 0, 7); }, '#f0e2c4', '#fff8e6', '#a98a5a', c);
    g.fillStyle = '#120a1a'; for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; g.beginPath(); g.arc(320 + Math.cos(a) * 98, 290 + Math.sin(a) * 98, k % 3 ? 5 : 9, 0, 7); g.fill(); }
    g.lineCap = 'round'; g.strokeStyle = '#120a1a'; g.lineWidth = 14; g.beginPath(); g.moveTo(320, 290); g.lineTo(320, 215); g.moveTo(320, 290); g.lineTo(372, 318); g.stroke();
    g.strokeStyle = c; g.lineWidth = 6; g.beginPath(); g.moveTo(320, 290); g.lineTo(372, 318); g.stroke(); g.fillStyle = c; g.beginPath(); g.arc(320, 290, 12, 0, 7); g.fill();
  },
];
function goldGrad(g, y0, y1) { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, '#fff0c4'); gr.addColorStop(.45, '#e2ad4c'); gr.addColorStop(1, '#9a6327'); return gr; }
function splatter(g, w, h, col, n = 60) { g.fillStyle = col; for (let i = 0; i < n; i++) { const x = rr(0, w), y = rr(0, h), r = Math.pow(rnd(), 3) * 9 + .8; g.globalAlpha = rr(.4, .95); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } g.globalAlpha = 1; }
function decoFrame(g, w, h) {
  g.strokeStyle = '#d9a441'; g.lineWidth = 4; g.strokeRect(18, 18, w - 36, h - 36); g.lineWidth = 1.5; g.strokeRect(30, 30, w - 60, h - 60);
  g.fillStyle = '#d9a441'; for (const [x, y] of [[18, 18], [w - 18, 18], [18, h - 18], [w - 18, h - 18]]) { g.save(); g.translate(x, y); g.rotate(Math.PI / 4); g.fillRect(-11, -11, 22, 22); g.fillStyle = '#120a1a'; g.fillRect(-5, -5, 10, 10); g.restore(); }
}
function wrapLines(g, text, maxW) { const words = text.split(' '); const out = []; let line = ''; for (const wd of words) { const t = line ? line + ' ' + wd : wd; if (g.measureText(t).width > maxW && line) { out.push(line); line = wd; } else line = t; } out.push(line); return out; }
function cardTex(pi) {
  const p = PROJECTS[pi], c = ACC[pi % ACC.length];
  return canvasTex(640, 820, (g, w, h) => {
    const bg = g.createLinearGradient(0, 0, w * .4, h); bg.addColorStop(0, '#24163c'); bg.addColorStop(1, '#0d0816'); g.fillStyle = bg; g.fillRect(0, 0, w, h);
    // halo peint derrière l'emblème
    const rg = g.createRadialGradient(320, 300, 20, 320, 300, 300); rg.addColorStop(0, c); rg.addColorStop(.5, c + '55'); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(0, 0, w, 560);
    for (let i = 0; i < 90; i++) { g.strokeStyle = i % 2 ? c : '#3a2560'; g.globalAlpha = rr(.05, .22); g.lineWidth = rr(8, 26); g.lineCap = 'round'; const x = rr(0, w), y = rr(0, 560); g.beginPath(); g.moveTo(x, y); g.lineTo(x + rr(30, 120), y - rr(20, 90)); g.stroke(); }
    g.globalAlpha = 1; splatter(g, w, 560, c, 70); splatter(g, w, 560, '#ffd27a', 25);
    EMBLEM[p.emblem != null ? p.emblem : pi % EMBLEM.length](g, c);
    // bandeau titre
    g.fillStyle = '#0d0816'; g.beginPath(); g.moveTo(0, 548); g.lineTo(w, 520); g.lineTo(w, h); g.lineTo(0, h); g.closePath(); g.fill();
    g.strokeStyle = '#d9a441'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 548); g.lineTo(w, 520); g.stroke();
    g.font = '900 58px "Cinzel Decorative"'; const lines = wrapLines(g, p.short, w - 110); let y = 610 + (lines.length === 1 ? 30 : 0);
    g.fillStyle = goldGrad(g, y - 50, y + 60 * lines.length);
    for (const L of lines) { g.fillStyle = '#2a0f2e'; g.fillText(L, 52, y + 5); g.fillStyle = goldGrad(g, y - 50, y + 10); g.fillText(L, 48, y); y += 62; }
    g.font = '700 22px "Cinzel"'; g.fillStyle = '#c9b6e8'; g.fillText(`[ ${p.cat.toUpperCase()} · ${p.year} ]`, 50, h - 64);
    // tag graffiti numéro
    g.save(); g.translate(64, 104); g.rotate(-.18); g.font = '64px "Sedgwick Ave Display"'; g.fillStyle = c; g.shadowColor = c; g.shadowBlur = 18; g.fillText(String(pi + 1).padStart(2, '0'), 0, 0); g.restore();
    decoFrame(g, w, h);
  });
}
let backTexC = null;
function cardBack() {
  if (backTexC) return backTexC;
  backTexC = canvasTex(640, 820, (g, w, h) => {
    g.fillStyle = '#140c22'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) { g.strokeStyle = '#d9a441'; g.globalAlpha = .18; g.lineWidth = 2; g.beginPath(); g.arc(320, 410, 30 + i * 14, 0, 7); g.stroke(); }
    g.globalAlpha = 1; splatter(g, w, h, '#ff3d8b', 50); splatter(g, w, h, '#35e0ff', 30);
    g.font = '900 150px "Cinzel Decorative"'; g.textAlign = 'center'; g.fillStyle = '#2a0f2e'; g.fillText('JC', 326, 466); g.fillStyle = goldGrad(g, 330, 470); g.fillText('JC', 320, 460);
    decoFrame(g, w, h);
  });
  return backTexC;
}

function helloTex() {
  return canvasTex(512, 300, (g, w, h) => {
    g.fillStyle = '#12103a'; g.fillRect(0, 0, w, h); setCond(g);
    g.font = COND(900, 92); g.fillStyle = '#ff3d8b'; g.fillText('SALUT !', 24, 104);
    g.font = COND(800, 44); g.fillStyle = '#35e0ff'; g.fillText("MOI C'EST JULES", 24, 160);
    g.font = '22px monospace'; g.fillStyle = '#f4e7d0'; g.fillText('> console.log("bienvenue")', 24, 220); g.fillText('> _', 24, 252);
  });
}

// ---------- portail réutilisable : disque de la v2 qui apparaît, tunnel derrière, étincelles qui restent ----------
const NOISE = `float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}`;
function tunnelMat() {
  return new THREE.ShaderMaterial({ side: THREE.BackSide, transparent: true, depthWrite: false, toneMapped: false, fog: false,
    uniforms: { t: { value: 0 }, op: { value: 0 }, cA: { value: new THREE.Color(PAL.portal[0]) }, cB: { value: new THREE.Color(PAL.portal[1]) }, cC: { value: new THREE.Color(PAL.portal[2]) } },
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `varying vec2 vUv; uniform float t, op; uniform vec3 cA,cB,cC; ${NOISE}
    void main(){ float sw=vUv.x*6.2832+vUv.y*9.-t*1.6; vec2 q=vec2(cos(sw),sin(sw))*1.5+vec2(0.,vUv.y*7.-t*2.2);
      float f=fbm(q); vec3 col=mix(cA,cB,smoothstep(.3,.7,f)); col=mix(col,cC,smoothstep(.55,.8,fbm(q*1.7+3.))*.85);
      col*=.62+.25*smoothstep(.6,1.,vUv.y); col*=.75+.5*smoothstep(.35,.75,fbm(q*2.3+t*.2)); gl_FragColor=vec4(col,op); }` });
}
function makeSparks(scene, N, col3) {
  const pos = new Float32Array(N * 3), cols = new Float32Array(N * 3), seeds = [];
  for (let i = 0; i < N; i++) { seeds.push({ a: rr(0, 7), sp: rr(.4, 1.6), ph: rnd(), y: rr(-1, 1) }); const c = new THREE.Color(col3[i % 3]).multiplyScalar(2.5); cols.set([c.r, c.g, c.b], i * 3); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  const tex = canvasTex(64, 64, (c) => { const r = c.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.3, 'rgba(255,255,255,.6)'); r.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = r; c.fillRect(0, 0, 64, 64); });
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.075, map: tex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false }));
  pts.frustumCulled = false; pts.userData.fixed = true; pts.visible = false; scene.add(pts); return { pts, pos, seeds };
}
// étincelles : elles jaillissent puis restent éparpillées autour de la porte (elles ne se regroupent plus)
function updSparks(S, c, w, hgt, spread, spawn, time) {
  const on = spawn > 0.01; S.pts.visible = on; if (!on) return;
  const out = spread * Math.min(1, spawn * 1.8);
  for (let i = 0; i < S.seeds.length; i++) { const q = S.seeds[i]; const k = (q.ph + time * 0.08 * q.sp) % 1; const a = q.a + time * q.sp * 0.25;
    const r = 0.2 + Math.sqrt(k) * out;
    S.pos[i * 3] = c.x + Math.cos(a) * r * w; S.pos[i * 3 + 1] = c.y + q.y * hgt * 0.5 + Math.sin(a) * r * 0.5; S.pos[i * 3 + 2] = c.z + k * out * 0.7 + Math.sin(time * q.sp + i) * 0.05; }
  S.pts.geometry.attributes.position.needsUpdate = true;
}
const easeOutBack = x => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
// ---------- compétences : trois objets qui ont un sens ----------
const SKILL = [];
function buildSkills() {
  const C = new THREE.Vector3(0, 0.4, -4), R = 5.0;
  const plinth = (pos, col) => { const top = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.7, 0.25, 9), toon('#4a2a7a', { rim: .4 })); top.position.copy(pos).add(V(0, -1.05, 0)); top.castShadow = top.receiveShadow = true; scene.add(top);
    const bot = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.6, 9), toon('#2a1a44', { rim: .8 })); bot.rotation.x = Math.PI; bot.position.copy(pos).add(V(0, -1.98, 0)); scene.add(bot);
    const l = new THREE.PointLight(new THREE.Color(col), 7, 6, 1.6); l.position.copy(pos).add(V(0, 0.8, 1.2)); scene.add(l); };
  const angles = [0.55, 1.75, 2.95];
  angles.forEach((a, i) => {
    const pos = V(C.x + Math.sin(a) * R, C.y + [0.2, 0.9, 1.6][i], C.z + Math.cos(a) * R);
    const g = new THREE.Group(); g.position.copy(pos); scene.add(g);
    if (i === 2) { // design + IA : palette, pinceau et étincelle
      const pal = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.07, 40), toon('#c9a98a', { rim: .3 })); pal.scale.z = 0.78; pal.rotation.x = 1.25; g.add(pal);
      ['#ff3d8b', '#35e0ff', '#ffd27a', '#2fae7a', '#8a5cff'].forEach((c, k) => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), toon(c, { rim: .4 })); b.scale.y = 0.45; const aa = k * 1.05 - 1.6; b.position.set(Math.cos(aa) * .48, Math.sin(aa) * .17 + .1, Math.sin(aa) * .38 * .0 + .05); b.position.applyAxisAngle(V(1, 0, 0), 1.1 - Math.PI / 2 + Math.PI / 2); g.add(b); });
      const br = new THREE.Group(); br.position.set(0.35, 0.35, 0.3); br.rotation.set(0.2, 0, -0.9); g.add(br);
      br.add(Object.assign(new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 1.5, 12), toon('#7a4b3a')), {}));
      const fer = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.22, 12), toon('#d8c8e0', { rim: 1 })); fer.position.y = 0.85; br.add(fer);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.3, 12), glow('#ff3d8b', 2.2)); tip.position.y = 1.1; br.add(tip);
      const st = new THREE.Shape(); for (let k = 0; k < 8; k++) { const r = k % 2 ? 0.09 : 0.36, a = k * Math.PI / 4 + Math.PI / 2; k ? st.lineTo(Math.cos(a) * r, Math.sin(a) * r) : st.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
      const star = new THREE.Mesh(new THREE.ExtrudeGeometry(st, { depth: 0.06, bevelEnabled: false }), glow('#ffd27a', 3)); star.position.set(-0.55, 0.75, 0.2); g.add(star); g.userData.spin = star;
      const star2 = star.clone(); star2.scale.setScalar(0.45); star2.position.set(-0.15, 1.05, 0.1); g.add(star2); g.userData.design = { pal, stars: [star, star2] }; g.traverse(o => { if (o.isMesh) o.userData.egg = 'sk-design'; });
    } else if (i === 0) { // front : fenêtre de navigateur
      const fr = box(1.9, 1.3, 0.08, toon('#1a1430', { rim: .9 }), 0, 0, 0, 0.06, g);
      const bar = box(1.9, 0.16, 0.09, toon('#2a2250'), 0, 0.57, 0.005, 0.04, g);
      ['#ff3d8b', '#ffd27a', '#35e0ff'].forEach((c, k) => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), glow(c, 2)); d.position.set(-0.85 + k * 0.1, 0.57, 0.06); g.add(d); });
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.04), new THREE.MeshBasicMaterial({ toneMapped: false, map: canvasTex(512, 296, (q, w, h) => { q.fillStyle = '#0f1238'; q.fillRect(0, 0, w, h); setCond(q); q.font = COND(900, 170); q.fillStyle = '#35e0ff'; q.textAlign = 'center'; q.fillText('</>', w / 2, 190); q.fillStyle = '#ff3d8b'; q.fillRect(150, 230, 120, 14); q.fillStyle = '#f4e7d0'; q.fillRect(290, 230, 80, 14); }) }));
      scr.material.color.setScalar(1.2); scr.position.set(0, -0.06, 0.05); g.add(scr); g.userData.front = { scr, tex0: scr.material.map, n: 0 }; g.traverse(o => { if (o.isMesh) o.userData.egg = 'sk-front'; });
    } else { // back : un serveur, son terminal, et des conteneurs Docker qui tournent autour
      const rack = new THREE.Group(); rack.position.set(0.15, -0.35, 0); g.add(rack);
      box(1.0, 1.5, 0.7, toon('#1c1630', { rim: .9 }), 0, 0, 0, 0.05, rack);
      const leds = [];
      for (let k = 0; k < 5; k++) { const y = 0.52 - k * 0.26; box(0.84, 0.18, 0.06, toon('#2e2654', { rim: .5 }), 0, y, 0.36, 0.02, rack);
        for (let j = 0; j < 6; j++) box(0.02, 0.12, 0.02, toon('#140a1e'), -0.15 + j * 0.06, y, 0.4, 0.004, rack);
        [0, 1].forEach(j => { const l = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8), glow(j ? '#ffd27a' : '#6be3a4', 3)); l.position.set(-0.33 + j * 0.08, y, 0.4); rack.add(l); leds.push(l); }); }
      rack.traverse(o => { if (o.isMesh) o.userData.egg = 'sk-back'; });
      // terminal
      const termTex = lines => canvasTex(512, 320, (q, w, h) => { q.fillStyle = '#0b0a1a'; q.fillRect(0, 0, w, h); q.fillStyle = '#231c44'; q.fillRect(0, 0, w, 34);
        ['#ff3d8b', '#ffd27a', '#6be3a4'].forEach((c, k) => { q.fillStyle = c; q.beginPath(); q.arc(22 + k * 22, 17, 7, 0, 7); q.fill(); });
        q.font = '600 24px ui-monospace, Menlo, monospace'; lines.forEach(([c, t], k) => { q.fillStyle = c; q.fillText(t, 20, 74 + k * 38); }); });
      const T1 = termTex([['#f4e7d0', '$ docker compose up -d'], ['#6be3a4', '✔ api    started'], ['#6be3a4', '✔ db     started'], ['#f4e7d0', '$ node server.js'], ['#35e0ff', '> listening on :3000'], ['#f4e7d0', '$ _']]);
      const T2 = termTex([['#f4e7d0', '$ docker ps'], ['#35e0ff', 'api   Up 3 hours'], ['#35e0ff', 'db    Up 3 hours'], ['#35e0ff', 'cache Up 3 hours'], ['#ffd27a', '> tout tourne, bonne nuit'], ['#f4e7d0', '$ _']]);
      const term = new THREE.Group(); term.position.set(0.1, 1.15, -0.1); term.rotation.set(-0.08, 0, 0.03); g.add(term);
      box(1.32, 0.86, 0.06, toon('#1a1430', { rim: .9 }), 0, 0, -0.04, 0.04, term);
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.24, 0.78), new THREE.MeshBasicMaterial({ map: T1, toneMapped: false })); scr.material.color.setScalar(1.25); term.add(scr);
      term.traverse(o => { if (o.isMesh) o.userData.egg = 'sk-back'; });
      // conteneurs en orbite
      const orbit = new THREE.Group(); orbit.position.set(0.15, -0.2, 0); g.add(orbit);
      ['#1fb8d6', '#ff3d8b', '#ffd27a', '#a77bff'].forEach((col, k) => { const c = new THREE.Group(); const a = k / 4 * Math.PI * 2; c.position.set(Math.cos(a) * 1.05, Math.sin(k * 1.7) * 0.35, Math.sin(a) * 0.75); c.rotation.y = -a; orbit.add(c);
        box(0.46, 0.22, 0.24, toon(col, { rim: .6 }), 0, 0, 0, 0.02, c); for (let j = 0; j < 5; j++) box(0.018, 0.17, 0.26, toon('#140a1e'), -0.17 + j * 0.085, 0, 0, 0.004, c);
        c.traverse(o => { if (o.isMesh) o.userData.egg = 'sk-back'; }); });
      // badge Node.js
      const hs = new THREE.Shape(); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + Math.PI / 6; k ? hs.lineTo(Math.cos(a) * .3, Math.sin(a) * .3) : hs.moveTo(Math.cos(a) * .3, Math.sin(a) * .3); }
      const hex = new THREE.Mesh(new THREE.ExtrudeGeometry(hs, { depth: 0.08, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 }), toon('#2fae7a', { rim: .8 })); hex.position.set(-0.7, 0.35, 0.45); g.add(hex);
      const js = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.26), new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false, map: canvasTex(256, 160, (q, w, h) => { setCond(q); q.font = COND(900, 120); q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillStyle = '#f4e7d0'; q.fillText('JS', w / 2, h / 2 + 6); }) })); js.position.set(0, 0, 0.13); hex.add(js);
      hex.traverse(o => { if (o.isMesh) o.userData.egg = 'sk-back'; });
      g.userData.back = { orbit, leds, scr, T1, T2, hex, boost: 0 };
    }
    plinth(pos, ['#ff3d8b', '#35e0ff', '#ffd27a'][i]);
    const out = V(Math.sin(a), 0, Math.cos(a)), side = V(Math.cos(a), 0, -Math.sin(a));
    const camP = pos.clone().add(out.clone().multiplyScalar(4.2)).add(side.clone().multiplyScalar(1.5)).add(V(0, 0.9, 0)); g.lookAt(camP.x, pos.y, camP.z); if (i === 2) g.rotateY(-0.4);
    SKILL.push({ g, q0: g.quaternion.clone(), pos, cam: pos.clone().add(out.clone().multiplyScalar(4.2)).add(side.clone().multiplyScalar(1.5)).add(V(0, 0.9, 0)), look: pos.clone().add(side.clone().multiplyScalar(1.7)).add(V(0, 0.15, 0)) });
  });
}

function buildSpaceDuck() {
  const S = SKILL[0], d = new THREE.Group(); d.position.copy(S.pos).lerp(S.cam, 0.45).add(new THREE.Vector3(0, 0.55, 0)); scene.add(d);
  const yM = toon('#ffd23f', { rim: .6 }); const body = new THREE.Mesh(new THREE.SphereGeometry(0.22, 18, 14), yM); body.scale.set(1.2, 0.85, 1); d.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), yM); head.position.set(0.16, 0.2, 0); d.add(head);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 10), toon('#ff7a3d')); beak.rotation.z = -Math.PI / 2; beak.position.set(0.32, 0.18, 0); d.add(beak);
  const helm = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 14), new THREE.MeshBasicMaterial({ color: 0x9fe8ff, transparent: true, opacity: 0.25, toneMapped: false })); helm.position.copy(head.position); d.add(helm);
  [-1, 1].forEach(k => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), toon('#140a1e')); e.position.set(0.25, 0.25, k * 0.07); d.add(e); });
  d.traverse(o => { if (o.isMesh) o.userData.egg = 'sduck'; }); d.lookAt(S.cam); d.rotateY(-1.2); d.scale.setScalar(0.6); SC.spaceDuck = d; d.userData.base = d.position.clone();
}
// ---------- construction ----------
const SC = {};
const ui = window.__ui;
const setProg = (v) => ui.loader(v);
const tick = () => new Promise(r => requestAnimationFrame(() => r()));
async function build() {
  setProg(0.04);
  try { await Promise.race([Promise.all(['900 extra-condensed 120px Archivo', '900 60px "Cinzel Decorative"', '700 22px "Cinzel"', '64px "Sedgwick Ave Display"'].map(f => document.fonts.load(f))), new Promise(r => setTimeout(r, 4000))]); } catch (e) {}
  setProg(0.1); await tick();
  DIR = 1; PAL = PALS[1];
  scene = new THREE.Scene(); scene.background = new THREE.Color(PAL.bg); scene.fog = new THREE.FogExp2(PAL.fog, 0.02);
  const room = buildRoom({ doorOpen: 0 }); SC.room = { scene, ...room };
  room.eggs.codeTex = room.eggs.screens.map(s => s.material.map); room.eggs.hello = helloTex();
  setProg(0.3); await tick();
  { const tun = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 5, 48, 1, true).rotateX(Math.PI / 2), tunnelMat()); tun.scale.set(1, 2.3, 1); tun.position.set(2.45, 1.04, -3.2 - 2.5); scene.add(tun); SC.room.tunnel = tun; }
  // étincelles qui jaillissent quand le portail apparaît dans la porte
  if (0) { const N = 420, pos = new Float32Array(N * 3), cols = new Float32Array(N * 3), seeds = [];
    const pal = [new THREE.Color(PAL.portal[0]), new THREE.Color(PAL.portal[1]), new THREE.Color(PAL.portal[2])];
    for (let i = 0; i < N; i++) { seeds.push({ a: rr(0, 7), sp: rr(.4, 1.6), ph: rnd(), y: rr(-1, 1) }); const c = pal[i % 3].clone().multiplyScalar(2.5); cols.set([c.r, c.g, c.b], i * 3); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    const tex = canvasTex(64, 64, (c) => { const r = c.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.3, 'rgba(255,255,255,.6)'); r.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = r; c.fillRect(0, 0, 64, 64); });
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.05, map: tex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false }));
    }
  SC.room.sparks = makeSparks(scene, 520, PAL.portal);
  {
    // zzz au-dessus de l'oreiller
    SC.room.zzz = [0, 1, 2].map(i => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: canvasTex(128, 128, (g, w, h) => { g.font = '110px "Sedgwick Ave Display"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = '#35e0ff'; g.shadowBlur = 16; g.fillStyle = '#35e0ff'; g.fillText('z', w / 2, h / 2); g.shadowBlur = 0; g.fillStyle = '#e9fbff'; g.fillText('z', w / 2 - 2, h / 2 - 2); }), transparent: true, depthWrite: false, toneMapped: false, fog: false })); sp.material.color.setScalar(1.5); sp.visible = false; scene.add(sp); return sp; });
  }
  setProg(0.45); await tick();
  scene = new THREE.Scene(); scene.background = new THREE.Color(PAL.bg); scene.fog = new THREE.FogExp2(PAL.fog, 0.035);
  const GZ = -32; const gal = buildGallery();
  // portail de sortie au bout de la galerie (comme en v2)
  // au bout : une porte qui flotte, elle s'ouvre et le portail apparaît dedans (même animation que la chambre)
  { const D = new THREE.Group(); D.position.set(0, 0.2, GZ); scene.add(D); const W2 = 1.7, H2 = 3.5;
    const fM = toon('#efe2cf', { rim: .8 }), wM = toon(PAL.wood, { rim: .4 });
    box(0.16, H2 + 0.16, 0.4, fM, -W2 / 2 - 0.08, 0, 0, 0.03, D); box(0.16, H2 + 0.16, 0.4, fM, W2 / 2 + 0.08, 0, 0, 0.03, D); box(W2 + 0.32, 0.16, 0.4, fM, 0, H2 / 2 + 0.08, 0, 0.03, D); box(W2 + 0.5, 0.2, 0.7, toon('#3b3560', { rim: .6 }), 0, -H2 / 2 - 0.1, 0.1, 0.05, D);
    const piv = new THREE.Group(); piv.position.set(-W2 / 2, 0, 0.05); D.add(piv); box(W2, H2, 0.12, wM, W2 / 2, 0, 0, 0.03, piv);
    box(W2 * 0.7, H2 * 0.32, 0.03, toon('#2a1a44'), W2 / 2, H2 * 0.2, 0.07, 0.02, piv); box(W2 * 0.7, H2 * 0.32, 0.03, toon('#2a1a44'), W2 / 2, -H2 * 0.2, 0.07, 0.02, piv);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 10), glow('#ffd27a', 2)); knob.position.set(W2 * 0.85, 0, 0.12); piv.add(knob);
    const pm = new THREE.Mesh(new THREE.PlaneGeometry(W2, H2), portalMat.clone()); pm.material.uniforms.spawn.value = 0; pm.position.z = -0.08; D.add(pm);
    const tun = new THREE.Mesh(new THREE.CylinderGeometry(W2 / 2, W2 / 2, 8, 48, 1, true).rotateX(Math.PI / 2), tunnelMat()); tun.scale.set(1, H2 / W2, 1); tun.position.z = -4.1; D.add(tun);
    const back = new THREE.Mesh(new THREE.PlaneGeometry(W2, H2), new THREE.MeshBasicMaterial({ color: 0x07040d, fog: false })); back.position.z = -0.12; D.add(back);
    const L = new THREE.PointLight(new THREE.Color(PAL.portal[0]), 0, 16, 1.3); L.position.set(0, 0, 2.5); D.add(L);
    SC.galDoor = { D, piv, pm, tun, back, L, sparks: makeSparks(scene, 600, PAL.portal) }; }
  SC.gallery = { scene, cards: gal.cards, faces: gal.cards.flatMap(c => [c.userData.face, c.userData.back]), fog: scene.fog.density };
  setProg(0.66); await tick();
  DIR = 3; PAL = PALS[3]; seed = 12345 + 3 * 77;
  scene = new THREE.Scene(); scene.background = new THREE.Color(PAL.bg); scene.fog = new THREE.FogExp2(PAL.fog, 0.022);
  buildSection(); buildSkills(); buildSpaceDuck(); SC.section = { scene }; scene.traverse(o => { if (o.userData.egg === 'orb') SC.orb = o; });
  DIR = 1; PAL = PALS[1];
  setProg(0.9); await tick();
}

// ---------- chemins caméra ----------
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const CR = pts => new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
const roomPos = CR([V(-1.7, 1.5, 2.3), V(-1.5, 1.55, 0.6), V(-1.25, 1.45, -0.8), V(0.1, 1.7, -0.3), V(1.5, 1.5, 0.4), V(2.42, 1.3, -0.5), V(2.45, 1.12, -2.2), V(2.45, 1.05, -3.0), V(2.45, 1.04, -4.2), V(2.45, 1.04, -6.0)]);
const roomLook = CR([V(-0.6, 1.3, -2.6), V(-1.3, 1.3, -2.6), V(-1.7, 1.15, -2.75), V(0.8, 1.35, -2.6), V(2.3, 1.25, -2.6), V(2.45, 1.1, -3.1), V(2.45, 1.06, -4.5), V(2.45, 1.04, -6), V(2.45, 1.04, -8), V(2.45, 1.04, -10)]);
const footPos = CR([V(0.4, 7.5, 0.6), V(1.8, 5.2, 2.0), V(1.4, 3.2, 2.6), V(0.3, 2.2, 2.85), V(-0.55, 1.75, 2.95)]);
const footLook = CR([V(-0.8, 0.3, 0.6), V(-1.6, 0.4, 1.2), V(-2.0, 0.6, 1.3), V(-1.95, 0.75, 0.45), V(-1.7, 0.85, 0.2)]);
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const clamp01 = x => Math.min(1, Math.max(0, x));
const RANGES = [['room', 0, 0.3], ['gallery', 0.3, 0.58], ['section', 0.58, 0.84], ['foot', 0.84, 1]];
const BOUNDS = [0.3, 0.58, 0.84];
// chambre : on marche jusqu'à la porte, on s'arrête, la porte s'ouvre, le portail apparaît, on passe
function roomU(t) { const H = 5 / 9; if (t < 0.55) return (t / 0.55) * H; if (t < 0.72) return H + (t - 0.55) / 0.17 * 0.02; const x = (t - 0.72) / 0.28; return H + 0.02 + (1 - H - 0.02) * Math.pow(x, 1.15); }
const tmpL = new THREE.Vector3();
let curKey = 'room', curT = 0, sectionPath = null;
const look = { yaw: 0, pitch: 0, ty: 0, tp: 0, k: 0 };
function place(p, time) {
  let key = 'room', t = 0;
  for (const [k, a, b] of RANGES) if (p >= a && p <= b) { key = k; t = (p - a) / (b - a); }
  let roll = 0; look.k = 0;
  if (key === 'room') {
    const u = roomU(t); camera.position.copy(roomPos.getPoint(u)); tmpL.copy(roomLook.getPoint(u)); camera.fov = 52 + Math.pow(sstep(0.8, 1, t), 2) * 28;
    SC.room.doorPivot.rotation.y = sstep(0.48, 0.6, t) * 1.35; roll = Math.sin(u * Math.PI) * 0.05 - Math.pow(sstep(0.84, 1, t), 2) * 0.9;
    roomPortal(sstep(0.56, 0.72, t), time);
    SC.room.ceiling.visible = true; scene = SC.room.scene; look.k = 1 - sstep(0.45, 0.55, t) * 0.8;
  } else if (key === 'gallery') {
    const calm = 1 - sstep(0.55, 0.74, t), dive = t > 0.74 ? (t - 0.74) / 0.26 : 0;
    const z = t < 0.62 ? 6 - t / 0.62 * 27 : t < 0.74 ? -21 - (t - 0.62) / 0.12 * 4 : -25 - Math.pow(dive, 1.1) * 15;
    const a = t * Math.PI * 3; camera.position.set(Math.cos(a) * 0.7 * calm, 0.2 + Math.sin(a) * 0.5 * calm, z);
    tmpL.set(Math.cos(a + 0.8) * 0.4 * calm, 0.2 + Math.sin(a + 0.8) * 0.3 * calm, z - 6);
    roll = -(t - 0.5) * Math.PI * 1.5 * calm; camera.fov = 58 - Math.sin(Math.min(t, .74) / .74 * Math.PI) * 6 + Math.pow(dive, 2) * 30; scene = SC.gallery.scene; look.k = 0.35 * (1 - sstep(0.7, 0.76, t));
    const G = SC.galDoor; G.piv.rotation.y = -sstep(0.6, 0.7, t) * 1.5; const sp = sstep(0.66, 0.77, t);
    G.pm.material.uniforms.spawn.value = sp > 0 ? easeOutBack(sp) : 0; G.pm.material.uniforms.t.value = time; G.tun.material.uniforms.t.value = time; G.tun.material.uniforms.op.value = sstep(0.5, 1, sp);
    G.back.visible = sp < 0.5; G.L.intensity = sp * 30; updSparks(G.sparks, _c1.set(0, 0.2, -31.9), 1.6, 3.5, 2.6, sp, time);
  } else if (key === 'section') {
    if (!sectionPath) { const S = SKILL; sectionPath = { pos: CR([V(-9, 10, 12), S[0].cam, S[1].cam, S[2].cam, V(0, 14, -16)]), look: CR([V(0, 0, -4), S[0].look, S[1].look, S[2].look, V(0, 6, -10)]) }; }
    // paliers : on ralentit sur chaque objet (0.2 / 0.5 / 0.8 du segment)
    const u = stepped(t);
    camera.position.copy(sectionPath.pos.getPoint(u)); tmpL.copy(sectionPath.look.getPoint(u));
    camera.fov = 46 + sstep(0.88, 1, t) * 20; roll = Math.sin(t * Math.PI * 3) * 0.06; scene = SC.section.scene; look.k = 0.4 * (1 - sstep(0.88, 0.95, t));
    SKILL.forEach((s, i) => { if (s.g.userData.spin) s.g.userData.spin.rotation.y = time * 1.2; s.g.quaternion.copy(s.q0).multiply(_q.setFromAxisAngle(_v.set(0, 0, 1), Math.sin(time * .7 + i) * 0.05)); s.g.position.y = s.pos.y + Math.sin(time * 1.1 + i) * 0.08; });
  } else {
    const e = ease(t); camera.position.copy(footPos.getPoint(e)); tmpL.copy(footLook.getPoint(e)); camera.fov = 55 - e * 5;
    SC.room.doorPivot.rotation.y = 0; SC.room.ceiling.visible = e > 0.85; roll = (1 - e) * 0.6; scene = SC.room.scene; roomPortal(0, time);
    sleep(sstep(0.7, 1, t), time); look.k = 0.5 * sstep(0.7, 1, t);
  }
  camera.position.x += Math.sin(time * 0.5) * 0.025; camera.position.y += Math.sin(time * 0.7) * 0.018;
  camera.aspect = W / H; camera.updateProjectionMatrix(); camera.lookAt(tmpL); camera.rotateZ(roll);
  if (look.k > 0.001) { camera.rotateY(look.yaw * look.k); camera.rotateX(look.pitch * look.k); }
  applyMouseFx(key === 'room' ? 1 - sstep(0.62, 0.74, t) : key === 'gallery' ? (1 - sstep(0.66, 0.76, t)) * 0.8 : key === 'section' ? 0.8 : 1);
  curKey = key; curT = t;
  return key;
}
// portail qui apparaît dans l'encadrement de la porte
function roomPortal(spawn, time) {
  const R = SC.room, m = R.portal.material; m.uniforms.spawn.value = spawn > 0 ? easeOutBack(spawn) : 0; m.uniforms.t.value = time;
  R.tunnel.material.uniforms.t.value = time; R.tunnel.material.uniforms.op.value = sstep(0.5, 1, spawn);
  R.pl.intensity = 1.2 + spawn * 6;
  updSparks(R.sparks, _c1.set(2.45, 1.04, -3.15), 1.5, 2.6, 2.4, spawn, time);
}
const _c1 = new THREE.Vector3();
// fin : on s'endort, la chambre s'assombrit et des zzz montent de l'oreiller
function sleep(k, time) {
  const R = SC.room, E = R.eggs;
  R.zzz.forEach((z, i) => { const c = ((time * 0.28 + i / 3) % 1); z.visible = k > 0.05; z.position.set(-2.35 + c * 0.6 + Math.sin(c * 6 + i) * 0.1, 0.95 + c * 0.9, 0.75 + c * 0.2); z.scale.setScalar((0.22 + c * 0.38) * k); z.material.opacity = Math.sin(c * Math.PI) * k; z.material.rotation = -0.3 + Math.sin(c * 4) * 0.2; });
  if (lampOn) E.lamp.light.intensity = 14 * (1 - k * 0.75);
  document.body.style.setProperty('--sleep', k.toFixed(3));
}
function updateSkills(dt, time) {
  const B = SKILL[1] && SKILL[1].g.userData.back; if (B) { B.boost *= Math.pow(0.4, dt); B.orbit.rotation.y += dt * (0.5 + B.boost * 5); B.hex.rotation.y = Math.sin(time * 0.8) * 0.5 + B.boost * time * 3;
    B.leds.forEach((l, i) => { l.visible = (Math.sin(time * (3 + i % 3) + i * 1.7) > -0.6) || B.boost > 0.3; }); }
  if (SC.spaceDuck) { const d = SC.spaceDuck; d.position.y = d.userData.base.y + Math.sin(time * 0.9) * 0.15; d.rotation.z = Math.sin(time * 0.6) * 0.2; }
}
// paliers dans la section : la caméra s'attarde sur chaque objet
function stepped(t) { const K = [0, 0.25, 0.5, 0.75, 1], at = [0, 0.2, 0.5, 0.8, 1]; for (let i = 0; i < 4; i++) if (t <= at[i + 1]) { const x = (t - at[i]) / (at[i + 1] - at[i]); const e = i === 0 ? x * x * (3 - 2 * x) : ease(x); return K[i] + (K[i + 1] - K[i]) * e; } return 1; }

// ---------- masque en éclats (BitcoinOS) ----------
const mask = document.getElementById('mask'); const mg = mask.getContext('2d');
const MDPR = Math.min(devicePixelRatio || 1, 2);
const INK = '#0d0916';
// Chaque scène a sa propre découpe, comme BitcoinOS : hexagone, diagonales « / », coupe presque horizontale, losange.
// Chaque éclat s'ouvre et se referme vers son propre point d'ancrage, avec un léger décalage entre éclats.
const LAYOUT = {
  room: s => { const c = 0.13 + 0.05 * s, L = 0.28 - 0.03 * s, R = 0.72 + 0.03 * s; return [
    { P: [[0, 0], [L, 0], [c, 0.5], [L, 1], [0, 1]], A: [0, 0.5] },
    { P: [[L, 0], [R, 0], [1 - c, 0.5], [R, 1], [L, 1], [c, 0.5]], A: [0.5, 0.5] },
    { P: [[R, 0], [1, 0], [1, 1], [R, 1], [1 - c, 0.5]], A: [1, 0.5] }]; },
  gallery: s => { const t1 = 0.5 + 0.08 * s, b1 = 0.16 + 0.08 * s, ry = 0.34 + 0.08 * s, bx = 0.7 - 0.05 * s; return [
    { P: [[0, 0], [t1, 0], [b1, 1], [0, 1]], A: [0, 0] },
    { P: [[t1, 0], [1, 0], [1, ry], [bx, 1], [b1, 1]], A: [1, 0] },
    { P: [[1, ry], [1, 1], [bx, 1]], A: [1, 1] }]; },
  section: s => { const yL = 0.6 + 0.06 * s, yR = 0.36 - 0.06 * s, mx = 0.58, my = yL + (yR - yL) * mx, bx = 0.46; return [
    { P: [[0, 0], [1, 0], [1, yR], [0, yL]], A: [0.5, 0] },
    { P: [[0, yL], [mx, my], [bx, 1], [0, 1]], A: [0, 1] },
    { P: [[mx, my], [1, yR], [1, 1], [bx, 1]], A: [1, 1] }]; },
  foot: s => { const c = 0.1 + 0.08 * s; return [
    { P: [[0, 0], [0.5, 0], [c, 0.5], [0, 0.5]], A: [0, 0] },
    { P: [[0.5, 0], [1, 0], [1, 0.5], [1 - c, 0.5]], A: [1, 0] },
    { P: [[0.5, 0], [1 - c, 0.5], [0.5, 1], [c, 0.5]], A: [0.5, 0.5] },
    { P: [[1, 0.5], [1, 1], [0.5, 1], [1 - c, 0.5]], A: [1, 1] },
    { P: [[0, 0.5], [c, 0.5], [0.5, 1], [0, 1]], A: [0, 1] }]; },
};
LAYOUT.portal = LAYOUT.room;
function shards(key, s, open) {
  const L = (LAYOUT[key] || LAYOUT.room)(s), n = L.length;
  return L.map(({ P, A }, i) => { const t = ease(clamp01((open - i * (0.3 / n)) / 0.7)); return P.map(([x, y]) => [A[0] + (x - A[0]) * t, A[1] + (y - A[1]) * t]); });
}
const polyArea = P => Math.abs(P.reduce((a, p, i) => { const q = P[(i + 1) % P.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
function roundPoly(g, pts, rad) {
  const n = pts.length; g.beginPath(); const d = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
  for (let i = 0; i < n; i++) { const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n]; const r = Math.min(rad, d(p1, p0) / 3, d(p1, p2) / 3);
    const u = d(p1, p0) || 1; const sx = p1[0] + (p0[0] - p1[0]) / u * r, sy = p1[1] + (p0[1] - p1[1]) / u * r; if (i === 0) g.moveTo(sx, sy); else g.lineTo(sx, sy); g.arcTo(p1[0], p1[1], p2[0], p2[1], r); }
  g.closePath();
}
function sizeMask() { mask.width = Math.round(innerWidth * MDPR); mask.height = Math.round(innerHeight * MDPR); }
function drawMask(key, s, open) {
  const w = mask.width, h = mask.height, inset = 6 * MDPR, rad = (innerWidth > 800 ? 30 : 16) * MDPR;
  mg.globalCompositeOperation = 'source-over'; mg.clearRect(0, 0, w, h); mg.fillStyle = INK; mg.fillRect(0, 0, w, h);
  if (open <= 0.001) return;
  const polys = shards(key, s, open).map(P => P.map(([x, y]) => [inset + x * (w - inset * 2), inset + y * (h - inset * 2)]));
  mg.globalCompositeOperation = 'destination-out';
  for (const P of polys) { if (polyArea(P) < 4) continue; roundPoly(mg, P, rad); mg.fill(); }
  mg.globalCompositeOperation = 'source-over'; mg.strokeStyle = INK; mg.lineWidth = 5 * MDPR;
  for (const P of polys) { if (polyArea(P) < 4) continue; roundPoly(mg, P, rad); mg.stroke(); }
}
const WIN = 0.035;
function maskState(p) { let open = 1; BOUNDS.forEach(b => { const d = p - b; if (Math.abs(d) < WIN) open = Math.min(open, Math.abs(d) / WIN); }); return open; }

// ---------- effet curseur repris de BitcoinOS ----------
// leur code : souris normalisée (-0.5..0.5) lissée avec 1-exp(-6·dt), vitesse lissée avec 1-exp(-3·dt) ;
// la caméra est décalée à l'opposé du curseur (×-0.1) et penche selon la vitesse horizontale (rotation z = vitesse X).
const ptrN = new THREE.Vector2(), mouseS = new THREE.Vector2(), mousePrev = new THREE.Vector2(); let velX = 0, velY = 0;
function updateMouseFx(dt) { mousePrev.copy(mouseS); mouseS.lerp(ptrN, 1 - Math.exp(-6 * dt)); const k = 1 - Math.exp(-3 * dt); velX += (mouseS.x - mousePrev.x - velX) * k; velY += (mouseS.y - mousePrev.y - velY) * k; }
function applyMouseFx(amount) { if (amount <= 0) return; const K = 0.24 * amount; camera.translateX(-mouseS.x * K); camera.translateY(mouseS.y * K * 0.8); camera.rotateZ(-velX * 3 * amount); }
// ---------- pointeur : regarder autour (chambre), survol des cartes et des easter eggs ----------
const ray = new THREE.Raycaster(); const ndc = new THREE.Vector2(9, 9);
const cursorEl = document.getElementById('cur'), curLabel = cursorEl.querySelector('b');
let drag = null, moved = 0, lastPtr = { x: 0, y: 0 };
addEventListener('pointermove', e => {
  ptrN.set(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5);
  ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); lastPtr = { x: e.clientX, y: e.clientY };
  cursorEl.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; cursorEl.classList.toggle('flip', e.clientX > innerWidth - 320);
  if (drag) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; moved += Math.abs(dx) + Math.abs(dy); drag.x = e.clientX; drag.y = e.clientY;
    look.ty = THREE.MathUtils.clamp(look.ty + dx * 0.006, -2.6, 2.6); look.tp = THREE.MathUtils.clamp(look.tp + dy * 0.004, -0.55, 0.45); if (moved > 6) { document.body.classList.add('dragging'); ui.looked(); } }
}, { passive: true });
addEventListener('pointerdown', e => { moved = 0; if (e.button !== 0 || e.target.closest('a,button,.panel,.top,.ticks') || fly.card || window.__legalOpen()) return; if (look.k > 0.05) drag = { x: e.clientX, y: e.clientY }; });
addEventListener('pointerup', () => { drag = null; document.body.classList.remove('dragging'); });
// sur mobile, le stage laisse passer le scroll vertical ; on garde le glisser horizontal pour regarder

let hover = null, eggHover = null, sel = null, dim = 0;
const fly = { card: null, k: 0, dir: 0, from: null };
const _v = new THREE.Vector3(), _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion();
const TGT = { pos: new THREE.Vector3(), quat: new THREE.Quaternion(), scale: 1 };
function cardTarget(out) {
  const d = 2.6, halfH = d * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), halfW = halfH * camera.aspect, mobile = innerWidth < 800;
  const s = mobile ? Math.min(0.62, halfH * 0.42) : Math.min(1.05, halfH * 0.56);
  out.pos.set(mobile ? 0 : -halfW * 0.42, mobile ? halfH * 0.42 : -0.02, -d).applyMatrix4(camera.matrixWorld); out.quat.copy(camera.quaternion); out.scale = s; return out;
}
function openCard(card) {
  if (fly.card) return; fly.card = card; fly.k = 0; fly.dir = 1;
  fly.from = { pos: card.position.clone(), quat: card.quaternion.clone(), scale: card.scale.x };
  card.userData.face.material.fog = false; card.userData.face.material.needsUpdate = true;
  sel = card.userData.pi; ui.openProject(sel); document.documentElement.classList.add('lock');
}
function closeCard(then) { if (!fly.card || fly.dir === -1) return; fly.dir = -1; fly.then = then; ui.closeProject(); }
function nearestCard(pi) { let best = null, bd = 1e9; for (const c of SC.gallery.cards) { if (c.userData.pi !== pi) continue; const d = c.position.distanceTo(camera.position) + (c.position.z > camera.position.z ? 50 : 0); if (d < bd) { bd = d; best = c; } } return best; }
window.__gal = { close: () => closeCard(), step: d => { const next = (sel + d + PROJECTS.length) % PROJECTS.length; closeCard(() => { const c = nearestCard(next); if (c) openCard(c); }); } };

// easter eggs
const EGGS = { 'sk-front': 'ctrl + s', 'sk-back': 'ça tourne !', 'sk-design': "merci l'IA", sduck: 'coin ? coin !', orb: 'ding', lamp: 'clic', screen: 'hello world', duck: 'coin coin', chair: 'wiiii', mug: 'café ?', poster: 'retourné', lights: 'ambiance', console: 'player 2' };
const anims = [];
const tween = (dur, fn) => anims.push({ t: 0, dur, fn });
const bubble = txt => { const b = document.createElement('div'); b.className = 'bub'; b.textContent = txt; b.style.left = lastPtr.x + 'px'; b.style.top = lastPtr.y - 20 + 'px'; document.body.appendChild(b); setTimeout(() => b.remove(), 1900); };
const lightSets = [['#ff3d8b', '#35e0ff'], ['#ffd27a', '#ff7a3d'], ['#8a5cff', '#2fae7a'], ['#f4e7d0', '#ffd27a']]; let lightIdx = 0;
let lampOn = true, helloOn = false;
const frontTex = [null, canvasTex(512, 296, (q, w, h) => { q.fillStyle = '#ff3d8b'; q.fillRect(0, 0, w, h); setCond(q); q.font = COND(900, 150); q.textAlign = 'center'; q.fillStyle = '#140a1e'; q.fillText('HELLO', w / 2, 200); }),
  canvasTex(512, 296, (q, w, h) => { q.fillStyle = '#0f1238'; q.fillRect(0, 0, w, h); q.strokeStyle = '#ffd27a'; q.lineWidth = 18; q.lineCap = 'round'; q.beginPath(); q.arc(w / 2, h / 2 + 10, 70, 0.2, Math.PI - 0.2); q.stroke(); q.fillStyle = '#ffd27a'; q.beginPath(); q.arc(w / 2 - 50, 110, 16, 0, 7); q.arc(w / 2 + 50, 110, 16, 0, 7); q.fill(); })];
const upTo = (o, k) => { while (o && !o.userData[k]) o = o.parent; return o; };
function triggerEgg(kind, obj) {
  const E = SC.room.eggs; bubble(EGGS[kind]);
  if (kind === 'sk-front') { const g = upTo(obj, 'front'), F = g.userData.front; F.n = (F.n + 1) % 3; F.scr.material.map = F.n ? frontTex[F.n] : F.tex0; F.scr.material.needsUpdate = true; const p0 = g.position.y; tween(0.5, k => { g.position.y = p0 + Math.sin(k * Math.PI) * 0.2; }); }
  if (kind === 'sk-back') { const B = upTo(obj, 'back').userData.back; B.boost = 1; B.alt = !B.alt; B.scr.material.map = B.alt ? B.T2 : B.T1; B.scr.material.needsUpdate = true; }
  if (kind === 'sk-design') { const D = upTo(obj, 'design').userData.design; const cols = ['#ff3d8b', '#35e0ff', '#ffd27a', '#2fae7a', '#8a5cff', '#ff7a3d']; upTo(obj, 'design').traverse(o => { if (o.isMesh && o.geometry.type === 'SphereGeometry') o.material.color.set(cols[Math.floor(rnd() * cols.length)]); }); D.stars.forEach(st => { const r0 = st.rotation.z; tween(0.9, k => { st.rotation.z = r0 + ease(k) * Math.PI * 2; st.scale.setScalar((st === D.stars[0] ? 1 : 0.45) * (1 + Math.sin(k * Math.PI) * 0.5)); }); }); }
  if (kind === 'sduck') { const d = SC.spaceDuck, r0 = d.rotation.y; tween(1.1, k => { d.rotation.y = r0 + ease(k) * Math.PI * 4; d.scale.setScalar(0.6 * (1 + Math.sin(k * Math.PI) * 0.4)); }); }
  if (kind === 'orb') { const o = SC.orb, c0 = o.material.color.clone(), cols = ['#ff3d8b', '#35e0ff', '#6be3a4', '#ffcc4d']; const nc = new THREE.Color(cols[(cols.indexOf('#' + c0.getHexString()) + 1) % cols.length] || cols[0]); tween(0.7, k => { o.scale.setScalar(1 + Math.sin(k * Math.PI) * 0.35); o.material.color.copy(c0).lerp(nc, k); }); }
  if (kind === 'lamp') { lampOn = !lampOn; E.lamp.light.intensity = lampOn ? 14 : 0; E.lamp.bulb.material.color.set(PAL.lamp).multiplyScalar(lampOn ? 5 : 0.3); }
  if (kind === 'screen') { helloOn = !helloOn; E.screens.forEach((s, i) => { s.material.map = helloOn ? E.hello : E.codeTex[i]; s.material.needsUpdate = true; }); }
  if (kind === 'duck') { const d = E.duck, y0 = 0.8, r0 = d.rotation.y; tween(0.9, k => { d.position.y = y0 + Math.sin(k * Math.PI) * 0.35; d.rotation.y = r0 + ease(k) * Math.PI * 2; d.scale.setScalar(1 + Math.sin(k * Math.PI * 3) * 0.12 * (1 - k)); }); }
  if (kind === 'chair') { const c = E.chair, r0 = c.rotation.y; tween(1.4, k => { c.rotation.y = r0 + ease(k) * Math.PI * 2; }); }
  if (kind === 'mug') { const m = E.mug, y0 = m.position.y; tween(0.6, k => { m.position.y = y0 + Math.sin(k * Math.PI) * 0.15; m.rotation.z = Math.sin(k * Math.PI * 4) * 0.3 * (1 - k); }); }
  if (kind === 'poster') { const p = obj; if (p.userData.flipping) return; p.userData.flipping = true; const r0 = p.rotation.y, p0 = p.position.clone(), n = new THREE.Vector3(0, 0, 1).applyEuler(p.rotation), hw = (p.geometry.parameters.width || 0.5) / 2 + 0.03;
    // le poster se décolle du mur pendant qu'il tourne, puis se repose : il ne traverse plus la cloison
    tween(0.9, k => { const a = ease(k) * Math.PI; p.rotation.y = r0 + a; p.position.copy(p0).addScaledVector(n, Math.sin(a) * hw); if (k >= 1) { p.position.copy(p0); p.userData.flipping = false; } }); }
  if (kind === 'lights') { lightIdx = (lightIdx + 1) % lightSets.length; E.bulbM.forEach((m, i) => m.color.set(lightSets[lightIdx][i]).multiplyScalar(4)); }
  if (kind === 'console') { E.console.forEach((m, i) => { const base = m.material.color.clone(); tween(1.2, k => { m.material.color.copy(base).multiplyScalar(1 + Math.abs(Math.sin(k * Math.PI * 6 + i)) * 2 * (1 - k)); }); }); }
}
function eggOf(o) { while (o) { if (o.userData && o.userData.egg) return o; o = o.parent; } return null; }
addEventListener('click', e => {
  if (e.target.closest('a,button,.panel')) return;
  if (moved > 6) { moved = 0; return; }
  if (fly.card) { if (fly.dir === 1 && fly.k > 0.9) closeCard(); return; }
  if (hover) { openCard(hover); return; }
  if (eggHover) triggerEgg(eggHover.userData.egg, eggHover);
});
addEventListener('keydown', e => { if (e.key === 'Escape') closeCard(); });
function updatePointer(dt, time, open) {
  let h = null, eg = null;
  const can = open > 0.6 && !(drag && moved > 6) && !window.__legalOpen();
  if (can && scene === SC.gallery.scene && !fly.card && curT < 0.72) { ray.setFromCamera(ndc, camera); const hit = ray.intersectObjects(SC.gallery.faces, false)[0]; if (hit && hit.distance < 22) h = hit.object.userData.card; }
  if (can && ((scene === SC.room.scene && (curKey === 'room' ? curT < 0.5 : curT > 0.75)) || (scene === SC.section.scene && curT < 0.9))) { ray.setFromCamera(ndc, camera); const hit = ray.intersectObjects(scene.children, true).find(x => x.object.isMesh && x.object.visible && !x.object.material.transparent || (x.object.isMesh && eggOf(x.object))); if (hit) eg = eggOf(hit.object); }
  if (h !== hover) { hover = h; document.body.classList.toggle('hovering', !!h); curLabel.textContent = h ? PROJECTS[h.userData.pi].short : ''; }
  if (eg !== eggHover) { eggHover = eg; document.body.classList.toggle('egg', !!eg); }
}
function updateGallery(dt, time) {
  for (const c of SC.gallery.cards) { if (c === fly.card) continue; const tgt = c === hover ? 1.14 : 1; c.scale.setScalar(c.scale.x + (tgt - c.scale.x) * Math.min(1, dt * 10)); }
  if (fly.card) {
    fly.k = clamp01(fly.k + dt / (fly.dir === 1 ? 1.25 : 0.95) * fly.dir);
    const e = ease(fly.k); cardTarget(TGT); const c = fly.card, F = fly.from;
    c.position.lerpVectors(F.pos, TGT.pos, e); c.position.y += Math.sin(e * Math.PI) * 0.7;
    _q.copy(F.quat).slerp(TGT.quat, e); _q2.setFromAxisAngle(_v.set(0, 1, 0), (1 - e) * Math.PI * 2 * fly.dir * (e > 0 ? 1 : 0)); c.quaternion.copy(_q).multiply(_q2);
    c.scale.setScalar(F.scale + (TGT.scale - F.scale) * e);
    if (fly.dir === -1 && fly.k <= 0) { c.position.copy(F.pos); c.quaternion.copy(F.quat); c.scale.setScalar(F.scale); c.userData.face.material.fog = true; c.userData.face.material.needsUpdate = true; const then = fly.then; fly.card = null; fly.dir = 0; sel = null; document.documentElement.classList.remove('lock'); if (then) then(); }
  }
  const dimT = fly.card ? (fly.dir === 1 ? 1 : fly.k) : 0; dim += (dimT - dim) * Math.min(1, dt * 6);
  SC.gallery.scene.fog.density = SC.gallery.fog + dim * 0.12;
}

// ---------- composer ----------
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(new THREE.Scene(), camera); composer.addPass(renderPass);
const paint = new ShaderPass(Painterly); composer.addPass(paint);
const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.8, 0.6, 0.78); composer.addPass(bloom);
composer.addPass(new OutputPass());
function resize() { W = innerWidth; H = innerHeight; renderer.setSize(W, H); composer.setSize(W, H); paint.uniforms.res.value.set(W * renderer.getPixelRatio(), H * renderer.getPixelRatio()); sizeMask(); }
addEventListener('resize', resize);

// ---------- paliers : autour de chaque étape, le scroll « tient » la caméra pour qu'on ait le temps de lire ----------
const PL = 0.016;
function warp(x) {
  const S = window.__STOPS || [], K = [];
  S.forEach((v, i) => { const a = i === 0 ? 0 : v - PL, b = i === S.length - 1 ? 1 : v + PL; K.push([a, v], [b, v]); });
  if (!K.length) return x; if (x <= K[0][0]) return K[0][1];
  for (let i = 0; i < K.length - 1; i++) { const [x0, y0] = K[i], [x1, y1] = K[i + 1]; if (x <= x1) return x1 === x0 ? y1 : y0 + (y1 - y0) * (x - x0) / (x1 - x0); }
  return 1;
}
// ---------- boucle ----------
const ZERO3 = new THREE.Vector3(), TINT = new THREE.Vector3(...PALS[1].shadow);
let pCur = 0, intro = 0, started = false;
const clock = new THREE.Clock(); let last = 0;
function frame() {
  const time = clock.getElapsedTime(); const dt = Math.min(0.05, time - last); last = time;
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const locked = fly.card || window.__legalOpen();
  const pTarget = locked ? pCur : warp(clamp01(scrollY / max));
  // scroll amorti, sans aimantation : on ne revient jamais en arrière tout seul
  pCur += (pTarget - pCur) * Math.min(1, dt * 5.5); if (Q.has('snap')) pCur = pTarget; if (Math.abs(pTarget - pCur) < 1e-5) pCur = pTarget;
  look.yaw += (look.ty - look.yaw) * Math.min(1, dt * 6); look.pitch += (look.tp - look.pitch) * Math.min(1, dt * 6);
  if (!drag && curKey !== 'room') { look.ty *= 0.97; look.tp *= 0.97; }
  portalMat.uniforms.t.value = time;
  updateMouseFx(dt); const key = place(pCur, time); if (key !== 'foot') document.body.style.setProperty('--sleep', 0);
  scene.traverse(o => { if (o.isPoints && !o.userData.fixed) { o.rotation.y = time * 0.02; o.position.y = Math.sin(time * 0.3) * 0.1; } });
  if (scene === SC.gallery.scene) { scene.children.forEach(o => { if (o.isMesh && o.geometry.type === 'OctahedronGeometry') { o.rotation.x += 0.004; o.rotation.y += 0.006; } }); }
  for (let i = anims.length - 1; i >= 0; i--) { const a = anims[i]; a.t += dt; const k = clamp01(a.t / a.dur); a.fn(k); if (k >= 1) anims.splice(i, 1); }
  const msOpen = maskState(pCur);
  intro = Math.min(1, intro + dt / 1.9);
  const open = Math.min(msOpen, started ? ease(intro) : 0);
  updatePointer(dt, time, open);
  if (scene === SC.gallery.scene) updateGallery(dt, time);
  if (scene === SC.section.scene) updateSkills(dt, time);
  paint.uniforms.shadowTint.value.copy(TINT); 
  renderPass.scene = scene; composer.render();
  drawMask(key, curT, open);
  ui.update(pCur, open);
  requestAnimationFrame(frame);
}
(async () => {
  const t0 = performance.now();
  sizeMask(); drawMask('room', 0, 0);
  await build(); resize();
  place(0, 0); renderPass.scene = scene; composer.render(); await tick();
  const wait = Math.max(0, 1800 - (performance.now() - t0));
  let v = 0.9; const iv = setInterval(() => { v = Math.min(1, v + 0.02); setProg(v); }, 40);
  setTimeout(() => { clearInterval(iv); setProg(1); ui.ready(); started = true; if (Q.has('snap')) intro = 1; document.title = 'Jules Crevoisier · Développeur web et designer UI à Troyes'; frame(); }, wait + 300);
})();
