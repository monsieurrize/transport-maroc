import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import BottomNav from '../components/BottomNav'
import { LogOut, Star, Truck, Package, ChevronRight } from 'lucide-react'

export default function Profile() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleSignOut() {
    setLoggingOut(true)
    await signOut()
    navigate('/login')
  }

  if (!profile) return <div className="loading-screen"><div className="spinner" /></div>

  const isCarrier = profile.role === 'carrier'

  return (
    <div className="page">
      <div className="page-header" style={{ paddingTop: 24, paddingBottom: 16 }}>
        <h1>Mon profil</h1>
      </div>
      <div className="page-content">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '8px 0 20px' }}>
          <div className="avatar" style={{ width: 72, height: 72, fontSize: '1.8rem' }}>{profile.full_name?.[0]?.toUpperCase()}</div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: 4 }}>{profile.full_name}</h2>
            <span className={`chip ${isCarrier ? 'chip-orange' : 'chip-gold'}`}>
              {isCarrier ? <><Truck size={12} /> Transporteur</> : <><Package size={12} /> Client</>}
            </span>
          </div>
          {profile.rating_avg
            ? <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold)' }}><Star size={14} fill="currentColor" /> {Number(profile.rating_avg).toFixed(1)} <span style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>({profile.rating_count} avis)</span></div>
            : <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Aucun avis pour l'instant</span>}
        </div>
        <div className="card" style={{ background: 'rgba(212,162,76,0.08)', borderColor: 'rgba(212,162,76,0.2)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Star size={16} color="var(--gold)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ color: 'var(--text2)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              Votre note est visible par tous. Les notes que vous donnez sont anonymes.
            </p>
          </div>
        </div>
        <div>
          <div className="section-title">Compte</div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {[
              { label: 'Mes annonces', icon: Package, path: '/' },
              isCarrier && { label: 'Mes offres envoyees', icon: Truck, path: '/' },
            ].filter(Boolean).map((item, i, arr) => (
              <div key={item.label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', cursor: 'pointer' }} onClick={() => navigate(item.path)}>
                  <item.icon size={18} color="var(--text2)" />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <ChevronRight size={16} color="var(--text3)" />
                </div>
                {i < arr.length - 1 && <div className="divider" style={{ margin: '0 18px' }} />}
              </div>
            ))}
          </div>
        </div>
        <button className="btn btn-secondary btn-full" onClick={handleSignOut} disabled={loggingOut} style={{ color: 'var(--red)', borderColor: 'rgba(224,82,82,0.2)', marginTop: 8 }}>
          <LogOut size={17} /> {loggingOut ? 'Deconnexion...' : 'Se deconnecter'}
        </button>
        <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '0.75rem' }}>TransMaroc v0.1</p>
      </div>
      <BottomNav />
    </div>
  )
}
