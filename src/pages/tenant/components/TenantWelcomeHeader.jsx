import React from 'react';
import Button from '../../../components/common/Button';
import Icon from '../../../components/common/Icon';
import { tenantProfile } from '../../../data/tenantDashboardData';

/**
 * TenantWelcomeHeader
 * Header component:
 * - "Welcome, Tanjim Ahmed"
 * - "Flat 3A | ABC Residence"
 * - Actions: "Message Owner", "Call Owner"
 */
function TenantWelcomeHeader({ onMessageOwner, onCallOwner }) {
  return (
    <div className="tenant-header">
      <div>
        <h1 className="tenant-header__greeting">
          Welcome, {tenantProfile.name}
        </h1>
        <div className="tenant-header__meta">
          <span className="tenant-header__flat-badge">{tenantProfile.flat}</span>
          <span style={{ color: 'var(--color-border-strong)' }}>|</span>
          <span className="tenant-header__building">{tenantProfile.building}</span>
        </div>
      </div>

      <div className="tenant-header__actions">
        <Button
          variant="secondary"
          icon={<Icon name="mail" size={16} />}
          onClick={onMessageOwner}
        >
          Message Owner
        </Button>
        <Button
          variant="secondary"
          icon={<Icon name="phone" size={16} />}
          onClick={onCallOwner}
        >
          Call Owner
        </Button>
      </div>
    </div>
  );
}

export default TenantWelcomeHeader;
