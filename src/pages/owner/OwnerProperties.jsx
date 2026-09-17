import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import SearchBar from '../../components/common/SearchBar';
import Select from '../../components/common/Select';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import api from '../../services/api';

export default function OwnerProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProp, setNewProp] = useState({
    name: '',
    address: '',
    propertyType: 'Residential',
  });

  const fetchProperties = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.properties.getAll();
      const list = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
      setProperties(list);
    } catch (err) {
      setError(err.message || 'Failed to load properties.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      (prop.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prop.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || (prop.status || '').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newProp.name || !newProp.address) return;
    setIsSubmitting(true);
    try {
      await api.properties.create({
        name: newProp.name,
        address: newProp.address,
        propertyType: newProp.propertyType,
      });
      setIsAddModalOpen(false);
      setNewProp({ name: '', address: '', propertyType: 'Residential' });
      setToastMessage('Property successfully created and added to directory.');
      await fetchProperties();
    } catch (err) {
      setToastMessage(`Failed to create property: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="owner-properties-page">
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
            Showing {filteredProperties.length} of {properties.length} properties
          </span>
        </div>
      </div>

      {isLoading && <LoadingState label="Loading properties from server..." />}

      {error && (
        <ErrorState
          title="Unable to load properties"
          message={error}
          onRetry={fetchProperties}
        />
      )}

      {!isLoading && !error && filteredProperties.length === 0 && (
        <EmptyState
          title="No properties found"
          description="No properties matched your current search criteria or none have been added yet."
          actionLabel="Add Property"
          onAction={() => setIsAddModalOpen(true)}
        />
      )}

      {!isLoading && !error && filteredProperties.length > 0 && (
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
                <StatusBadge status={prop.status || 'Active'} />
              </div>

              <div className="property-card__body">
                <div className="property-card__metrics">
                  <div>
                    <div className="property-card__metric-val">{prop.totalUnits ?? 0}</div>
                    <div className="property-card__metric-lbl">Total Units</div>
                  </div>
                  <div>
                    <div className="property-card__metric-val" style={{ color: 'var(--color-success-dark)' }}>
                      {prop.occupiedUnits ?? 0}
                    </div>
                    <div className="property-card__metric-lbl">Occupied</div>
                  </div>
                  <div>
                    <div
                      className="property-card__metric-val"
                      style={{
                        color: (prop.vacantUnits ?? 0) > 0 ? 'var(--color-warning-dark)' : 'var(--color-text-muted)',
                      }}
                    >
                      {prop.vacantUnits ?? 0}
                    </div>
                    <div className="property-card__metric-lbl">Vacant</div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  <span style={{ color: 'var(--color-text-secondary)' }}>Property Type:</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                    {prop.propertyType || 'Residential'}
                  </span>
                </div>
              </div>

              <div className="property-card__footer">
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {prop.occupancyRate ?? 0}% Occupancy
                </span>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <Button
                    size="xs"
                    variant="secondary"
                    onClick={() => navigate(`/owner/properties/${prop.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Property Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Property"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddSubmit} loading={isSubmitting}>
              Create Property
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit}>
          <FormGroup label="Property Title" required>
            <Input
              placeholder="e.g. Lotus Grandeur"
              value={newProp.name}
              onChange={(e) => setNewProp({ ...newProp, name: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup label="Full Address" required>
            <Input
              placeholder="House 14, Road 7, Dhanmondi, Dhaka"
              value={newProp.address}
              onChange={(e) => setNewProp({ ...newProp, address: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup label="Property Type">
            <Select
              value={newProp.propertyType}
              onChange={(e) => setNewProp({ ...newProp, propertyType: e.target.value })}
              options={[
                { value: 'Residential', label: 'Residential' },
                { value: 'Commercial', label: 'Commercial' },
                { value: 'Mixed-Use', label: 'Mixed-Use' },
              ]}
            />
          </FormGroup>
        </form>
      </Modal>

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
