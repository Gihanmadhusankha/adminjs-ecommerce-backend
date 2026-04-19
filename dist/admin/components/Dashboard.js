import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { ApiClient } from 'adminjs';
import { Box, H2, Text, Icon } from '@adminjs/design-system';
const api = new ApiClient();
const Dashboard = (props) => {
    const [data, setData] = useState({});
    useEffect(() => {
        api.getDashboard().then((response) => {
            setData(response.data);
        }).catch((error) => {
            console.error('Error fetching dashboard data:', error);
        });
    }, []);
    return (_jsx(Box, { variant: "grey", padding: "xl", children: _jsxs(Box, { variant: "white", padding: "xl", boxShadow: "card", textAlign: "center", children: [_jsx(H2, { children: "Welcome to E-Shop" }), _jsx(Text, { variant: "lg", mb: "xl", children: data?.role === 'admin' ? 'System Summary & Insights' : 'Order Summary' }), _jsxs(Box, { display: "flex", flexDirection: "row", justifyContent: "center", flexWrap: "wrap", children: [data?.role === 'admin' && (_jsxs(Box, { variant: "white", p: "lg", m: "sm", border: "1px solid #e0e0e0", borderRadius: "lg", width: "200px", children: [_jsx(Icon, { icon: "User", size: 32, color: "primary100" }), _jsx(H2, { mt: "md", children: data?.totalUsers || 0 }), _jsx(Text, { color: "grey60", children: "Total Users" })] })), _jsxs(Box, { variant: "white", p: "lg", m: "sm", border: "1px solid #e0e0e0", borderRadius: "lg", width: "200px", children: [_jsx(Icon, { icon: "ShoppingCart", size: 32, color: "primary100" }), _jsx(H2, { mt: "md", children: data?.role === 'admin' ? (data?.totalOrders || 0) : (data?.myTotalOrders || 0) }), _jsx(Text, { color: "grey60", children: data?.role === 'admin' ? "Total Orders" : "My Orders" })] })] }), data?.message && (_jsx(Box, { mt: "xl", children: _jsx(Text, { variant: "sm", italic: true, color: "grey40", children: data.message }) }))] }) }));
};
export default Dashboard;
