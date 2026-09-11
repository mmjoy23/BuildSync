import React from 'react';
import AdminDirectoryPage from './components/AdminDirectoryPage';
import { adminOwners } from '../../data/adminPortalData';
export default function AdminOwners() { return <AdminDirectoryPage type="owners" data={adminOwners} />; }
