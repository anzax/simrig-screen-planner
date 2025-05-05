import React from 'react';

export default function Input({label, value, setValue}) {
    return (<div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input type="number" className="w-full border rounded p-2" value={value}
               onChange={e => setValue(parseFloat(e.target.value) || 0)}/>
    </div>);
}