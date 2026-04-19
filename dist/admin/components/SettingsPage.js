import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const SettingsPage = (props) => {
    const { data } = props;
    const initialSettings = (data && data.settings) || [];
    const [items, setItems] = useState(initialSettings.map((s) => ({ key: s.key, value: s.value, description: s.description })));
    const updateValue = (idx, value) => {
        const copy = [...items];
        copy[idx].value = value;
        setItems(copy);
    };
    const submit = async () => {
        const res = await fetch('/admin/api/pages/Settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ settings: items }),
        });
        const resData = await res.json();
        if (resData && resData.settings) {
            setItems(resData.settings);
        }
        alert('Settings saved!');
    };
    return (_jsxs("div", { style: { padding: 20 }, children: [_jsx("h1", { children: "Settings Configuration" }), _jsx("div", { children: items.map((s, idx) => (_jsxs("div", { style: { marginBottom: 15, padding: 10, background: '#fff', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }, children: [_jsxs("div", { style: { marginBottom: 5 }, children: [_jsx("strong", { children: s.key }), " ", _jsx("span", { style: { color: '#888', fontSize: '0.85em' }, children: s.description })] }), _jsx("div", { children: _jsx("input", { style: { width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }, value: s.value || '', onChange: (e) => updateValue(idx, e.target.value) }) })] }, s.key || idx))) }), items.length > 0 ? (_jsx("button", { onClick: submit, style: { padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }, children: "Save All Settings" })) : (_jsx("p", { children: "No settings found." }))] }));
};
export default SettingsPage;
