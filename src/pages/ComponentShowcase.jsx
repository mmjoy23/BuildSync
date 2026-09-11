import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Card,
  StatCard,
  ActionCard,
  Input,
  Select,
  Textarea,
  Checkbox,
  Toggle,
  FormGroup,
  Badge,
  StatusBadge,
  ProgressBar,
  EmptyState,
  Modal,
  Dropdown,
  ConfirmationDialog,
  Alert,
  Toast,
  LoadingState,
  ErrorState,
  Avatar,
  Icon,
  Breadcrumb,
  SearchBar,
  NotificationBell,
  UserMenu,
} from '../components/common';
import { PageHeader, PageContainer } from '../components/layout';
import Table from '../components/tables/Table';

function ComponentShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toggleVal, setToggleVal] = useState(true);
  const [checkVal, setCheckVal] = useState(true);
  const [inputVal, setInputVal] = useState('');
  const [toastVisible, setToastVisible] = useState(true);

  const sampleTableColumns = [
    { key: 'property', label: 'Property' },
    { key: 'tenant', label: 'Tenant' },
    { key: 'rent', label: 'Rent', align: 'right' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: () => (
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
          <IconButton icon={<Icon name="eye" size={16} />} size="sm" />
          <IconButton icon={<Icon name="edit" size={16} />} size="sm" />
        </div>
      ),
    },
  ];

  const sampleTableData = [
    { id: 1, property: 'Grand Avenue Suites 4B', tenant: 'Rahim Ahmed', rent: '$1,200', status: 'Paid' },
    { id: 2, property: 'Sunset Palms Apt 12', tenant: 'Farhana Kabir', rent: '$950', status: 'Pending' },
    { id: 3, property: 'Metro Tower 301', tenant: 'Tanvir Hossain', rent: '$1,400', status: 'Overdue' },
    { id: 4, property: 'Green Valley 2A', tenant: 'Unoccupied', rent: '$850', status: 'Vacant' },
  ];

  return (
    <div className="showcase">
      <nav className="showcase__nav">
        <span className="showcase__nav-brand">BuildSync</span>
        <span className="showcase__nav-tag">Design System Showcase</span>
      </nav>

      <div className="showcase__body">
        <aside className="showcase__sidebar">
          <div className="showcase__sidebar-label">Components</div>
          <a href="#buttons">Buttons & Icons</a>
          <a href="#cards">Cards & Stats</a>
          <a href="#forms">Form Elements</a>
          <a href="#badges">Badges & Statuses</a>
          <a href="#tables">Data Tables</a>
          <a href="#feedback">Feedback & Alerts</a>
          <a href="#navigation">Navigation Items</a>
          <a href="#overlays">Modals & Overlays</a>
        </aside>

        <main className="showcase__content">
          <PageHeader
            title="Shared Design System"
            description="Visual source of truth and interactive documentation for reusable BuildSync components."
            actions={
              <Button icon={<Icon name="plus" size={16} />} onClick={() => setModalOpen(true)}>
                Open Modal Demo
              </Button>
            }
          />

          {/* 1. BUTTONS */}
          <section id="buttons" className="showcase__section">
            <h3 className="showcase__section-title">Buttons & Icon Buttons</h3>
            <div className="showcase__col" style={{ gap: '16px' }}>
              <div className="showcase__row">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="success">Success</Button>
                <Button variant="primary" disabled>Disabled</Button>
                <Button variant="primary" loading>Loading</Button>
              </div>
              <div className="showcase__row">
                <Button size="xs" variant="primary">Extra Small</Button>
                <Button size="sm" variant="primary">Small</Button>
                <Button size="md" variant="primary">Medium</Button>
                <Button size="lg" variant="primary">Large</Button>
                <Button icon={<Icon name="plus" size={16} />}>With Icon</Button>
              </div>
              <div className="showcase__row">
                <IconButton icon={<Icon name="bell" size={18} />} variant="secondary" />
                <IconButton icon={<Icon name="search" size={18} />} variant="ghost" />
                <IconButton icon={<Icon name="trash" size={18} />} variant="danger" />
                <IconButton icon={<Icon name="plus" size={18} />} variant="primary" />
              </div>
            </div>
          </section>

          {/* 2. CARDS */}
          <section id="cards" className="showcase__section">
            <h3 className="showcase__section-title">Cards, StatCards & ActionCards</h3>
            <div className="showcase__grid" style={{ marginBottom: '24px' }}>
              <StatCard
                title="Total Revenue"
                value="$45,200"
                iconName="dollar-sign"
                iconColor="green"
                trend="+12.5%"
                trendDirection="up"
                subtitle="from last month"
              />
              <StatCard
                title="Active Properties"
                value="28"
                iconName="building"
                iconColor="blue"
                trend="+3"
                trendDirection="up"
                subtitle="new units added"
              />
              <StatCard
                title="Pending Maintenance"
                value="9"
                iconName="wrench"
                iconColor="orange"
                trend="-2"
                trendDirection="down"
                subtitle="resolved this week"
              />
              <StatCard
                title="Overdue Invoices"
                value="4"
                iconName="alert-circle"
                iconColor="red"
                trend="+1"
                trendDirection="down"
                subtitle="action needed"
              />
            </div>

            <div className="showcase__grid">
              <ActionCard
                title="Create Lease Agreement"
                description="Draft and generate a verified digital lease contract for new prospective tenants."
                iconName="file-text"
                actionText="Draft Agreement"
              />
              <ActionCard
                title="Assign Parking Space"
                description="Allocate reserved parking spots and monitor slot availability across basements."
                iconName="car"
                actionText="Manage Slots"
              />
              <Card title="Standard Content Card" actions={<Button size="xs" variant="ghost">Options</Button>}>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                  This is a reusable content card with integrated title, actions slot, and padded container.
                </p>
              </Card>
            </div>
          </section>

          {/* 3. FORMS */}
          <section id="forms" className="showcase__section">
            <h3 className="showcase__section-title">Form Elements</h3>
            <div className="showcase__grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              <Card>
                <FormGroup label="Property Name" required helper="Enter the building or complex title">
                  <Input
                    placeholder="e.g. Apex Bay Residency"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                  />
                </FormGroup>

                <FormGroup label="Monthly Rent (USD)" required>
                  <Input
                    prefix={<Icon name="dollar-sign" size={16} />}
                    placeholder="1200"
                    type="number"
                  />
                </FormGroup>

                <FormGroup label="Unit Status">
                  <Select
                    options={[
                      { value: 'vacant', label: 'Vacant' },
                      { value: 'occupied', label: 'Occupied' },
                      { value: 'maintenance', label: 'Under Maintenance' },
                    ]}
                  />
                </FormGroup>
              </Card>

              <Card>
                <FormGroup label="Special Notes / Maintenance Remarks">
                  <Textarea placeholder="Provide any details about building conditions or repair notes..." />
                </FormGroup>

                <div className="showcase__col" style={{ marginTop: '16px' }}>
                  <Checkbox
                    label="Send automated SMS notification"
                    checked={checkVal}
                    onChange={(e) => setCheckVal(e.target.checked)}
                  />
                  <Toggle
                    label="Active lease status"
                    checked={toggleVal}
                    onChange={(e) => setToggleVal(e.target.checked)}
                  />
                </div>
              </Card>
            </div>
          </section>

          {/* 4. BADGES */}
          <section id="badges" className="showcase__section">
            <h3 className="showcase__section-title">Badges & Status Badges</h3>
            <div className="showcase__col" style={{ gap: '12px' }}>
              <div className="showcase__row">
                <StatusBadge status="Paid" />
                <StatusBadge status="Pending" />
                <StatusBadge status="Unpaid" />
                <StatusBadge status="Overdue" />
                <StatusBadge status="Open" />
                <StatusBadge status="Assigned" />
                <StatusBadge status="In Progress" />
                <StatusBadge status="Resolved" />
                <StatusBadge status="Vacant" />
                <StatusBadge status="Occupied" />
                <StatusBadge status="Maintenance" />
              </div>
              <div className="showcase__row">
                <Badge variant="blue" withDot>Information</Badge>
                <Badge variant="green" withDot>Approved</Badge>
                <Badge variant="orange" withDot>Reviewing</Badge>
                <Badge variant="red" withDot>High Priority</Badge>
                <Badge variant="purple" withDot>Premium</Badge>
                <Badge variant="gray">Archived</Badge>
              </div>
              <div style={{ maxWidth: '400px', marginTop: '12px' }}>
                <ProgressBar value={72} label="Occupancy Rate" showValue color="green" />
              </div>
            </div>
          </section>

          {/* 5. TABLES */}
          <section id="tables" className="showcase__section">
            <h3 className="showcase__section-title">Data Table Component</h3>
            <Table
              title="Recent Lease Records"
              columns={sampleTableColumns}
              data={sampleTableData}
              actions={<Button size="sm" variant="secondary">Export CSV</Button>}
              footer={<span>Showing 4 of 24 total properties</span>}
            />
          </section>

          {/* 6. FEEDBACK */}
          <section id="feedback" className="showcase__section">
            <h3 className="showcase__section-title">Feedback & System States</h3>
            <div className="showcase__col" style={{ gap: '16px' }}>
              <Alert variant="info" title="System Maintenance Notice">
                Scheduled database upgrades will take place this Sunday from 2:00 AM to 4:00 AM.
              </Alert>
              <Alert variant="success" title="Payment Recorded">
                Rent collection of $1,200 from Unit 4B was successfully validated.
              </Alert>
              <Alert variant="warning" title="Lease Expiration Approaching">
                3 tenant lease contracts will expire within the next 30 days.
              </Alert>
              <Alert variant="danger" title="Urgent Plumbing Issue">
                Main water pump pressure drop detected in Block C basement.
              </Alert>

              {toastVisible && (
                <Toast
                  type="success"
                  title="Unit Created"
                  message="Flat 14A has been added to Apex Bay Residency."
                  onClose={() => setToastVisible(false)}
                />
              )}

              <div className="showcase__grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <Card>
                  <LoadingState label="Fetching live billing telemetry..." />
                </Card>
                <Card>
                  <ErrorState
                    title="Could not connect to service"
                    message="Network timeout while communicating with parking sensors."
                    onRetry={() => alert('Retrying...')}
                  />
                </Card>
              </div>
            </div>
          </section>

          {/* 7. NAVIGATION */}
          <section id="navigation" className="showcase__section">
            <h3 className="showcase__section-title">Navigation Elements</h3>
            <Card>
              <div className="showcase__col" style={{ gap: '20px' }}>
                <Breadcrumb
                  items={[
                    { label: 'Properties', href: '#properties' },
                    { label: 'Apex Bay Residency', href: '#apex' },
                    { label: 'Flat 4B' },
                  ]}
                />
                <div className="showcase__row" style={{ justifyContent: 'space-between' }}>
                  <SearchBar placeholder="Search tenants, units, or receipts..." />
                  <div className="showcase__row">
                    <NotificationBell count={3} onClick={() => alert('Notifications clicked')} />
                    <UserMenu name="Samiul Bashar" role="Owner" />
                  </div>
                </div>
                <div className="showcase__row">
                  <Avatar name="Sarah Connor" size="lg" color="blue" />
                  <Avatar name="Alex Mercer" size="md" color="green" />
                  <Avatar name="Tariq Ziad" size="sm" color="purple" />
                  <Avatar name="Zoya Noor" size="xs" color="orange" />
                </div>
              </div>
            </Card>
          </section>

          {/* 8. OVERLAYS */}
          <section id="overlays" className="showcase__section">
            <h3 className="showcase__section-title">Overlays & Dialogs</h3>
            <div className="showcase__row">
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Launch Modal
              </Button>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                Launch Confirm Dialog
              </Button>
              <Dropdown
                trigger={<Button variant="secondary">Actions Dropdown ▾</Button>}
              >
                <button type="button" className="dropdown__item">View History</button>
                <button type="button" className="dropdown__item">Download PDF</button>
                <div className="dropdown__divider" />
                <button type="button" className="dropdown__item dropdown__item--danger">Delete Record</button>
              </Dropdown>
            </div>
          </section>

          {/* Modal Demo */}
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Create New Property"
            footer={
              <>
                <Button variant="ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setModalOpen(false)}>
                  Save Property
                </Button>
              </>
            }
          >
            <FormGroup label="Building Name" required>
              <Input placeholder="e.g. Skyline Towers" />
            </FormGroup>
            <FormGroup label="Address" required>
              <Input placeholder="Road 11, Banani, Dhaka" />
            </FormGroup>
            <FormGroup label="Total Units">
              <Input type="number" placeholder="24" />
            </FormGroup>
          </Modal>

          {/* Confirm Dialog Demo */}
          <ConfirmationDialog
            isOpen={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={() => {
              setConfirmOpen(false);
              alert('Item deleted!');
            }}
            title="Delete Flat Record?"
            message="Are you sure you want to delete this flat? All active tenant associations and billing records will be permanently unlinked."
            confirmText="Delete Flat"
            variant="danger"
          />
        </main>
      </div>
    </div>
  );
}

export default ComponentShowcase;
