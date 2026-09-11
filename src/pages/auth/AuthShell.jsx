import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  return <main className="auth-wrapper"><div className="auth-card auth-card--modern"><Link to="/" className="auth-brand">BuildSync<span>.</span></Link><div className="auth-card__subtitle">Property Management Platform</div>{eyebrow && <div className="auth-eyebrow">{eyebrow}</div>}<h1 className="auth-title">{title}</h1>{subtitle && <p className="auth-description">{subtitle}</p>}{children}{footer && <div className="auth-footer">{footer}</div>}</div></main>;
}
