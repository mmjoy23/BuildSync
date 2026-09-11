import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { useAuth } from '../../context/AuthContext';
import AuthField from './AuthField';
import AuthShell from './AuthShell';

export default function ForgotPasswordPage() {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  if (currentUser) return <AuthShell eyebrow="Already signed in" title="Your account is ready" subtitle="You are already signed in to BuildSync."><Link className="btn btn--primary btn--full" to="/">Return to workspace</Link></AuthShell>;
  return <AuthShell eyebrow="Account recovery" title="Forgot your password?" subtitle="Enter your email address and we’ll help you reset your password.">{submitted ? <Alert variant="success" title="Request received">If an account exists for this email, password reset instructions would be sent.</Alert> : <form className="auth-form" noValidate onSubmit={(event) => { event.preventDefault(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email.'); return; } setError(''); setSubmitted(true); }}>{error && <Alert variant="danger" title="Could not send reset link">{error}</Alert>}<AuthField id="forgot-email" label="Email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(''); }} placeholder="you@example.com" required /><Button type="submit" variant="primary" fullWidth>Send Reset Link</Button></form>}<Link className="auth-back-link" to="/login">Back to Login</Link></AuthShell>;
}
