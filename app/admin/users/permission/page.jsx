"use client";

import React, { useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PermissionsTab from './_components/PermissionsTab.jsx';
import RolePermissionsTab from './_components/RolePermissionsTab.jsx';
import PermissionGroupsTab from './_components/PermissionGroupsTab.jsx';
import RolesTab from './_components/RolesTab.jsx';

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
          <Tab label="Roles" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Role Permissions" id="tab-2" aria-controls="tabpanel-2" />
          <Tab label="Permission Groups" id="tab-3" aria-controls="tabpanel-3" />
        </Tabs>
      </Box>
      <div role="tabpanel" hidden={activeTab !== 0} id="tabpanel-0" aria-labelledby="tab-0">
        {activeTab === 0 && <PermissionsTab />}
      </div>

      <div role="tabpanel" hidden={activeTab !== 1} id="tabpanel-1" aria-labelledby="tab-1">
        {activeTab === 1 && <RolesTab />}
      </div>

      <div role="tabpanel" hidden={activeTab !== 2} id="tabpanel-2" aria-labelledby="tab-2">
        {activeTab === 2 && <RolePermissionsTab />}
      </div>
      
      <div role="tabpanel" hidden={activeTab !== 3} id="tabpanel-3" aria-labelledby="tab-3">
        {activeTab === 3 && <PermissionGroupsTab />}
      </div>
    </div>
  );
}
