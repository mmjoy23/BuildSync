import React, { useEffect, useState } from 'react';
import AdminDirectoryPage from './components/AdminDirectoryPage';
import { adminProperties } from '../../data/adminPortalData';
import api from '../../services/api';

export default function AdminProperties() {
  const [properties, setProperties] = useState(adminProperties);

  useEffect(() => {
    let isMounted = true;
    async function loadProperties() {
      try {
        const res = await api.properties.getAll();
        const list = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
        if (isMounted && list.length > 0) {
          // Format backend properties to match AdminDirectoryPage schema
          const formatted = list.map((p) => ({
            id: p.id,
            name: p.name,
            address: p.address,
            owner: p.owner?.name || 'Owner',
            units: p.totalUnits ?? (p.units ? p.units.length : 0),
            occupied: p.occupiedUnits ?? 0,
            vacant: p.vacantUnits ?? 0,
            status: p.status || 'Active',
            created: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recent',
          }));
          setProperties(formatted);
        }
      } catch {
        // fallback gracefully to existing data if network/session unready
      }
    }
    loadProperties();
    return () => { isMounted = false; };
  }, []);

  return <AdminDirectoryPage type="properties" data={properties} />;
}
