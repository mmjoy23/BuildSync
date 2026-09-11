import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-card__brand">BuildSync</div>
        <div className="auth-card__subtitle">
          Property Management Platform
        </div>
        
        <div className="auth-card__placeholder" style={{ marginBottom: '1.5rem' }}>
          🔐 Authentication UI — (Phase 3+)
          <br />
          <small style={{ color: 'var(--color-text-secondary)' }}>Route: /login</small>
        </div>

        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
            Quick Portal Access
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link
              to="/owner/dashboard"
              className="btn btn--primary btn--md btn--full"
              style={{ justifyContent: 'center' }}
            >
              🏢 Enter Owner Portal
            </Link>
            <Link
              to="/tenant/dashboard"
              className="btn btn--secondary btn--md btn--full"
              style={{ justifyContent: 'center' }}
            >
              🏠 Enter Tenant Portal
            </Link>
            <Link
              to="/admin/dashboard"
              className="btn btn--secondary btn--md btn--full"
              style={{ justifyContent: 'center' }}
            >
              ⚙️ Enter Admin Panel
            </Link>
          </div>
        </div>

        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <Link
            to="/showcase"
            className="btn btn--ghost btn--sm btn--full"
            style={{ color: 'var(--color-primary)', fontWeight: 600 }}
          >
            ✨ View Shared Design System Showcase
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
