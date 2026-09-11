import { useLocation, Link } from 'react-router-dom';
import Card from './Card';
import PageHeader from '../layout/PageHeader';
import Button from './Button';
import Badge from './Badge';

/**
 * PlaceholderPage
 * Shows page title, current route, and design system components.
 */
function PlaceholderPage({ title, icon = '🏗️' }) {
  const location = useLocation();

  return (
    <div className="placeholder-wrapper" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <PageHeader
        title={title}
        description={`Active route: ${location.pathname}`}
        actions={
          <Link to="/showcase" className="btn btn--outline btn--sm">
            ✨ Design System Showcase
          </Link>
        }
      />

      <Card
        title={`${title} Overview`}
        actions={<Badge variant="blue">Phase 2 Design System Ready</Badge>}
      >
        <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
            {title} Page
          </h2>
          <div style={{
            display: 'inline-block',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            background: 'var(--color-divider)',
            color: 'var(--color-text-secondary)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1rem'
          }}>
            {location.pathname}
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            This page layout is powered by the shared <strong>Sidebar</strong>, <strong>Navbar</strong>, <strong>PageContainer</strong>, and <strong>PageHeader</strong> components. Full business data will be connected in Phase 3.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/showcase" className="btn btn--primary btn--sm">
              Explore All UI Components
            </Link>
            <Link to="/login" className="btn btn--secondary btn--sm">
              Back to Login
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PlaceholderPage;
