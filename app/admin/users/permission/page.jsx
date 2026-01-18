"use client";

import React, { useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PermissionsTab from './_components/PermissionsTab.jsx';
import RolePermissionsTab from './_components/RolePermissionsTab.jsx';

export default function PermissionPage() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Permissions Management</h1>
        <p className="text-sm text-zinc-600 mt-1">Manage permissions and role permissions</p>
      </div>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="permission tabs">
          <Tab label="Permissions" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Role Permissions" id="tab-1" aria-controls="tabpanel-1" />
        </Tabs>
      </Box>

      <div role="tabpanel" hidden={activeTab !== 0} id="tabpanel-0" aria-labelledby="tab-0">
        {activeTab === 0 && <PermissionsTab />}
      </div>

      <div role="tabpanel" hidden={activeTab !== 1} id="tabpanel-1" aria-labelledby="tab-1">
        {activeTab === 1 && <RolePermissionsTab />}
      </div>
    </div>
  );
}
