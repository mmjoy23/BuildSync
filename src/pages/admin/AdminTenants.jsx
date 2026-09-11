import React from 'react';
import AdminDirectoryPage from './components/AdminDirectoryPage';
import { adminTenants } from '../../data/adminPortalData';
export default function AdminTenants() { return <AdminDirectoryPage type="tenants" data={adminTenants} />; }
