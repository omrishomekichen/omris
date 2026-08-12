type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
};

function Spinner({ size = 'md' }: SpinnerProps) {
  const sizeMap = {
    sm: '18px',
    md: '28px',
    lg: '42px',
  };

  return (
    <div
      aria-label="Loading"
      role="status"
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        border: '3px solid rgba(101, 7, 0, 0.18)',
        borderTopColor: '#650700',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'spin 0.9s linear infinite',
      }}
    />
  );
}

export default function Loading({
  showSlowNote = false,
  seconds = 0,
}: {
  showSlowNote?: boolean;
  seconds?: number;
}) {
  return (
    <div className="splash-screen">
      <div className="splash-card">
        <img src="/logo.png" alt="GigFinance" className="splash-logo" />
        <h1 className="splash-title">GigFinance</h1>
        <Spinner size="lg" />
        <p className="splash-status">
          {showSlowNote
            ? `Starting up… ${seconds}s (first load can take up to 50 seconds)`
            : 'Loading your dashboard…'}
        </p>
        {showSlowNote && (
          <p className="splash-note">
            The server wakes up on first visit. Please wait a moment.
          </p>
        )}
      </div>
    </div>
  );
}
