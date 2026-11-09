import ServiceCard from '@/components/ServiceCard'
import { listApprovedServices } from '@/lib/services'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const services = await listApprovedServices()
  return (
    <main>
      <h1>Local services</h1>
      {services === null ? <p role="status">The service directory is temporarily unavailable.</p>
        : services.length === 0 ? <p>No approved services are available yet.</p>
          : <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => <ServiceCard key={service.id} service={service} />)}
            </div>}
    </main>
  )
}
