import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import StatusBadge from '../../components/common/StatusBadge';
import Breadcrumb from '../../components/common/Breadcrumb';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import api from '../../services/api';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('units');
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSubmittingUnit, setIsSubmittingUnit] = useState(false);
  const [newUnit, setNewUnit] = useState({ unitNumber: '', floorNumber: '', baseRent: '' });

  const fetchPropertyData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [propRes, unitsRes] = await Promise.all([
        api.properties.getById(id),
        api.units.getAll(id),
      ]);
      setProperty(propRes.data || propRes);
      setUnits(unitsRes.data || unitsRes || []);
    } catch (err) {
      setError(err.message || 'Failed to load property details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPropertyData();
  }, [id]);

  const handleAddUnit = async (e) => {
    e.preventDefault();
    if (!newUnit.unitNumber || !newUnit.floorNumber || !newUnit.baseRent) return;
    setIsSubmittingUnit(true);
    try {
      await api.units.create(id, {
        unitNumber: newUnit.unitNumber,
        floorNumber: newUnit.floorNumber,
        baseRent: newUnit.baseRent,
        status: 'VACANT',
      });
      setIsAddUnitOpen(false);
      setNewUnit({ unitNumber: '', floorNumber: '', baseRent: '' });
      setToastMessage('New unit created successfully.');
      await fetchPropertyData();
    } catch (err) {
      setToastMessage(`Failed to create unit: ${err.message}`);
    } finally {
      setIsSubmittingUnit(false);
    }
  };

  if (isLoading) return <LoadingState label="Loading property details..." />;
  if (error || !property) {
    return (
      <ErrorState
        title="Property not found"
        message={error || 'Unable to find this property.'}
        onRetry={fetchPropertyData}
      />
    );
  }

  return (
    <div className="property-details-page">
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Breadcrumb
          items={[
            { label: 'Properties', href: '/owner/properties' },
            { label: property.name },
          ]}
        />
      </div>

      <div className="property-details-hero">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text)' }}>
              {property.name}
            </h1>
            <StatusBadge status={property.status || 'Active'} />
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
            <Icon name="map-pin" size={14} style={{ display: 'inline', marginRight: '4px' }} />
            {property.address}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button
            variant="primary"
            icon={<Icon name="plus" size={16} />}
            onClick={() => setIsAddUnitOpen(true)}
          >
            Add Unit
          </Button>
        </div>
      </div>

      <div className="admin-summary-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <StatCard
          title="Total Units"
          value={property.totalUnits ?? units.length}
          iconName="building"
          iconColor="blue"
        />
        <StatCard
          title="Occupied Units"
          value={property.occupiedUnits ?? units.filter((u) => u.status === 'OCCUPIED').length}
          iconName="users"
          iconColor="green"
        />
        <StatCard
          title="Vacant Units"
          value={property.vacantUnits ?? units.filter((u) => u.status === 'VACANT').length}
          iconName="home"
          iconColor={(property.vacantUnits ?? 0) > 0 ? 'orange' : 'green'}
        />
        <StatCard
          title="Occupancy Rate"
          value={`${property.occupancyRate ?? 0}%`}
          iconName="bar-chart-2"
          iconColor="purple"
        />
      </div>

      <div className="owner-tabs">
        <button
          type="button"
          className={`owner-tab-btn ${activeTab === 'units' ? 'active' : ''}`}
          onClick={() => setActiveTab('units')}
        >
          <Icon name="home" size={16} />
          Units ({units.length})
        </button>
        <button
          type="button"
          className={`owner-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Icon name="file-text" size={16} />
          Overview
        </button>
      </div>

      {activeTab === 'units' && (
        <Card title={`${property.name} Unit Directory`}>
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Floor</th>
                  <th>Tenant</th>
                  <th className="table th--right">Rent</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {units.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700, color: 'var(--color-text)' }}>{u.unitNumber}</td>
                    <td className="table td--muted">Floor {u.floorNumber}</td>
                    <td>{u.currentTenant?.name || u.leases?.[0]?.tenant?.name || '—'}</td>
                    <td className="table td--right" style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      ৳{Number(u.baseRent).toLocaleString()}
                    </td>
                    <td>
                      <StatusBadge status={u.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'overview' && (
        <Card title="Building Specifications">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', padding: 'var(--space-2)' }}>
            <div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Year Built</span>
              <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{property.yearBuilt || 'N/A'}</div>
            </div>
            <div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Property Type</span>
              <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{property.propertyType || 'Residential'}</div>
            </div>
            <div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Occupancy Rate</span>
              <div style={{ fontWeight: 600, color: 'var(--color-success-dark)' }}>{property.occupancyRate || 0}%</div>
            </div>
            <div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Primary Management</span>
              <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>BuildSync Automated</div>
            </div>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isAddUnitOpen}
        onClose={() => setIsAddUnitOpen(false)}
        title={`Add Unit to ${property.name}`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddUnitOpen(false)} disabled={isSubmittingUnit}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddUnit} loading={isSubmittingUnit}>
              Save Unit
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddUnit}>
          <FormGroup label="Unit Number / Identifier" required>
            <Input
              placeholder="e.g. 9A"
              value={newUnit.unitNumber}
              onChange={(e) => setNewUnit({ ...newUnit, unitNumber: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup label="Floor" required>
            <Input
              placeholder="e.g. 9"
              value={newUnit.floorNumber}
              onChange={(e) => setNewUnit({ ...newUnit, floorNumber: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup label="Base Rent (৳)" required>
            <Input
              type="number"
              placeholder="25000"
              value={newUnit.baseRent}
              onChange={(e) => setNewUnit({ ...newUnit, baseRent: e.target.value })}
              required
            />
          </FormGroup>
        </form>
      </Modal>

      {toastMessage && (
        <Toast
          type="info"
          title="Property Details"
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
