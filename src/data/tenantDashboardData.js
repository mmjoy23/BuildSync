/**
 * tenantDashboardData.js
 * Frontend mock data for the BuildSync Tenant Dashboard.
 */

export const tenantProfile = {
  name: 'Tanjim Ahmed',
  flat: 'Flat 3A',
  building: 'ABC Residence',
  ownerName: 'Rahman Ahmed',
  ownerPhone: '+880 1711-234567',
};

export const tenantSummaryMetrics = {
  currentBill: {
    title: 'Current Bill',
    amount: '৳33,580',
    dueDate: '10 Sep 2025',
    status: 'Unpaid',
    iconName: 'file-text',
    iconColor: 'red',
  },
  lastPayment: {
    title: 'Last Payment',
    amount: '৳28,500',
    period: 'Aug 2025',
    status: 'Paid',
    iconName: 'check-circle',
    iconColor: 'green',
  },
  parkingSlot: {
    title: 'Parking Slot',
    slot: 'P-05',
    status: 'Assigned',
    iconName: 'car',
    iconColor: 'blue',
  },
  maintenanceRequests: {
    title: 'Maintenance Requests',
    count: '1',
    status: 'In Progress',
    iconName: 'wrench',
    iconColor: 'orange',
  },
};

export const currentBillBreakdown = {
  month: 'September 2025',
  items: [
    { label: 'Rent', amount: '৳25,000' },
    { label: 'Electricity', amount: '৳3,200' },
    { label: 'Water', amount: '৳800' },
    { label: 'Gas', amount: '৳1,080' },
    { label: 'Service Charge', amount: '৳2,000' },
    { label: 'Parking', amount: '৳1,500' },
  ],
  total: '৳33,580',
  dueDate: '10 Sep 2025',
};

export const tenantRecentPayments = [
  { id: 1, date: 'Sep 2025', amount: '৳33,580', status: 'Unpaid' },
  { id: 2, date: 'Aug 2025', amount: '৳28,500', status: 'Paid' },
  { id: 3, date: 'Jul 2025', amount: '৳26,200', status: 'Paid' },
  { id: 4, date: 'Jun 2025', amount: '৳26,200', status: 'Paid' },
];

export const tenantNoticesList = [
  {
    id: 1,
    title: 'Water Supply Maintenance',
    info: 'Water supply will be paused for pump servicing.',
    time: '10:00 AM – 2:00 PM (Tomorrow)',
    iconName: 'zap',
    iconColor: 'blue',
  },
  {
    id: 2,
    title: 'Building Cleaning Schedule',
    info: 'Corridors and shared staircase deep pressure cleaning.',
    time: 'Every Friday',
    iconName: 'clipboard-list',
    iconColor: 'green',
  },
  {
    id: 3,
    title: 'Maintenance Work',
    info: 'Lift will be under maintenance from 11:00 AM.',
    time: '2 Sep',
    iconName: 'wrench',
    iconColor: 'orange',
  },
];

export const tenantQuickActions = [
  {
    id: 'pay-bill',
    title: 'Make Payment',
    iconName: 'credit-card',
    route: '/tenant/payments',
    variant: 'primary',
  },
  {
    id: 'raise-complaint',
    title: 'Raise Complaint',
    iconName: 'wrench',
    route: '/tenant/maintenance',
    variant: 'secondary',
  },
  {
    id: 'view-receipts',
    title: 'View Receipts',
    iconName: 'file-text',
    route: '/tenant/bills',
    variant: 'secondary',
  },
  {
    id: 'send-message',
    title: 'Send Message',
    iconName: 'mail',
    route: '/tenant/messages',
    variant: 'secondary',
  },
];

export const tenantComplaintsList = [
  {
    id: '#1023',
    description: 'Lift not working',
    status: 'In Progress',
    date: '1 Sep',
  },
  {
    id: '#1018',
    description: 'Water leakage',
    status: 'Resolved',
    date: '28 Aug',
  },
];
