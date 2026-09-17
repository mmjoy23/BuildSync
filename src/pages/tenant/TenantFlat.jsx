import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { TenantFeedback } from './components/TenantPageTools';
import api from '../../services/api';

export default function TenantFlat() {
  const [lease, setLease] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchTenantLease = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.leases.getTenantLease();
      setLease(res.data || res);
    } catch (err) {
      setError(err.message || 'Failed to load lease details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantLease();
  }, []);

  if (isLoading) return <LoadingState label="Loading flat and lease details..." />;

  if (error) {
    return (
      <ErrorState
        title="Unable to load flat details"
        message={error}
        onRetry={fetchTenantLease}
      />
    );
  }

  if (!lease) {
    return (
      <EmptyState
        title="No Active Lease Found"
        description="You do not have an active lease assigned at this time. Please contact your property manager."
      />
    );
  }

  const unit = lease.unit || {};
  const property = unit.property || {};
  const owner = property.owner || {};
  const parking = (lease.parkingSlots && lease.parkingSlots[0]) || null;

  return (
    <div className="tenant-page">
      <PageHeader
        title="My Flat"
        description="Your home, charges, parking, and property contact details."
      />

      <div className="tenant-flat-hero">
        <div>
          <span className="tenant-flat-kicker">{property.name || 'Property'}</span>
          <h2>Unit {unit.unitNumber || '—'}</h2>
          <p>
            <Icon name="map-pin" size={15} /> {property.address || '—'}
          </p>
        </div>
        <StatusBadge status={lease.status === 'ACTIVE' ? 'Occupied' : lease.status} />
      </div>

      <div className="tenant-info-grid">
        <Card title="Flat Information">
          <div className="tenant-detail-grid">
            {[
              ['Building', property.name || '—'],
              ['Unit', unit.unitNumber || '—'],
              ['Floor', unit.floorNumber ? `Floor ${unit.floorNumber}` : '—'],
              ['Unit Type', property.propertyType || 'Residential'],
              ['Bedrooms', unit.bedrooms ?? '—'],
              ['Bathrooms', unit.bathrooms ?? '—'],
              ['Approx. Area', unit.areaSqft ? `${unit.areaSqft} sqft` : '—'],
              ['Lease Start', lease.startDate ? new Date(lease.startDate).toLocaleDateString() : '—'],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Current Agreement Charges">
          <div className="tenant-charge-list">
            <div>
              <span>Agreed Monthly Rent</span>
              <strong>৳{Number(lease.agreedRent || 0).toLocaleString()}</strong>
            </div>
            <div className="tenant-charge-total">
              <span>Base Monthly Rent</span>
              <strong>৳{Number(lease.agreedRent || 0).toLocaleString()}</strong>
            </div>
          </div>
        </Card>

        <Card title="Assigned Parking">
          <div className="tenant-parking-callout">
            <Icon name="car" size={24} />
            <div>
              <strong>{parking ? parking.slotLabel : 'No slot assigned'}</strong>
              <span>{parking ? parking.vehicleInfo || 'Vehicle registered' : 'Contact owner for parking options'}</span>
            </div>
            <StatusBadge status={parking ? 'Assigned' : 'Vacant'} />
          </div>
        </Card>

        <Card title="Property Contact">
          <div className="tenant-contact-card">
            <div>
              <span>Owner / Property Manager</span>
              <strong>{owner.name || 'Property Management'}</strong>
              <small>{owner.email || owner.phone || 'Contact via BuildSync'}</small>
            </div>
            <div className="tenant-contact-actions">
              <Button
                size="sm"
                variant="secondary"
                icon={<Icon name="mail" size={15} />}
                onClick={() => setFeedback(`Messaging ${owner.name || 'owner'}...`)}
              >
                Message Owner
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <TenantFeedback message={feedback} onClose={() => setFeedback(null)} />
    </div>
  );
}
