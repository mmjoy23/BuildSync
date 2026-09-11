/**
 * adminDashboardData.js
 * Frontend mock data for the BuildSync Admin Dashboard.
 */

export const adminProfile = {
  name: 'Tanvir Hossain',
  greeting: 'Good Evening, Admin',
  subtitle: 'Manage users, handle support, and keep the platform running smoothly.',
};

export const adminSummaryMetrics = {
  totalUsers: {
    title: 'Total Users',
    value: '1,248',
    trend: '+12%',
    trendDirection: 'up',
    iconName: 'users',
    iconColor: 'blue',
  },
  owners: {
    title: 'Owners',
    value: '86',
    trend: '+5%',
    trendDirection: 'up',
    iconName: 'user',
    iconColor: 'purple',
  },
  tenants: {
    title: 'Tenants',
    value: '1,102',
    trend: '+15%',
    trendDirection: 'up',
    iconName: 'home',
    iconColor: 'green',
  },
  properties: {
    title: 'Properties',
    value: '24',
    trend: '+3%',
    trendDirection: 'up',
    iconName: 'building',
    iconColor: 'orange',
  },
};

export const platformActivityData = {
  period: 'Last 7 Days',
  days: [
    { day: 'Mon', logins: 840, newUsers: 24 },
    { day: 'Tue', logins: 920, newUsers: 38 },
    { day: 'Wed', logins: 1100, newUsers: 45 },
    { day: 'Thu', logins: 1050, newUsers: 30 },
    { day: 'Fri', logins: 1240, newUsers: 52 },
    { day: 'Sat', logins: 780, newUsers: 18 },
    { day: 'Sun', logins: 690, newUsers: 14 },
  ],
};

export const supportTicketsList = [
  {
    id: '#ST-1042',
    description: 'Payment issue',
    status: 'Open',
    time: '2h',
  },
  {
    id: '#ST-1038',
    description: 'Login problem',
    status: 'In Progress',
    time: '5h',
  },
  {
    id: '#ST-1029',
    description: 'Feature request',
    status: 'Pending',
    time: '1d',
  },
  {
    id: '#ST-1011',
    description: 'Bug report',
    status: 'Resolved',
    time: '2d',
  },
];

export const adminRecentMessages = [
  {
    id: 1,
    sender: 'Rahim Ahmed',
    role: 'Owner',
    preview: "I'm facing an issue with payment verification.",
    time: '25m ago',
    avatarColor: 'blue',
  },
  {
    id: 2,
    sender: 'Support Ticket #1042',
    role: 'System Inquiry',
    preview: 'Payment not received yet.',
    time: '2h ago',
    avatarColor: 'red',
  },
  {
    id: 3,
    sender: 'Farhan Hossain',
    role: 'Owner',
    preview: 'Can you help me with the billing setup?',
    time: '5h ago',
    avatarColor: 'green',
  },
];

export const systemHealthMetrics = [
  {
    id: 'db',
    name: 'Database',
    status: 'Online',
    variant: 'success',
    info: 'Latency: 14ms',
  },
  {
    id: 'pg',
    name: 'Payment Gateway',
    status: 'Online',
    variant: 'success',
    info: 'Operational',
  },
  {
    id: 'uptime',
    name: 'Server Uptime',
    status: '99.9%',
    variant: 'success',
    info: 'Last 30 days',
  },
  {
    id: 'backup',
    name: 'Backup',
    status: '2 Sep 2025',
    variant: 'info',
    info: 'Last backup: 2 Sep 2025',
  },
];

export const adminQuickActions = [
  {
    id: 'manage-users',
    title: 'Manage Users',
    iconName: 'users',
    route: '/admin/users',
  },
  {
    id: 'support-tickets',
    title: 'View Support Tickets',
    iconName: 'headphones',
    route: '/admin/support',
  },
  {
    id: 'system-settings',
    title: 'System Settings',
    iconName: 'settings',
    route: '/admin/settings',
  },
  {
    id: 'generate-reports',
    title: 'Generate Reports',
    iconName: 'file-text',
    route: '/admin/reports',
  },
];
