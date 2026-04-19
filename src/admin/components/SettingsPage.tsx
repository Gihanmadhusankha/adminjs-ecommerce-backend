import React, { useState, useEffect } from 'react';
import { Box, H2, Text, FormGroup, Input, Button, Label } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';

const api = new ApiClient();

const SettingsPage: React.FC<any> = () => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPage({ pageName: 'Settings' }).then((res: any) => {
      if (res.data && res.data.settings) {
        setSettings(res.data.settings);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Text>Loading...</Text>;

  return (
    <Box variant="grey" padding="xl">
      <Box variant="white" padding="xl" boxShadow="card" borderRadius="lg">
        <H2 mb="xl">System Settings</H2>
        
        <FormGroup>
          <Label>Store Name</Label>
          <Input defaultValue={settings?.STORE_NAME || 'My E-Shop'} width={1/2} />
        </FormGroup>

        <FormGroup mt="lg">
          <Label>Contact Email</Label>
          <Input defaultValue={settings?.CONTACT_EMAIL || 'admin@eshop.com'} width={1/2} />
        </FormGroup>

        <FormGroup mt="lg">
          <Label>Currency Symbol</Label>
          <Input defaultValue={settings?.CURRENCY || '$'} width={1/4} />
        </FormGroup>

        <Button mt="xl" variant="primary">
          Save Configuration
        </Button>
        
        <Text mt="lg" color="grey40" variant="sm">
          * Note: Only system administrators can modify these global settings.
        </Text>
      </Box>
    </Box>
  );
};

export default SettingsPage;