export const adminUsers = [
  { id: 'u-1', name: 'Rahim Ahmed', role: 'Owner', email: 'rahim@example.com', phone: '+880 1711-123456', status: 'Active', joined: 'Jan 2024' },
  { id: 'u-2', name: 'Tanjim Ahmed', role: 'Tenant', email: 'tanjim@example.com', phone: '+880 1744-456789', status: 'Active', joined: 'Jan 2025' },
  { id: 'u-3', name: 'Karim Uddin', role: 'Tenant', email: 'karim@example.com', phone: '+880 1822-234567', status: 'Pending', joined: 'Mar 2025' },
  { id: 'u-4', name: 'Admin User', role: 'Administrator', email: 'admin@buildsync.com', phone: '+880 1999-111222', status: 'Active', joined: 'Dec 2023' },
  { id: 'u-5', name: 'Farhan Hossain', role: 'Owner', email: 'farhan@example.com', phone: '+880 1555-333444', status: 'Suspended', joined: 'Feb 2024' },
];

export const adminOwners = [
  { id: 'o-1', name: 'Rahman Ahmed', email: 'rahman@example.com', phone: '+880 1711-234567', properties: 3, units: 76, tenants: 68, status: 'Active', joined: 'Jan 2024' },
  { id: 'o-2', name: 'Farhan Hossain', email: 'farhan@example.com', phone: '+880 1555-333444', properties: 2, units: 44, tenants: 38, status: 'Active', joined: 'Feb 2024' },
  { id: 'o-3', name: 'Nadia Karim', email: 'nadia@example.com', phone: '+880 1888-778899', properties: 1, units: 18, tenants: 14, status: 'Pending', joined: 'Aug 2025' },
  { id: 'o-4', name: 'Mahmud Hasan', email: 'mahmud@example.com', phone: '+880 1666-112233', properties: 4, units: 96, tenants: 82, status: 'Suspended', joined: 'Nov 2023' },
];

export const adminTenants = [
  { id: 't-1', name: 'Tanjim Ahmed', property: 'ABC Residence', flat: '3A', owner: 'Rahman Ahmed', status: 'Active', joined: 'Jan 2025' },
  { id: 't-2', name: 'Rahim Ahmed', property: 'ABC Residence', flat: '5B', owner: 'Rahman Ahmed', status: 'Active', joined: 'Jan 2024' },
  { id: 't-3', name: 'Karim Uddin', property: 'ABC Residence', flat: '2A', owner: 'Rahman Ahmed', status: 'Pending', joined: 'Mar 2025' },
  { id: 't-4', name: 'Sadia Rahman', property: 'Green View Apartments', flat: '2B', owner: 'Farhan Hossain', status: 'Active', joined: 'Sep 2023' },
  { id: 't-5', name: 'Imran Nazir', property: 'Green View Apartments', flat: '4A', owner: 'Farhan Hossain', status: 'Inactive', joined: 'May 2023' },
];

export const adminProperties = [
  { id: 'p-1', name: 'ABC Residence', address: 'Road 11, Banani, Dhaka', owner: 'Rahman Ahmed', units: 40, occupied: 36, vacant: 4, status: 'Active', created: 'Jan 2024' },
  { id: 'p-2', name: 'Green View Apartments', address: 'Sector 4, Uttara, Dhaka', owner: 'Farhan Hossain', units: 24, occupied: 20, vacant: 4, status: 'Active', created: 'Feb 2024' },
  { id: 'p-3', name: 'Lake City Heights', address: 'Gulshan 2, Dhaka', owner: 'Rahman Ahmed', units: 12, occupied: 12, vacant: 0, status: 'Active', created: 'Jun 2024' },
  { id: 'p-4', name: 'Nadia Garden Homes', address: 'Dhanmondi, Dhaka', owner: 'Nadia Karim', units: 18, occupied: 0, vacant: 18, status: 'Pending', created: 'Aug 2025' },
];

export const adminSupportTickets = [
  { id: '#ST-1042', subject: 'Payment issue', submittedBy: 'Rahim Ahmed', role: 'Owner', priority: 'High', status: 'Open', created: '2h', assignedTo: 'Support Team', description: 'Payment verification has not updated after a tenant payment.', timeline: ['User message · 2h ago', 'Assigned to Support Team · 1h ago'] },
  { id: '#ST-1038', subject: 'Login problem', submittedBy: 'Tanjim Ahmed', role: 'Tenant', priority: 'High', status: 'In Progress', created: '5h', assignedTo: 'Support Team', description: 'Tenant cannot access the portal after changing their phone.', timeline: ['User message · 5h ago', 'Support response · 4h ago', 'Status changed to In Progress · 3h ago'] },
  { id: '#ST-1029', subject: 'Feature request', submittedBy: 'Farhan Hossain', role: 'Owner', priority: 'Medium', status: 'Pending', created: '1d', assignedTo: 'Unassigned', description: 'Request for bulk utility reading import.', timeline: ['User message · 1d ago'] },
  { id: '#ST-1011', subject: 'Bug report', submittedBy: 'Nadia Karim', role: 'Owner', priority: 'Low', status: 'Resolved', created: '2d', assignedTo: 'Engineering', description: 'Property address was not saving on the first attempt.', timeline: ['User message · 2d ago', 'Resolved · 1d ago'] },
];

export const adminConversations = [
  { id: 'rahim', name: 'Rahim Ahmed', role: 'Owner', avatarColor: 'blue', messages: [{ sender: 'Rahim Ahmed', text: 'I am facing an issue with payment verification.', time: '10:15 AM', isMe: false }, { sender: 'Admin User', text: 'I have opened a support ticket for our team to review.', time: '10:25 AM', isMe: true }] },
  { id: 'tanjim', name: 'Tanjim Ahmed', role: 'Tenant', avatarColor: 'green', messages: [{ sender: 'Tanjim Ahmed', text: 'Could you help me access my account?', time: 'Yesterday', isMe: false }] },
  { id: 'support', name: 'Support Team', role: 'Internal', avatarColor: 'purple', messages: [{ sender: 'Support Team', text: 'Ticket ST-1042 is ready for review.', time: 'Yesterday', isMe: false }] },
  { id: 'farhan', name: 'Farhan Hossain', role: 'Owner', avatarColor: 'orange', messages: [{ sender: 'Farhan Hossain', text: 'Can you help me with billing setup?', time: '2 Sep', isMe: false }] },
];

export const adminReportData = {
  summary: { totalUsers: '1,248', newUsers: '84', activeProperties: '22', supportTickets: '47', paymentTransactions: '1,804' },
  userGrowth: [{ label: 'Apr', value: 840 }, { label: 'May', value: 910 }, { label: 'Jun', value: 980 }, { label: 'Jul', value: 1050 }, { label: 'Aug', value: 1150 }, { label: 'Sep', value: 1248 }],
  activity: [{ label: 'Mon', logins: 840, tickets: 12 }, { label: 'Tue', logins: 920, tickets: 18 }, { label: 'Wed', logins: 1100, tickets: 14 }, { label: 'Thu', logins: 1050, tickets: 21 }, { label: 'Fri', logins: 1240, tickets: 16 }, { label: 'Sat', logins: 780, tickets: 8 }, { label: 'Sun', logins: 690, tickets: 6 }],
};
