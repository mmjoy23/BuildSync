import React, { useState } from 'react';
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
import { propertiesList } from '../../data/ownerPortalData';

/**
 * PropertyDetails
 * Frontend-only property details experience:
 * - Property Overview, Units, Tenants, Financials, Maintenance tabs.
 * - Units table (Unit, Floor, Tenant, Rent, Status).
 */
export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('units');
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Find property by ID or default to the first one
  const property = propertiesList.find((p) => p.id === id) || propertiesList[0];

  return (
    <div className="property-details-page">
      {/* Breadcrumb */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Breadcrumb
          items={[
            { label: 'Properties', href: '/owner/properties' },
            { label: property.name },
          ]}
        />
      </div>

      {/* Hero Header */}
      <div className="property-details-hero">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text)' }}>
              {property.name}
            </h1>
            <StatusBadge status={property.status} />
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
            <Icon name="map-pin" size={14} style={{ display: 'inline', marginRight: '4px' }} />
            {property.address}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button
            variant="secondary"
            icon={<Icon name="edit" size={16} />}
            onClick={() => setToastMessage(`Editing ${property.name} details...`)}
          >
            Edit Info
          </Button>
          <Button
            variant="primary"
            icon={<Icon name="plus" size={16} />}
            onClick={() => setIsAddUnitOpen(true)}
          >
            Add Unit
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="admin-summary-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <StatCard
          title="Total Units"
          value={property.totalUnits}
          iconName="building"
          iconColor="blue"
        />
        <StatCard
          title="Occupied Units"
          value={property.occupiedUnits}
          iconName="users"
          iconColor="green"
        />
        <StatCard
          title="Vacant Units"
          value={property.vacantUnits}
          iconName="home"
          iconColor={property.vacantUnits > 0 ? 'orange' : 'green'}
        />
        <StatCard
          title="Monthly Income"
          value={property.monthlyIncome}
          iconName="dollar-sign"
          iconColor="purple"
        />
      </div>

      {/* Tabs */}
      <div className="owner-tabs">
        <button
          type="button"
          className={`owner-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Icon name="file-text" size={16} />
          Overview
        </button>
        <button
          type="button"
          className={`owner-tab-btn ${activeTab === 'units' ? 'active' : ''}`}
          onClick={() => setActiveTab('units')}
        >
          <Icon name="home" size={16} />
          Units ({property.units ? property.units.length : 0})
        </button>
        <button
          type="button"
          className={`owner-tab-btn ${activeTab === 'financials' ? 'active' : ''}`}
          onClick={() => setActiveTab('financials')}
        >
          <Icon name="credit-card" size={16} />
          Financials
        </button>
        <button
          type="button"
          className={`owner-tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
          onClick={() => setActiveTab('maintenance')}
        >
          <Icon name="wrench" size={16} />
          Maintenance
        </button>
      </div>

      {/* Tab Contents */}
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
                  <th className="table th--right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {property.units && property.units.map((u, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700, color: 'var(--color-text)' }}>{u.unit}</td>
                    <td className="table td--muted">Floor {u.floor}</td>
                    <td>{u.tenant}</td>
                    <td className="table td--right" style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {u.rent}
                    </td>
                    <td>
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="table td--right">
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => setToastMessage(`Managing Unit ${u.unit}...`)}
                      >
                        Manage
                      </Button>
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
              <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{property.yearBuilt}</div>
            </div>
            <div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Property Type</span>
              <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{property.propertyType}</div>
            </div>
            <div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Occupancy Rate</span>
              <div style={{ fontWeight: 600, color: 'var(--color-success-dark)' }}>{property.occupancyRate}%</div>
            </div>
            <div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Primary Management</span>
              <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>BuildSync Automated</div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'financials' && (
        <Card title="Revenue & Financial Summary">
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
            Projected monthly billings for {property.name} stand at <strong>{property.monthlyIncome}</strong> across active unit contracts.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Link to="/owner/billing" className="btn btn--primary btn--sm">
              Open Billing Manager →
            </Link>
          </div>
        </Card>
      )}

      {activeTab === 'maintenance' && (
        <Card title="Active Maintenance for Property">
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
            {property.maintenanceUnits} unit is currently under scheduled maintenance checks.
          </p>
          <Link to="/owner/maintenance" className="btn btn--secondary btn--sm">
            View Maintenance Tickets →
          </Link>
        </Card>
      )}

      {/* Add Unit Modal */}
      <Modal
        isOpen={isAddUnitOpen}
        onClose={() => setIsAddUnitOpen(false)}
        title={`Add Unit to ${property.name}`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddUnitOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { setIsAddUnitOpen(false); setToastMessage('New unit created.'); }}>
              Save Unit
            </Button>
          </>
        }
      >
        <FormGroup label="Unit Number / Identifier" required>
          <Input placeholder="e.g. 9A" />
        </FormGroup>
        <FormGroup label="Floor" required>
          <Input type="number" placeholder="9" />
        </FormGroup>
        <FormGroup label="Target Rent (৳)" required>
          <Input placeholder="25,000" />
        </FormGroup>
      </Modal>

      {/* Toast Feedback */}
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
