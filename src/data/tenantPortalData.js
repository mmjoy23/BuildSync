export const tenantFlat = {
  property: 'ABC Residence',
  address: 'Road 11, Banani, Dhaka',
  unit: '3A',
  floor: '3',
  type: '3 Bedroom',
  bedrooms: 3,
  bathrooms: 2,
  area: '1,420 sq ft',
  monthlyRent: '৳25,000',
  moveInDate: '01 Jan 2025',
  occupancy: 'Occupied',
  parkingSlot: 'P-05',
  vehicle: 'Honda Civic · Dhaka Metro-Ka 98-7654',
  owner: 'Rahman Ahmed',
  ownerPhone: '+880 1711-234567',
};

export const tenantBills = [
  { id: 'INV-2025-09-003A', month: 'September 2025', amount: '৳33,580', dueDate: '10 Sep 2025', status: 'Unpaid', items: [['Rent', '৳25,000'], ['Electricity', '৳3,200'], ['Water', '৳800'], ['Gas', '৳1,080'], ['Service Charge', '৳2,000'], ['Parking', '৳1,500']] },
  { id: 'INV-2025-08-003A', month: 'August 2025', amount: '৳28,500', dueDate: '10 Aug 2025', status: 'Paid', items: [['Rent', '৳25,000'], ['Electricity', '৳2,200'], ['Water', '৳800'], ['Gas', '৳500']] },
  { id: 'INV-2025-07-003A', month: 'July 2025', amount: '৳26,200', dueDate: '10 Jul 2025', status: 'Paid', items: [['Rent', '৳25,000'], ['Water', '৳800'], ['Gas', '৳400']] },
  { id: 'INV-2025-06-003A', month: 'June 2025', amount: '৳26,200', dueDate: '10 Jun 2025', status: 'Paid', items: [['Rent', '৳25,000'], ['Water', '৳800'], ['Gas', '৳400']] },
];

export const tenantPayments = [
  { id: 'TXN-84921', date: '05 Sep 2025', invoice: 'INV-2025-09-003A', amount: '৳33,580', method: 'bKash', status: 'Pending', receipt: 'Pending' },
  { id: 'TXN-84110', date: '05 Aug 2025', invoice: 'INV-2025-08-003A', amount: '৳28,500', method: 'Nagad', status: 'Paid', receipt: 'RCP-2025-84110' },
  { id: 'TXN-83204', date: '05 Jul 2025', invoice: 'INV-2025-07-003A', amount: '৳26,200', method: 'bKash', status: 'Paid', receipt: 'RCP-2025-83204' },
  { id: 'TXN-82111', date: '05 Jun 2025', invoice: 'INV-2025-06-003A', amount: '৳26,200', method: 'Nagad', status: 'Paid', receipt: 'RCP-2025-82111' },
];

export const tenantMaintenance = [
  { id: '#1023', issue: 'Lift not working', description: 'The lift has stopped between floors and is making a loud sound.', priority: 'Medium', submitted: '1 Sep 2025', status: 'In Progress', assignedTo: 'Maintenance Team', updates: ['Submitted · 1 Sep, 9:10 AM', 'Assigned · 1 Sep, 11:00 AM', 'Technician contacted · 1 Sep, 2:30 PM', 'Work in progress · 2 Sep, 10:00 AM'] },
  { id: '#1018', issue: 'Water leakage', description: 'Water is leaking from the bathroom basin pipe.', priority: 'High', submitted: '28 Aug 2025', status: 'Resolved', assignedTo: 'Plumbing Works Ltd.', updates: ['Submitted · 28 Aug, 8:30 AM', 'Assigned · 28 Aug, 9:15 AM', 'Resolved · 28 Aug, 4:00 PM'] },
  { id: '#1012', issue: 'Electrical issue', description: 'Kitchen light flickers when the exhaust fan is running.', priority: 'High', submitted: '20 Aug 2025', status: 'Resolved', assignedTo: 'Electrician Kabir', updates: ['Submitted · 20 Aug, 10:00 AM', 'Assigned · 20 Aug, 11:20 AM', 'Resolved · 20 Aug, 5:00 PM'] },
];

export const tenantConversations = [
  { id: 'owner', name: 'Rahman Ahmed', role: 'Owner', avatarColor: 'blue', messages: [{ sender: 'Rahman Ahmed', text: 'Your September bill has been generated.', time: '10:15 AM', isMe: false }, { sender: 'Tanjim Ahmed', text: "Thank you. I'll make the payment today.", time: '10:20 AM', isMe: true }, { sender: 'Rahman Ahmed', text: 'Please let me know if there is any issue.', time: '10:24 AM', isMe: false }] },
  { id: 'maintenance', name: 'Maintenance Team', role: 'Support', avatarColor: 'orange', messages: [{ sender: 'Maintenance Team', text: 'A technician has been assigned to your lift request.', time: 'Yesterday', isMe: false }] },
  { id: 'admin', name: 'Admin Support', role: 'BuildSync Desk', avatarColor: 'purple', messages: [{ sender: 'Admin Support', text: 'Your tenant profile has been reviewed.', time: '28 Aug', isMe: false }] },
];

export const tenantNotices = [
  { id: 'n-1', title: 'Water Supply Maintenance', category: 'Maintenance', date: '10:00 AM – 2:00 PM · Tomorrow', description: 'Water supply will be paused while the building pump is serviced. Please store enough water beforehand.', unread: true },
  { id: 'n-2', title: 'Building Cleaning Schedule', category: 'General', date: 'Every Friday', description: 'Corridors and shared staircases will undergo deep pressure cleaning every Friday morning.', unread: false },
  { id: 'n-3', title: 'Lift Maintenance', category: 'Maintenance', date: '25 Aug 2025', description: 'The lift will be under scheduled maintenance. Please use the stairs during the service window.', unread: false },
  { id: 'n-4', title: 'September Billing Reminder', category: 'Billing', date: '08 Sep 2025', description: 'Your September bill is due on 10 September 2025.', unread: true },
];
