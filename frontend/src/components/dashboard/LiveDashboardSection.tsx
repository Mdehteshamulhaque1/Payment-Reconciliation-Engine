import { ExecutiveHero } from '@/components/ui/ExecutiveHero'
import { FlowMap } from '@/components/ui/FlowMap'
import { LiveStream } from '@/components/ui/LiveStream'
import { GatewayHealthCenter } from '@/components/ui/GatewayHealthCenter'

const BLUE = '#1e40af'

export default function LiveDashboardSection() {
  return (
    <>
      <div className="mb-6" style={{ borderRadius: '20px', border: `1px solid ${BLUE}12`, overflow: 'hidden', background: '#f8faff' }}>
        <ExecutiveHero />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div style={{ borderRadius: '20px', border: `1px solid ${BLUE}12`, overflow: 'hidden', background: '#f8faff' }}>
          <FlowMap />
        </div>
        <div style={{ borderRadius: '20px', border: `1px solid ${BLUE}12`, overflow: 'hidden', background: '#f8faff' }}>
          <LiveStream />
        </div>
      </div>
      <div style={{ borderRadius: '20px', border: `1px solid ${BLUE}12`, overflow: 'hidden', background: '#f8faff' }}>
        <GatewayHealthCenter />
      </div>
    </>
  )
}
