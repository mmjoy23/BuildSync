import { useLocation, Link } from 'react-router-dom';

function NotFoundPage() {
  const location = useLocation();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f6f9',
      }}
    >
      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '3rem 2rem',
          textAlign: 'center',
          maxWidth: 480,
          width: '100%',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
          404 — Page Not Found
        </h1>
        <code
          style={{
            display: 'inline-block',
            background: '#f1f5f9',
            color: '#475569',
            padding: '0.3rem 0.75rem',
            borderRadius: 4,
            fontSize: '0.85rem',
          }}
        >
          {location.pathname}
        </code>
        <p style={{ marginTop: '1.25rem', color: '#64748b', fontSize: '0.9rem' }}>
          This route doesn&apos;t exist yet.{' '}
          <Link to="/login" style={{ color: '#2563eb', textDecoration: 'underline' }}>
            Go to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default NotFoundPage;
