import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Icon from '../../components/common/Icon';
import { getRoleHome, useAuth } from '../../context/AuthContext';
import { demoAccounts } from '../../data/authData';
import AuthField from './AuthField';
import AuthShell from './AuthShell';

export default function LoginPage() {
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoAccountsOpen, setIsDemoAccountsOpen] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState('');

  useEffect(() => {
    if (currentUser) navigate(getRoleHome(currentUser.role), { replace: true });
  }, [currentUser, navigate]);

  if (currentUser) return <Navigate to={getRoleHome(currentUser.role)} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user) {
        navigate(location.state?.from || getRoleHome(user.role), { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectDemoAccount = (account) => {
    setForm((currentForm) => ({ ...currentForm, email: account.email, password: account.password }));
    setSelectedDemoRole(account.role);
    setError('');
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your account"
      subtitle="Access your BuildSync workspace and keep everything moving."
      footer={<>Don't have an account? <Link to="/register">Create an account</Link></>}
    >
      <form className="auth-form" onSubmit={submit}>
        {error && <Alert variant="danger" title="Sign in failed">{error}</Alert>}
        <AuthField
          id="login-email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <AuthField
          id="login-password"
          label="Password"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
        <div className="auth-form__row">
          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(event) => setForm({ ...form, remember: event.target.checked })}
            />
            {' '}Remember me
          </label>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <Button type="submit" variant="primary" fullWidth loading={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      <div className={`auth-demo-selector ${isDemoAccountsOpen ? 'is-open' : ''}`}>
        <button
          type="button"
          className="auth-demo-selector__trigger"
          aria-expanded={isDemoAccountsOpen}
          onClick={() => setIsDemoAccountsOpen((isOpen) => !isOpen)}
        >
          <span>
            <Icon name="sparkles" size={15} />
            {selectedDemoRole
              ? `Demo account selected: ${selectedDemoRole}`
              : 'Demo accounts available for Owner, Tenant, and Admin'}
          </span>
          <Icon name="chevron-down" size={15} />
        </button>
        {isDemoAccountsOpen && (
          <div className="auth-demo-selector__options" aria-label="Demo accounts">
            {demoAccounts.map((account) => (
              <button
                type="button"
                key={account.id}
                className={`auth-demo-option ${selectedDemoRole === account.role ? 'is-selected' : ''}`}
                aria-pressed={selectedDemoRole === account.role}
                onClick={() => selectDemoAccount(account)}
              >
                <span className="auth-demo-option__icon">
                  <Icon
                    name={account.role === 'owner' ? 'building' : account.role === 'tenant' ? 'home' : 'settings'}
                    size={17}
                  />
                </span>
                <span className="auth-demo-option__copy">
                  <strong>{account.roleLabel} Demo</strong>
                  <small>
                    {account.role === 'owner'
                      ? 'Owner Portal'
                      : account.role === 'tenant'
                      ? 'Tenant Portal'
                      : 'Admin Portal'}
                  </small>
                  <small>{account.email}</small>
                </span>
                {selectedDemoRole === account.role && <Icon name="check-circle" size={17} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </AuthShell>
  );
}
