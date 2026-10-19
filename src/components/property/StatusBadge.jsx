export default function StatusBadge({ status, className = '' }) {
  const dot = { Available: 'bg-emerald-600', 'Under offer': 'bg-accent', Sold: 'bg-ink' }[status];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-xs font-medium text-ink ${className}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}
