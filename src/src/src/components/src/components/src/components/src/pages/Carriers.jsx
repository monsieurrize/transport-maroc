import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import { Star, Truck, CheckCircle, Search, MapPin, Phone } from 'lucide-react'

function CarrierCard({ carrier }) {
  const [showContact, setShowContact] = useState(false)
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="avatar" style={{ width: 52, height: 52, fontSize: '1.3rem', background: carrier.kyc_status === 'approved' ? 'var(--green)' : 'var(--accent)' }}>
          {carrier.profiles?.full_name?.[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>
            {carrier.company_name || carrier.profiles?.full_name}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
            {carrier.kyc_status === 'approved' && (
              <span className="chip chip-green" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
                <CheckCircle size={10} /> Verifie RCS
              </span>
            )}
            {carrier.vehicle_type && (
              <span className="chip chip-gray" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
                <Truck size={10} /> {carrier.vehicle_type}
              </span>
            )}
          </div>
        </div>
        {carrier.profiles?.rating_avg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gold)', fontWeight: 700 }}>
            <Star size={14} fill="currentColor" />
            {Number(carrier.profiles.rating_avg).toFixed(1)}
          </div>
        )}
      </div>
      {carrier.routes_served && carrier.routes_served.length > 0 && (
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Routes</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {carrier.routes_served.map(route => (
              <span key={route} className="chip chip-orange" style={{ padding: '3px 8px', fontSize: '0.75rem' }}>
                <MapPin size={10} /> {route}
              </span>
            ))}
          </div>
        </div>
      )}
      {(carrier.max_weight_kg || carrier.max_volume_m3) && (
        <div style={{ display: 'flex', gap: 16, color: 'var(--text2)', fontSize: '0.83rem' }}>
          {carrier.max_weight_kg && <span>Max {carrier.max_weight_kg} kg</span>}
          {carrier.max_volume_m3 && <span>Max {carrier.max_volume_m3} m3</span>}
        </div>
      )}
      {carrier.profiles?.rating_count > 0 && (
        <div style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>
          {carrier.profiles.rating_count} avis client{carrier.profiles.rating_count > 1 ? 's' : ''}
        </div>
      )}
      <button className="btn btn-secondary btn-full" onClick={() => setShowContact(!showContact)} style={{ marginTop: 4 }}>
        <Phone size={16} /> Contacter ce transporteur
      </button>
      {showContact && (
        <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>
            Publiez une annonce — ce transporteur pourra vous faire une offre directement.
          </p>
          <a href="/nouvelle-annonce" className="btn btn-primary btn-full" style={{ marginTop: 4 }}>
            Publier une annonce
          </a>
        </div>
      )}
    </div>
  )
}

export default function Carriers() {
  const [carriers, setCarriers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchCarriers() }, [])

  async function fetchCarriers() {
    setLoading(true)
    const { data } = await supabase
      .from('carriers')
      .select('*, profiles(full_name, phone, rating_avg, rating_count)')
      .order('created_at', { ascending: false })
    setCarriers(data || [])
    setLoading(false)
  }

  const filtered = carriers.filter(c => {
    const name = (c.company_name || c.profiles?.full_name || '').toLowerCase()
    const routes = (c.routes_served || []).join(' ').toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase()) || routes.includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'verified' && c.kyc_status === 'approved')
    return matchSearch && matchFilter
  })

  return (
    <div className="page">
      <div className="page-header" style={{ paddingTop: 24, paddingBottom: 16 }}>
        <h1 style={{ marginBottom: 16 }}>Transporteurs</h1>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', width: 18, height: 18 }} />
          <input className="input" style={{ paddingLeft: 42 }} placeholder="Rechercher par nom ou route..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ key: 'all', label: 'Tous' }, { key: 'verified', label: 'Verifies RCS' }].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} className="chip"
              style={{ cursor: 'pointer', border: '1px solid', padding: '6px 14px', borderColor: filter === f.key ? 'var(--accent)' : 'var(--border)', background: filter === f.key ? 'rgba(193,68,14,0.15)' : 'var(--bg3)', color: filter === f.key ? 'var(--accent2)' : 'var(--text2)' }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="page-content">
        <div className="section-title">{filtered.length} transporteur{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}</div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Truck size={48} />
            <h3>Aucun transporteur</h3>
            <p style={{ fontSize: '0.9rem' }}>Les transporteurs apparaitront ici apres leur inscription</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(carrier => <CarrierCard key={carrier.id} carrier={carrier} />)}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
