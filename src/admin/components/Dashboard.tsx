import React, { useState, useEffect } from 'react';
import { ApiClient } from 'adminjs';
import { Box, H2, Text, Icon, Illustration } from '@adminjs/design-system';

const api = new ApiClient();

const Dashboard: React.FC<any> = (props) => {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    api.getDashboard().then((response) => {
      setData(response.data);
    }).catch((error) => {
      console.error('Error fetching dashboard data:', error);
    });
  }, []);

  return (
    <Box variant="grey" padding="xl">
      <Box variant="white" padding="xl" boxShadow="card" textAlign="center">
        <H2>Welcome to E-Shop</H2>
        <Text variant="lg" mb="xl">{data?.role === 'admin' ? 'System Summary & Insights' : 'Order Summary'}</Text>

        <Box display="flex" flexDirection="row" justifyContent="center" flexWrap="wrap">
          {/* Total Users Card - Shown only for admin */}
          {data?.role === 'admin' && (
            <Box variant="white" p="lg" m="sm" border="1px solid #e0e0e0" borderRadius="lg" width="200px">
              <Icon icon="User" size={32} color="primary100" />
              <H2 mt="md">{data?.totalUsers || 0}</H2>
              <Text color="grey60">Total Users</Text>
            </Box>
          )}
          {data?.role === 'admin' && (
          <Box variant="white" p="xl" m="md" boxShadow="card" borderRadius="lg" width="250px" textAlign="center" borderTop="4px solid #2ecc71">
            <Icon icon="DollarSign" size={32} color="success" />
            <H2 mt="md">${data?.totalRevenue}</H2>
            <Text color="grey60">Total Revenue</Text>
          </Box>
        )}

          {/* Total Orders Card */}
          <Box variant="white" p="lg" m="sm" border="1px solid #e0e0e0" borderRadius="lg" width="200px">
            <Icon icon="ShoppingCart" size={32} color="primary100" />
            <H2 mt="md">{data?.role === 'admin' ? (data?.totalOrders || 0) : (data?.myTotalOrders || 0)}</H2>
            <Text color="grey60">{data?.role === 'admin' ? "Total Orders" : "My Orders"}</Text>
          </Box>
        </Box>

        {data?.message && (
          <Box mt="xl">
            <Text variant="sm" italic color="grey40">{data.message}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;