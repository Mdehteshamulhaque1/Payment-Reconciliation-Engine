import { MapPin, Globe, Map, Smartphone, Crosshair, Clock, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import type { PaymentLocation } from '@/types/models'
import { formatDateTime } from '@/lib/utils'

interface LocationCardProps {
  location: PaymentLocation
}

export function LocationCard({ location }: LocationCardProps) {
  const mapsUrl = location.google_maps_url || `https://www.google.com/maps?q=${location.latitude},${location.longitude}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className='rounded-xl border border-border/50 bg-card p-4 space-y-3'
    >
      <div className='flex items-center gap-2 text-sm font-semibold text-foreground'>
        <MapPin className='w-4 h-4 text-primary' />
        Payment Location
      </div>

      <div className='grid grid-cols-[20px_1fr] gap-x-3 gap-y-2 text-xs'>
        <Map className='w-4 h-4 text-muted-foreground self-center' />
        <div>
          <span className='text-muted-foreground'>Coordinates:</span>{' '}
          <span className='font-mono'>{location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</span>
          {location.accuracy != null && (
            <span className='text-muted-foreground ml-1'>(±{location.accuracy.toFixed(1)}m)</span>
          )}
        </div>

        {(location.city || location.state || location.country) && (
          <>
            <Globe className='w-4 h-4 text-muted-foreground self-center' />
            <div>
              <span className='text-muted-foreground'>Address:</span>{' '}
              {[location.city, location.state, location.country].filter(Boolean).join(', ')}
            </div>
          </>
        )}

        {location.full_address && (
          <>
            <MapPin className='w-4 h-4 text-muted-foreground self-center' />
            <div className='text-muted-foreground truncate' title={location.full_address!}>
              {location.full_address}
            </div>
          </>
        )}

        {location.timezone && (
          <>
            <Clock className='w-4 h-4 text-muted-foreground self-center' />
            <div><span className='text-muted-foreground'>Timezone:</span> {location.timezone}</div>
          </>
        )}

        {location.ip_address && (
          <>
            <Globe className='w-4 h-4 text-muted-foreground self-center' />
            <div><span className='text-muted-foreground'>IP:</span> <span className='font-mono'>{location.ip_address}</span></div>
          </>
        )}

        {location.device_info && (
          <>
            <Smartphone className='w-4 h-4 text-muted-foreground self-center' />
            <div className='truncate' title={location.device_info!}>{location.device_info}</div>
          </>
        )}

        {location.location_capture_timestamp && (
          <>
            <Crosshair className='w-4 h-4 text-muted-foreground self-center' />
            <div><span className='text-muted-foreground'>Captured:</span> {formatDateTime(location.location_capture_timestamp)}</div>
          </>
        )}
      </div>

      <a
        href={mapsUrl}
        target='_blank'
        rel='noopener noreferrer'
        className='inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-1'
      >
        <ExternalLink className='w-3 h-3' />
        Open in Google Maps
      </a>
    </motion.div>
  )
}
