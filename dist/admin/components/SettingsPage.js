import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, H2, Text, FormGroup, Input, Button, Label } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';
const api = new ApiClient();
const SettingsPage = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.getPage({ pageName: 'Settings' }).then((res) => {
            if (res.data && res.data.settings) {
                setSettings(res.data.settings);
            }
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);
    if (loading)
        return _jsx(Text, { children: "Loading..." });
    return (_jsx(Box, { variant: "grey", padding: "xl", children: _jsxs(Box, { variant: "white", padding: "xl", boxShadow: "card", borderRadius: "lg", children: [_jsx(H2, { mb: "xl", children: "System Settings" }), _jsxs(FormGroup, { children: [_jsx(Label, { children: "Store Name" }), _jsx(Input, { defaultValue: settings?.STORE_NAME || 'My E-Shop', width: 1 / 2 })] }), _jsxs(FormGroup, { mt: "lg", children: [_jsx(Label, { children: "Contact Email" }), _jsx(Input, { defaultValue: settings?.CONTACT_EMAIL || 'admin@eshop.com', width: 1 / 2 })] }), _jsxs(FormGroup, { mt: "lg", children: [_jsx(Label, { children: "Currency Symbol" }), _jsx(Input, { defaultValue: settings?.CURRENCY || '$', width: 1 / 4 })] }), _jsx(Button, { mt: "xl", variant: "primary", children: "Save Configuration" }), _jsx(Text, { mt: "lg", color: "grey40", variant: "sm", children: "* Note: Only system administrators can modify these global settings." })] }) }));
};
export default SettingsPage;
