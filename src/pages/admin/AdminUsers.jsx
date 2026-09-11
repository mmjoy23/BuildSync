import React from 'react';
import AdminDirectoryPage from './components/AdminDirectoryPage';
import { adminUsers } from '../../data/adminPortalData';
export default function AdminUsers() { return <AdminDirectoryPage type="users" data={adminUsers} />; }
