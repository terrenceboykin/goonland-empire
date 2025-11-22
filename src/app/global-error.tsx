"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              The app encountered an error. Please refresh the page.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '12px 24px',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

