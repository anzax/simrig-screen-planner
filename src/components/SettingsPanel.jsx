import React from 'react';
import Slider from './Slider';

export default function SettingsPanel({ diagIn, setDiagIn, ratio, setRatio, distCm, setDistCm, bezelMm, setBezelMm }) {
    return (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4 items-start">
            <Slider label={`Screen size (in): ${diagIn}`} min={17} max={77} val={diagIn} setVal={setDiagIn}/>
            <div>
                <label className="block text-sm font-medium mb-1">Aspect ratio</label>
                <select className="w-full border rounded p-2" value={ratio}
                        onChange={e => setRatio(e.target.value)}>
                    <option value="16:9">16×9</option>
                    <option value="21:9">21×9</option>
                </select>
            </div>
            <Slider label={`Eye‑to‑screen (cm): ${distCm}`} min={50} max={150} val={distCm} setVal={setDistCm}/>
            <Slider label={`Bezel (mm): ${bezelMm}`} min={0} max={50} val={bezelMm} setVal={setBezelMm}/>
        </div>
    );
}