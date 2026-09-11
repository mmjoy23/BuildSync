import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import FormGroup from '../../components/common/FormGroup';
import { emailExists, saveRegisteredUser } from '../../data/authData';
import AuthField from './AuthField';
import AuthShell from './AuthShell';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('owner');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', extra: '' });
  const [errors, setErrors] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = [];
    if (!form.name.trim()) nextErrors.push('Full name is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.push('Please enter a valid email.');
    if (form.password.length < 8) nextErrors.push('Password must be at least 8 characters.');
    if (form.password !== form.confirm) nextErrors.push('Passwords do not match.');
    if (emailExists(form.email)) nextErrors.push('An account with this email already exists.');
    if (nextErrors.length) { setErrors(nextErrors); return; }
    saveRegisteredUser({ id: `USR-${Date.now()}`, name: form.name, email: form.email.toLowerCase(), password: form.password, role: accountType, roleLabel: accountType === 'owner' ? 'Owner' : 'Tenant' });
    setErrors([]); setIsComplete(true);
  };
  if (isComplete) return <AuthShell eyebrow="Account ready" title="Welcome to BuildSync" subtitle={`Your ${accountType} account has been created successfully. Please sign in to continue.`}><Alert variant="success" title="Registration complete">Your account is ready for the frontend demo.</Alert><Button variant="primary" fullWidth onClick={() => navigate('/login')}>Continue to Sign In</Button></AuthShell>;
  return <AuthShell eyebrow="Get started" title="Create your BuildSync account" subtitle="Join the property management platform built for smoother everyday work." footer={<>Already have an account? <Link to="/login">Sign in</Link></>}><form className="auth-form" noValidate onSubmit={submit}>{errors.length > 0 && <Alert variant="danger" title="Please review your details"><ul className="auth-error-list">{errors.map((error) => <li key={error}>{error}</li>)}</ul></Alert>}<FormGroup label="Account Type"><Select value={accountType} onChange={(event) => setAccountType(event.target.value)} options={[{ value: 'owner', label: 'Owner' }, { value: 'tenant', label: 'Tenant' }]} /></FormGroup><AuthField id="register-name" label="Full Name" value={form.name} onChange={set('name')} placeholder="Your full name" required /><AuthField id="register-email" label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required /><div className="auth-field-grid"><AuthField id="register-phone" label="Phone" value={form.phone} onChange={set('phone')} placeholder="+880 1XXX-XXXXXX" /><AuthField id="register-extra" label={accountType === 'owner' ? 'Company / Organization' : 'Property / Residence'} value={form.extra} onChange={set('extra')} placeholder={accountType === 'owner' ? 'Optional' : 'Optional'} /></div>{accountType === 'tenant' && <FormGroup label="Flat / Unit"><Input value={form.unit || ''} onChange={(event) => setForm({ ...form, unit: event.target.value })} placeholder="e.g. 3A" /></FormGroup>}<div className="auth-field-grid"><AuthField id="register-password" label="Password" type="password" value={form.password} onChange={set('password')} placeholder="At least 8 characters" required /><AuthField id="register-confirm" label="Confirm Password" type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat your password" required /></div><Button type="submit" variant="primary" fullWidth>Create {accountType === 'owner' ? 'Owner' : 'Tenant'} Account</Button></form></AuthShell>;
}
