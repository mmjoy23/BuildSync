export const demoAccounts = [
  { id: 'USR001', name: 'Rahman Ahmed', email: 'owner@buildsync.com', password: 'Owner123!', role: 'owner', roleLabel: 'Owner' },
  { id: 'USR002', name: 'Tanjim Ahmed', email: 'tenant@buildsync.com', password: 'Tenant123!', role: 'tenant', roleLabel: 'Tenant' },
  { id: 'USR003', name: 'Admin', email: 'admin@buildsync.com', password: 'Admin123!', role: 'admin', roleLabel: 'Administrator' },
];

export const AUTH_STORAGE_KEY = 'buildsync_auth_user';
export const REGISTERED_USERS_STORAGE_KEY = 'buildsync_registered_users';

export function getRegisteredUsers() {
  try {
    const stored = window.localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function findAccount(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = [...demoAccounts, ...getRegisteredUsers()].find(
    (user) => user.email.toLowerCase() === normalizedEmail && user.password === password,
  );
  if (!account) return null;
  const { password: _password, ...safeUser } = account;
  return safeUser;
}

export function emailExists(email) {
  const normalizedEmail = email.trim().toLowerCase();
  return [...demoAccounts, ...getRegisteredUsers()].some(
    (user) => user.email.toLowerCase() === normalizedEmail,
  );
}

export function saveRegisteredUser(user) {
  const users = [...getRegisteredUsers(), user];
  window.localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(users));
}
