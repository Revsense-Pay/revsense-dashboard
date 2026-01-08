'use client';

export default function Error({ error, reset }) {
  return (
    <div style={{ padding: 40 }}>
      <h2>Something went wrong</h2>
      <p>{error?.message}</p>

      <button onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}