import React from 'react';
import { Link } from 'react-router-dom';

export default function WelcomePage() {
  return <main className="auth-wrapper auth-wrapper--welcome"><div className="welcome-card"><div className="auth-brand">BuildSync<span>.</span></div><div className="auth-card__subtitle">Property Management Platform</div><div className="welcome-card__mark">BS</div><h1>One place for properties, people, and progress.</h1><p>BuildSync brings owners, tenants, and platform teams together around the work that keeps every property moving.</p><div className="welcome-card__actions"><Link className="btn btn--primary btn--md" to="/login">Sign In</Link><Link className="btn btn--secondary btn--md" to="/register">Create Account</Link></div><div className="welcome-card__roles"><span>Owner workspace</span><span>Tenant services</span><span>Platform operations</span></div></div></main>;
}
