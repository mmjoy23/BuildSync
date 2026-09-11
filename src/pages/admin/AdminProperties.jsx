import React from 'react';
import AdminDirectoryPage from './components/AdminDirectoryPage';
import { adminProperties } from '../../data/adminPortalData';
export default function AdminProperties() { return <AdminDirectoryPage type="properties" data={adminProperties} />; }
