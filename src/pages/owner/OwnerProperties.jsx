import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import SearchBar from '../../components/common/SearchBar';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';
import { propertiesList } from '../../data/ownerPortalData';

/**
 * OwnerProperties
 * Complete property management page displaying property cards, occupancy metrics,
 * quick actions, search/filter, and Add Property modal.
 */
export default function OwnerProperties() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const filteredProperties = propertiesList.filter((prop) => {
    const matchesSearch =
      prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prop.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setIsAddModalOpen(false);
    setToastMessage('Property successfully created and added to directory.');
  };

  return (
    <div className="owner-properties-page">
      {/* 1. Header */}
      <PageHeader
        title="My Properties"
        description="Manage your properties, units, occupancy and property information."
        actions={
          <Button
            variant="primary"
            icon={<Icon name="plus" size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Property
          </Button>
        }
      />

      {/* 2. Toolbar: Search & Filters */}
      <div className="owner-toolbar">
        <div className="owner-toolbar__search-group">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by property name or address..."
          />
          <div style={{ width: '180px' }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'maintenance', label: 'Maintenance' },
              ]}
            />
          </div>
        </div>

        <div className="owner-toolbar__actions">
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            Showing {filteredProperties.length} of {propertiesList.length} properties
          </span>
        </div>
      </div>

      {/* 3. Property Cards Grid */}
      <div className="property-cards-grid">
        {filteredProperties.map((prop) => (
          <div key={prop.id} className="property-card">
            <div className="property-card__header">
              <div>
                <h3 className="property-card__name">{prop.name}</h3>
                <div className="property-card__address">
                  <Icon name="map-pin" size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  {prop.address}
                </div>
              </div>
              <StatusBadge status={prop.status} />
            </div>

            <div className="property-card__body">
              <div className="property-card__metrics">
                <div>
                  <div className="property-card__metric-val">{prop.totalUnits}</div>
                  <div className="property-card__metric-lbl">Total Units</div>
                </div>
                <div>
                  <div className="property-card__metric-val" style={{ color: 'var(--color-success-dark)' }}>
                    {prop.occupiedUnits}
                  </div>
                  <div className="property-card__metric-lbl">Occupied</div>
                </div>
                <div>
                  <div className="property-card__metric-val" style={{ color: prop.vacantUnits > 0 ? 'var(--color-warning-dark)' : 'var(--color-text-muted)' }}>
                    {prop.vacantUnits}
                  </div>
                  <div className="property-card__metric-lbl">Vacant</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-sm)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Est. Monthly Revenue:</span>
                <span style={{ fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
                  {prop.monthlyIncome}
                </span>
              </div>
            </div>

            <div className="property-card__footer">
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                {prop.occupancyRate}% Occupancy
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Button
                  size="xs"
                  variant="secondary"
                  onClick={() => navigate(`/owner/properties/${prop.id}`)}
                >
                  View Details
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setToastMessage(`Editing ${prop.name}...`)}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Property Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Property"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddSubmit}>
              Create Property
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit}>
          <FormGroup label="Property Title" required>
            <Input placeholder="e.g. Lotus Grandeur" required />
          </FormGroup>
          <FormGroup label="Full Address" required>
            <Input placeholder="House 14, Road 7, Dhanmondi, Dhaka" required />
          </FormGroup>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <FormGroup label="Total Units" required>
              <Input type="number" placeholder="28" required />
            </FormGroup>
            <FormGroup label="Property Type">
              <Select
                options={[
                  { value: 'residential', label: 'Residential' },
                  { value: 'commercial', label: 'Commercial' },
                  { value: 'mixed', label: 'Mixed-Use' },
                ]}
              />
            </FormGroup>
          </div>
        </form>
      </Modal>

      {/* Feedback Toast */}
      {toastMessage && (
        <Toast
          type="info"
          title="Properties"
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
