export default function FormField({ label, error, rightSlot, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-200">{label}</span>
        {rightSlot}
      </div>
      <input className="input-field" {...props} />
      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
    </label>
  )
}