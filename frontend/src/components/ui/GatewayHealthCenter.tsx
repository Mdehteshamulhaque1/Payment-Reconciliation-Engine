import { Wifi, WifiOff, Clock, Activity } from 'lucide-react'
import { useGateways } from '@/hooks/useGateways'
import { GatewayLogo } from '@/components/ui/GatewayLogo'
import { Badge } from '@/components/ui/Badge'

export function GatewayHealthCenter() {
  const { data: gateways, isLoading } = useGateways()

  if (isLoading) return null

  return (
    <div className="rounded-2xl border border-[color-mix(in_srgb,var(--accent-cyan)_10%,var(--border))] bg-[color-mix(in_srgb,var(--surface-strong)_95%,var(--bg2))] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[var(--accent-cyan)]" />
          <h3 className="text-sm font-semibold" style={{ fontFamily: 'Outfit' }}>Gateway Health Center</h3>
        </div>
        <Badge variant="info" dot>{gateways?.length ?? 0} gateways</Badge>
      </div>

      <div className="divide-y divide-[color-mix(in_srgb,var(--border)_50%,transparent)]">
        {gateways?.map((gw) => (
          <div
            key={gw.id}
            className="flex items-center gap-4 px-4 py-3 hover:bg-[color-mix(in_srgb,var(--accent-cyan)_3%,transparent)] transition-colors"
          >
            <GatewayLogo name={gw.name} size={36} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--text)] truncate">{gw.display_name}</span>
                {gw.is_active ? (
                  <Wifi size={12} className="text-[var(--success)]" />
                ) : (
                  <WifiOff size={12} className="text-[var(--danger)]" />
                )}
              </div>
              <p className="text-[10px] font-mono text-[var(--muted)] capitalize">{gw.gateway_type} · {gw.sandbox_mode ? 'Sandbox' : 'Production'}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Clock size={10} className="text-[var(--muted)]" />
                  <span className="text-xs font-mono text-[var(--text)]">42ms</span>
                </div>
                <p className="text-[9px] font-mono text-[var(--muted)]">latency</p>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Activity size={10} className="text-[var(--success)]" />
                  <span className="text-xs font-mono text-[var(--success)]">99.8%</span>
                </div>
                <p className="text-[9px] font-mono text-[var(--muted)]">uptime</p>
              </div>

              <div className={`h-3 w-3 rounded-full ${gw.is_active ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'}`} style={{ boxShadow: `0 0 8px ${gw.is_active ? 'var(--success)' : 'var(--danger)'}` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
