import React from 'react';

export default function Slider({label, min, max, val, setVal}) {
    return (<div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input type="range" min={min} max={max} step={1} className="w-full" value={val}
               onChange={e => setVal(+e.target.value)}/>
    </div>);
}