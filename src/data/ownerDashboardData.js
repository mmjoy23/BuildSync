/**
 * ownerDashboardData.js
 * Frontend mock data for the BuildSync Owner Dashboard.
 */

export const ownerProfile = {
  name: 'Rahman Ahmed',
  greeting: 'Good Evening',
  subtitle: "Here's an overview of your properties and activities.",
};

export const monthsList = [
  'September 2025',
  'August 2025',
  'July 2025',
  'June 2025',
  'May 2025',
];

export const kpiMetrics = {
  totalProperties: {
    title: 'Total Properties',
    value: '3',
    trend: '+1 this year',
    trendDirection: 'up',
    iconName: 'building',
    iconColor: 'blue',
  },
  totalUnits: {
    title: 'Total Units',
    value: '76',
    occupied: 68,
    vacant: 8,
    occupancyRate: 89,
    iconName: 'home',
    iconColor: 'purple',
  },
  monthlyExpectedIncome: {
    title: 'Monthly Expected Income',
    value: '৳1,850,000',
    trend: '+12% vs last month',
    trendDirection: 'up',
    iconName: 'dollar-sign',
    iconColor: 'green',
  },
  collectedThisMonth: {
    title: 'Collected This Month',
    value: '৳1,650,000',
    subtitle: '89% of expected',
    iconName: 'check-circle',
    iconColor: 'green',
  },
  outstanding: {
    title: 'Outstanding',
    value: '৳200,000',
    subtitle: '12% of expected',
    iconName: 'alert-circle',
    iconColor: 'red',
  },
};

export const incomeExpenseData = {
  period: 'This Month',
  income: 1650000,
  incomeLabel: '৳1,650,000',
  expense: 620000,
  expenseLabel: '৳620,000',
  monthlyBreakdown: [
    { month: 'May', income: 1420000, expense: 510000 },
    { month: 'Jun', income: 1510000, expense: 580000 },
    { month: 'Jul', income: 1590000, expense: 600000 },
    { month: 'Aug', income: 1610000, expense: 590000 },
    { month: 'Sep', income: 1650000, expense: 620000 },
  ],
};

export const propertyOverviewData = {
  totalUnits: 76,
  occupied: 68,
  vacant: 8,
  maintenance: 2,
};

export const recentPayments = [
  {
    id: 1,
    date: '05 Sep 2025',
    flat: '5B',
    tenant: 'Rahim Ahmed',
    amount: '৳31,200',
    status: 'Paid',
  },
  {
    id: 2,
    date: '04 Sep 2025',
    flat: '2A',
    tenant: 'Karim Uddin',
    amount: '৳28,500',
    status: 'Paid',
  },
  {
    id: 3,
    date: '03 Sep 2025',
    flat: '7C',
    tenant: 'Shakil Hasan',
    amount: '৳30,000',
    status: 'Pending',
  },
  {
    id: 4,
    date: '01 Sep 2025',
    flat: '2A',
    tenant: 'Nayeem Islam',
    amount: '৳27,800',
    status: 'Paid',
  },
];

export const quickActionsList = [
  {
    id: 'generate-bills',
    title: 'Generate Bills',
    iconName: 'file-text',
    route: '/owner/billing',
    variant: 'primary',
  },
  {
    id: 'add-tenant',
    title: 'Add Tenant',
    iconName: 'users',
    route: '/owner/tenants',
    variant: 'secondary',
  },
  {
    id: 'record-expense',
    title: 'Record Expense',
    iconName: 'credit-card',
    route: '/owner/billing',
    variant: 'secondary',
  },
  {
    id: 'view-reports',
    title: 'View Reports',
    iconName: 'bar-chart-2',
    route: '/owner/reports',
    variant: 'secondary',
  },
];

export const recentComplaints = [
  {
    id: '#1024',
    description: 'Water leakage in bathroom',
    flat: '5B',
    priority: 'High',
    status: 'In Progress',
    date: '2 Sep 2025',
  },
  {
    id: '#1023',
    description: 'Lift not working',
    flat: '2A',
    priority: 'Medium',
    status: 'Assigned',
    date: '1 Sep 2025',
  },
  {
    id: '#1020',
    description: 'Electrical issue',
    flat: '7C',
    priority: 'High',
    status: 'Open',
    date: '29 Aug 2025',
  },
];

export const ownerMessagesList = [
  {
    id: 1,
    sender: 'Rafiqul Islam',
    role: 'Tenant - 5B',
    preview: 'Hi, I have a small issue with the water...',
    time: '10:24 AM',
    unread: true,
    avatarColor: 'blue',
  },
  {
    id: 2,
    sender: 'Karim Uddin',
    role: 'Tenant - 2A',
    preview: 'Can you confirm if the maintenance...',
    time: 'Yesterday',
    unread: false,
    avatarColor: 'green',
  },
  {
    id: 3,
    sender: 'Support Team',
    role: 'BuildSync Desk',
    preview: 'Your payment of ৳31,200 has been...',
    time: 'Yesterday',
    unread: false,
    avatarColor: 'purple',
  },
  {
    id: 4,
    sender: 'Shakil Hasan',
    role: 'Tenant - 7C',
    preview: 'The lift is not working since this morning.',
    time: '2 Sep',
    unread: true,
    avatarColor: 'orange',
  },
];
