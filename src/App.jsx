import React, { useState, useMemo } from "react";

// Triple-Screen Planner for Sim-Racing
// ------------------------------------
// v16 – renamed flat total width to floor space width for desk footprint planning
// --------------------------------------------------------------
export default function App() {
  /* ---------- Inputs ---------- */
  const [diagIn, setDiagIn]   = useState(32);
  const [ratio,  setRatio]    = useState("16:9");
  const [distCm, setDistCm]   = useState(60);
  const [bezelCm,setBezelCm]  = useState(0);

  /* ---------- Helpers ---------- */
  const cm2in = cm => cm / 2.54;
  const in2cm = inch => inch * 2.54;

  /* ---------- Rig constants ---------- */
  const RIG_W_CM = 60;
  const RIG_L_CM = 150;
  const HEAD_OFFSET_CM = 10;

  /* ---------- Geometry ---------- */
  const data = useMemo(() => {
    const d      = cm2in(distCm);
    const bezel  = cm2in(bezelCm);
    const ar     = ratio === "16:9" ? { w: 16, h: 9 } : { w: 21, h: 9 };
    const diagFac= Math.hypot(ar.w, ar.h);
    const W      = diagIn * (ar.w / diagFac);
    const H      = diagIn * (ar.h / diagFac);
    const a      = W / 2 + bezel;

    // side screen angle
    const x_c    = (W * d * d) / (d * d + a * a);
    const y_c    = (a * x_c - d * d) / d;
    const u_x    = 2 * (x_c - a);
    const u_y    = 2 * (y_c + d);
    const sideAngleDeg = Math.abs(Math.atan2(u_y, u_x)) * 180 / Math.PI;

    // horizontal FOV (fixed)
    const hFOVrad = 2 * Math.atan((W / 2) / d);
    const hFOVdeg = hFOVrad * 180 / Math.PI * 3;

    // vertical FOV
    const vFOVdeg = 2 * Math.atan((H / 2) / d) * 180 / Math.PI;

    // total width between outer edges of side screens
    const pivotR = { x: a, y: -d }, pivotL = { x: -a, y: -d };
    const uR     = { x: u_x, y: u_y }, uL = { x: -u_x, y: u_y };
    const outerR = { x: pivotR.x + uR.x, y: pivotR.y + uR.y };
    const outerL = { x: pivotL.x + uL.x, y: pivotL.y + uL.y };
    const totalWidthIn = outerR.x - outerL.x;
    const totalWidthCm = in2cm(totalWidthIn);

    return { sideAngleDeg, hFOVdeg, vFOVdeg,
      cm: { distance: distCm, bezel: bezelCm, totalWidth: totalWidthCm },
      geom: { pivotL, pivotR, uL, uR }
    };
  }, [diagIn, ratio, distCm, bezelCm]);

  /* ---------- SVG layout ---------- */
  const view = useMemo(() => {
    const scale = 8;
    const { pivotL, pivotR, uL, uR } = data.geom;
    const endL = { x: pivotL.x + uL.x, y: pivotL.y + uL.y };
    const endR = { x: pivotR.x + uR.x, y: pivotR.y + uR.y };

    // bounds from screens & eye
    const pts = [pivotL, pivotR, endL, endR, { x: 0, y: 0 }];
    const minX = Math.min(...pts.map(p => p.x)), maxX = Math.max(...pts.map(p => p.x));
    const minY = Math.min(...pts.map(p => p.y)), maxY = Math.max(...pts.map(p => p.y));
    const pad = 10;
    const tx = x => (x - minX) * scale + pad;
    const ty = y => (y - minY) * scale + pad;

    // rig footprint under screens
    const rigW = cm2in(RIG_W_CM), rigL = cm2in(RIG_L_CM), halfW = rigW / 2;
    const rigFrontY = -(rigL - cm2in(HEAD_OFFSET_CM));
    const rigRect = { x: tx(-halfW), y: ty(rigFrontY), w: rigW * scale, h: rigL * scale };

    return { widthPx: (maxX - minX) * scale + pad * 2,
      heightPx: (maxY - minY) * scale + pad * 2,
      head: { cx: tx(0), cy: ty(0), r: 20 },
      lines: [
        { x1: tx(pivotL.x), y1: ty(pivotL.y), x2: tx(endL.x), y2: ty(endL.y) },
        { x1: tx(pivotR.x), y1: ty(pivotR.y), x2: tx(endR.x), y2: ty(endR.y) },
        { x1: tx(pivotL.x), y1: ty(pivotL.y), x2: tx(pivotR.x), y2: ty(pivotR.y) }
      ],
      rig: rigRect
    };
  }, [data.geom]);

  /* ---------- UI ---------- */
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold">Triple‑Screen Planner <span className="text-sm font-normal">(Sim‑Racing)</span></h1>

      <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4 items-start">
        <Slider label={`Screen size (in): ${diagIn}`} min={17} max={77} val={diagIn} setVal={setDiagIn}/>
        <div>
          <label className="block text-sm font-medium mb-1">Aspect ratio</label>
          <select className="w-full border rounded p-2" value={ratio} onChange={e => setRatio(e.target.value)}>
            <option value="16:9">16×9</option><option value="21:9">21×9</option>
          </select>
        </div>
        <Slider label={`Eye‑to‑screen (cm): ${distCm}`} min={50} max={150} val={distCm} setVal={setDistCm}/>
        <Input label="Bezel (cm)" value={bezelCm} setValue={setBezelCm}/>
      </div>

      <div className="grid sm:grid-cols-6 gap-4 text-center">
        <Card v={`${data.sideAngleDeg.toFixed(1)}°`} l="Side screen angle"/>
        <Card v={`${data.hFOVdeg.toFixed(1)}°`} l="Horizontal FOV"/>
        <Card v={`${data.vFOVdeg.toFixed(1)}°`} l="Vertical FOV"/>
        <Card v={`${data.cm.distance.toFixed(1)} cm`} l="Eye‑to‑screen"/>
        <Card v={`${data.cm.bezel.toFixed(1)} cm`} l="Bezel size"/>
        <Card v={`${data.cm.totalWidth.toFixed(1)} cm`} l="Total width"/>
      </div>

      <div className="bg-white rounded shadow p-2 overflow-auto" style={{ maxHeight: '70vh' }}>
        <svg width={view.widthPx} height={view.heightPx}>
          <rect x={view.rig.x} y={view.rig.y} width={view.rig.w} height={view.rig.h} fill="#CBD5E0" fillOpacity={0.4}/>
          {view.lines.map((l, i) => (<line key={i} {...l} stroke="#000" strokeWidth={4} strokeLinecap="round"/>))}
          <circle {...view.head} fill="none" stroke="#EF4444" strokeWidth={3}/>
        </svg>
      </div>

      <div className="bg-gray-50 p-4 rounded text-sm text-gray-700 space-y-2">
        <p>Use the sliders to dial in your actual setup—screen diagonal, aspect ratio, eye-to-screen distance (measure from your eyes to the centre of your main screen), and bezel size. The planner then finds the perfect angle so distances to all screen edges are the same.</p>
        <p><strong>Horizontal FOV</strong> shows your in-game side-to-side field of view, while <strong>Vertical FOV</strong> tells you how much screen height you cover—useful for seeing your dash and brake markers.</p>
        <p><strong>Total width</strong> is the straight-line distance between the outer edges of your side screens, so you know exactly how much floor space to reserve.</p>
        <p>The <strong>light-grey box</strong> represents a standard sim cockpit: 60 cm × 150 cm with your head (red circle) 10 cm from the back edge of the rig.</p>
      </div>

      <div className="text-center text-sm text-gray-500 pt-4">
        Built with 🏎️🏁. <a href="https://github.com/anzax/triple-screen-planner" className="underline hover:text-blue-600" target="_blank" rel="noopener noreferrer">View on GitHub</a>. Found a bug or have feedback? <a href="https://github.com/anzax/triple-screen-planner/issues" className="underline hover:text-blue-600" target="_blank" rel="noopener noreferrer">Open an issue</a>.
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */
function Slider({label,min,max,val,setVal}){
  return (<div><label className="block text-sm font-medium mb-1">{label}</label>
    <input type="range" min={min} max={max} step={1} className="w-full" value={val} onChange={e=>setVal(+e.target.value)}/></div>);
}
function Input({label,value,setValue}){
  return (<div><label className="block text-sm font-medium mb-1">{label}</label>
    <input type="number" className="w-full border rounded p-2" value={value} onChange={e=>setValue(parseFloat(e.target.value)||0)}/></div>);
}
function Card({v,l}){return(<div className="bg-gray-100 rounded p-4 shadow flex flex-col items-center"><div className="text-xl font-semibold leading-none">{v}</div><div className="text-sm text-gray-600 mt-1">{l}</div></div>);}