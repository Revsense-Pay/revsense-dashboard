'use client';

export default function Error({ error, reset }) {
  console.error(error);

  return (
    <html>
      <body style={{ padding: 40 }}>
        <h2>Application Error</h2>
        <pre>{error?.message}</pre>

        <button onClick={() => reset()}>
          Try again
        </button>
      </body>
    </html>
  );
}