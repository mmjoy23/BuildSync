import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { getRoleHome, useAuth } from '../../context/AuthContext';
import AuthField from './AuthField';
import AuthShell from './AuthShell';

export default function LoginPage() {
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) navigate(getRoleHome(currentUser.role), { replace: true });
  }, [currentUser, navigate]);

  if (currentUser) return <Navigate to={getRoleHome(currentUser.role)} replace />;

  const submit = (event) => {
    event.preventDefault(); setError(''); setIsLoading(true);
    window.setTimeout(() => {
      const user = login(form.email, form.password);
      if (!user) { setError('Invalid email or password.'); setIsLoading(false); return; }
      navigate(location.state?.from || getRoleHome(user.role), { replace: true });
    }, 180);
  };

  return <AuthShell eyebrow="Welcome back" title="Sign in to your account" subtitle="Access your BuildSync workspace and keep everything moving." footer={<>Don't have an account? <Link to="/register">Create an account</Link></>}><form className="auth-form" onSubmit={submit}>{error && <Alert variant="danger" title="Sign in failed">{error}</Alert>}<AuthField id="login-email" label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" autoComplete="email" required /><AuthField id="login-password" label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Enter your password" autoComplete="current-password" required /><div className="auth-form__row"><label className="auth-checkbox"><input type="checkbox" checked={form.remember} onChange={(event) => setForm({ ...form, remember: event.target.checked })} /> Remember me</label><Link to="/forgot-password">Forgot password?</Link></div><Button type="submit" variant="primary" fullWidth loading={isLoading}>{isLoading ? 'Signing in...' : 'Sign In'}</Button></form><div className="auth-demo-note">Demo accounts are available for Owner, Tenant, and Admin roles.</div></AuthShell>;
}
