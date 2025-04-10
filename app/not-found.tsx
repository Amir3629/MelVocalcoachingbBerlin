export default function NotFound() {
  return (
    <div style={{ 
      padding: '100px 20px', 
      textAlign: 'center', 
      fontFamily: 'system-ui, sans-serif' 
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 - Page Not Found</h1>
      <p style={{ marginBottom: '2rem' }}>Sorry, the page you are looking for does not exist.</p>
      <a 
        href="/MelVocalcoachingbBerlin/" 
        style={{ 
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#000',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '4px'
        }}
      >
        Return to Home
      </a>
    </div>
  )
} 