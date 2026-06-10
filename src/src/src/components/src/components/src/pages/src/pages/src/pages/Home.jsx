import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthProvider'
import BottomNav from '../components/BottomNav'
import { Plus, MapPin, Package, Calendar, Star, Search } from 'lucide-react'

function AnnouncementCard({ ann }) {
  const statusColor = { open: 'chip-green', in_negotiation: 'chip-orange', confirmed: 'chip-gold', delivered: 'chip-gray' }
  const statusLabel = { open: 'Ouverte', in_negotiation: 'En négociation', confirmed: 'Confirmée', delivered: 'Livrée' }
  return (
    <Link to={`/annonce/${ann.id}`} style={{ textDecoration: 'none' }}>
      <div className="card card-hover">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="route" style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <MapPin size={14} color="var(--accent2)" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>{ann.origin_city}</span>
            </div>
            <span className="route-arrow">→</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <MapPin size={14} color="var(--gold)" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>{ann.dest_city}</span>
            </div>
          </div>
          <span className={`chip ${statusColor[ann.status] || 'chip-gray'}`}>{statusLabel[ann.status] || ann.status}</span>
        </div>
        <div style={{ display: 'flex', gap: 16, color: 'var(--text2)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Package size={13} /> {ann.cargo_type}</span>
          {ann.estimated_weight_kg && <span>{ann.estimated_weight_kg} kg</span>}
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={13} /> {new Date(ann.pickup_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
        </div>
        {ann.profiles && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="avatar" style={{ width: 30, height: 30, fontSize: '0.8rem' }}>{ann.profiles.full_name?.[0]?.toUpperCase()}</div>
            <span style={{ color: 'var(--text2)', fontSize: '0.83rem' }}>{ann.profiles.full_name}</span>
            {ann.profiles.rating_avg && (
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gold)', fontSize: '0.83rem' }}>
                <Star size={12} fill="currentColor" /> {Number(ann.profiles.rating_avg).toFixed(1)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

export default function Home() {
  const { profile } = useAuth()
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchAnnouncements() }, [])

  async function fetchAnnouncements() {
    setLoading(true)
    const { data } = await supabase.from('announcements').select('*, profiles(full_name, rating_avg, rating_count)').eq('status', 'open').order('created_at', { ascending: false }).limit(50)
    setAnnouncements(data || [])
    setLoading(false)
  }

  const filtered = announcements.filter(a => !search || a.origin_city.toLowerCase().includes(search.toLowerCase()) || a.dest_city.toLowerCase().includes(search.toLowerCase()) || a.cargo_type.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="page">
      <div className="page-header" style={{ paddingTop: 24, paddingBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>Bonjour,</div>
            <h1 style={{ fontSize: '1.4rem' }}>{profile?.full_name?.split(' ')[0] || 'Bienvenue'} 👋</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text3)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>TRANS</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent2)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>MAROC</div>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', width: 18, height: 18 }} />
          <input className="input" style={{ paddingLeft: 42 }} placeholder="Rechercher une ville, un type…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="page-content">
        <div className="scroll-x">
          {['🇫🇷 France','🇪🇸 Espagne','🇧🇪 Belgique','🇳🇱 Pays-Bas','🇩🇪 Allemagne','🇮🇹 Italie'].map(c => (
            <span key={c} className="chip chip-orange" style={{ whiteSpace: 'nowrap' }}>{c}</span>
          ))}
        </div>
        <div>
          <div className="section-title">{filtered.length} annonce{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}</div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <Package size={48} />
              <h3>Aucune annonce</h3>
              <p style={{ fontSize: '0.9rem' }}>Soyez le premier à publier une annonce</p>
              <Link to="/nouvelle-annonce" className="btn btn-primary" style={{ marginTop: 8 }}><Plus size={18} /> Publier une annonce</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map(ann => <AnnouncementCard key={ann.id} ann={ann} />)}
            </div>
          )}
        </div>
      </div>
      {profile?.role === 'client' && (
        <Link to="/nouvelle-annonce" className="fab"><Plus size={26} /></Link>
      )}
      <BottomNav />
    </div>
  )
}
