import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, Zap } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { ScrollReveal } from '@/components/effects/ScrollReveal'
import { GatewayLogo } from '@/components/ui/GatewayLogo'
import { useGateways, useSimulateGateway } from '@/hooks/useGateways'
import { showToast } from '@/components/effects/Toast'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const fadeUp = { hidden: { opacity: 0, y: 16, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } }

export default function GatewaysPage() {
  const { data: gateways, isLoading } = useGateways()
  const [simulateGateway, setSimulateGateway] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Payment Gateways' description='Monitor gateway health and performance' breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Gateways' }]} />
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className='h-48 rounded-2xl' />)}
        </div>
      </div>
    )
  }

  return (
    <motion.div className='space-y-6' variants={stagger} initial='hidden' animate='show'>
      <ScrollReveal>
        <PageHeader
          title='Payment Gateways'
          description='Monitor gateway health and performance'
          breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Gateways' }]}
        />
      </ScrollReveal>

      <motion.div variants={fadeUp} className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {gateways?.map((gw) => (
          <SpotlightCard key={gw.id} className='p-6' >
            <div className='flex items-start gap-4 mb-4'>
              <GatewayLogo name={gw.name} size={48} />
              <div className='flex-1 min-w-0'>
                <h3 className='font-semibold text-lg truncate'>{gw.display_name}</h3>
                <p className='text-sm text-muted-foreground mt-0.5 capitalize'>{gw.gateway_type}</p>
              </div>
              {gw.is_active ? (
                <Badge variant='success' dot><Wifi size={12} /> Active</Badge>
              ) : (
                <Badge variant='danger' dot><WifiOff size={12} /> Inactive</Badge>
              )}
            </div>

            <div className='grid grid-cols-2 gap-3 text-sm'>
              <div className='rounded-xl bg-muted/30 p-3'>
                <p className='text-xs text-muted-foreground'>Type</p>
                <p className='font-semibold mt-1 capitalize'>{gw.gateway_type}</p>
              </div>
              <div className='rounded-xl bg-muted/30 p-3'>
                <p className='text-xs text-muted-foreground'>Mode</p>
                <p className='font-semibold mt-1 capitalize'>{gw.sandbox_mode ? 'Sandbox' : 'Production'}</p>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='mt-4'>
              <Button
                variant='outline'
                size='sm'
                className='w-full'
                onClick={() => setSimulateGateway(gw.name)}
              >
                <Zap size={14} className='mr-1.5' /> Simulate
              </Button>
            </motion.div>
          </SpotlightCard>
        ))}
      </motion.div>

      <Modal open={!!simulateGateway} onOpenChange={() => setSimulateGateway(null)} title={`Simulate: ${simulateGateway}`}>
        <SimulateForm gatewayName={simulateGateway!} onClose={() => setSimulateGateway(null)} />
      </Modal>
    </motion.div>
  )
}

function SimulateForm({ gatewayName, onClose }: { gatewayName: string; onClose: () => void }) {
  const simulateMutation = useSimulateGateway()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        simulateMutation.mutate(
          { name: gatewayName, data: { amount: Number(fd.get('amount')), currency: (fd.get('currency') as string) || 'INR' } },
          {
            onSuccess: (data) => {
              if (data.success) showToast('success', `Gateway responded in ${data.latency_ms}ms`)
              else showToast('error', data.error_message || 'Gateway simulation failed')
              onClose()
            },
            onError: (err) => showToast('error', err.message),
          }
        )
      }}
      className='space-y-4'
    >
      <Input label='Amount' name='amount' type='number' step='0.01' required placeholder='100.00' />
      <Input label='Currency' name='currency' defaultValue='INR' />
      <div className='flex justify-end gap-2'>
        <Button type='button' variant='outline' onClick={onClose}>Cancel</Button>
        <Button type='submit' loading={simulateMutation.isPending}>Run Simulation</Button>
      </div>
    </form>
  )
}
