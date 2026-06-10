import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthProvider'
import { ArrowLeft, ArrowRight, MapPin, Package, Calendar, CheckCircle } from 'lucide-react'

const CARGO_TYPES = ['Vetements / Textile','Electronique','Alimentaire','Meubles','Materiaux / BTP','Documents / Colis','Produits cosmetiques','Pieces auto','Autre']
const CITIES_MA = ['Casablanca','Marrakech','Agadir','Rabat','Tanger','Fes','Meknes','Oujda']
const CITIES_EU = ['Paris','Lyon','Marseille','Madrid','Barcelone','Bruxelles','Amsterdam','Milan','Berlin','Londres']

export default function NewAnnouncement() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ origin_city: '', origin_country: 'MA', dest_city: '', dest_country: 'FR', cargo_type: '', cargo_description: '', estimated_weight_kg: '', estimated_volume_m3: '', pickup_date: '', flexibility_days: '0', is_fragile: false, requires_cold_chain: false })

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  async function submit() {
    setLoading(true)
    setError('')
    const { error } = await supabase.from('announcements').insert({
      client_id: user.id, origin_city: form.origin_city, origin_country: form.origin_country,
      dest_city: form.dest_city, dest_country: form.dest_country, cargo_type: form.cargo_type,
      cargo_description: form.cargo_description, estimated_weight_kg: form.estimated_weight_kg || null,
      estimated_volume_m3: form.estimated_volume_m3 || null, pickup_date: form.pickup_date,
      flexibility_days: parseInt(form.flexibility_days), is_fragile: form.is_fragile,
      requires_cold_chain: form.requires_cold_chain, status: 'open',
      expires_at: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    })
    if (error) { setError('Une erreur est survenue'); setLoading(false); return }
    navigate('/')
    setLoading(false)
  }

  const countries = [['MA','🇲🇦 Maroc'],['FR','🇫🇷 France'],['ES','🇪🇸 Espagne'],['BE','🇧🇪 Belgique'],['NL','🇳🇱 Pays-Bas'],['DE','🇩🇪 Allemagne'],['IT','🇮🇹 Italie']]

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 0', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <button className="btn btn-ghost" onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/')} style={{ padding: 8 }}><ArrowLeft size={22} /></button>
          <h2>Nouvelle annonce</h2>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[1,2,3,4].map(s => <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? 'var(--accent)' : 'var(--bg3)', transition: 'background 0.3s' }} />)}
        </div>
      </div>
      <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 100 }}>
        {step === 1 && <>
          <h3 style={{ color: 'var(--text2)' }}>D'ou a ou ?</h3>
          <div className="input-group">
            <label className="input-label">Pays d'origine</label>
            <select className="input" value={form.origin_country} onChange={e => set('origin_country', e.target.value)}>
              {countries.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Ville d'enlevement</label>
            <input className="input" type="text" placeholder="ex: Casablanca" value={form.origin_city} onChange={e => set('origin_city', e.target.value)} list="cities-origin" />
            <datalist id="cities-origin">{[...CITIES_MA,...CITIES_EU].map(c => <option key={c} value={c} />)}</datalist>
          </div>
          <div style={{ textAlign: 'center', color: 'var(--accent2)', fontWeight: 700, fontSize: '1.4rem' }}>↓</div>
          <div className="input-group">
            <label className="input-label">Pays de destination</label>
            <select className="input" value={form.dest_country} onChange={e => set('dest_country', e.target.value)}>
              {countries.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Ville de livraison</label>
            <input className="input" type="text" placeholder="ex: Paris" value={form.dest_city} onChange={e => set('dest_city', e.target.value)} list="cities-dest" />
            <datalist id="cities-dest">{[...CITIES_EU,...CITIES_MA].map(c => <option key={c} value={c} />)}</datalist>
          </div>
        </>}
        {step === 2 && <>
          <h3 style={{ color: 'var(--text2)' }}>Que transportez-vous ?</h3>
          <div className="input-group">
            <label className="input-label">Type de marchandise</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CARGO_TYPES.map(type => (
                <button key={type} type="button" onClick={() => set('cargo_type', type)} className="chip"
                  style={{ cursor: 'pointer', border: '1px solid', borderColor: form.cargo_type === type ? 'var(--accent)' : 'var(--border)', background: form.cargo_type === type ? 'rgba(193,68,14,0.15)' : 'var(--bg3)', color: form.cargo_type === type ? 'var(--accent2)' : 'var(--text2)', padding: '8px 14px' }}>
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Description (optionnel)</label>
            <textarea className="input" placeholder="Decrivez votre marchandise..." value={form.cargo_description} onChange={e => set('cargo_description', e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Poids (kg)</label>
              <input className="input" type="number" placeholder="50" value={form.estimated_weight_kg} onChange={e => set('estimated_weight_kg', e.target.value)} min="0" />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Volume (m3)</label>
              <input className="input" type="number" placeholder="0.5" value={form.estimated_volume_m3} onChange={e => set('estimated_volume_m3', e.target.value)} min="0" step="0.1" />
            </div>
          </div>
          {[{field:'is_fragile',label:'Marchandise fragile'},{field:'requires_cold_chain',label:'Chaine du froid requise'}].map(({field,label}) => (
            <div key={field} onClick={() => set(field, !form[field])} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ color: 'var(--text2)' }}>{label}</span>
              <div style={{ width: 44, height: 26, borderRadius: 13, background: form[field] ? 'var(--accent)' : 'var(--bg3)', position: 'relative', transition: 'background 0.2s' }}>
                <div style={{ position: 'absolute', top: 3, left: form[field] ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
              </div>
            </div>
          ))}
        </>}
        {step === 3 && <>
          <h3 style={{ color: 'var(--text2)' }}>Quand ?</h3>
          <div className="input-group">
            <label className="input-label">Date d'enlevement souhaitee</label>
            <input className="input" type="date" value={form.pickup_date} onChange={e => set('pickup_date', e.target.value)} min={new Date().toISOString().split('T')[0]} required />
          </div>
          <div className="input-group">
            <label className="input-label">Flexibilite</label>
            <select className="input" value={form.flexibility_days} onChange={e => set('flexibility_days', e.target.value)}>
              <option value="0">Date exacte</option>
              <option value="3">+/- 3 jours</option>
              <option value="7">+/- 1 semaine</option>
              <option value="14">+/- 2 semaines</option>
            </select>
          </div>
        </>}
        {step === 4 && <>
          <h3 style={{ color: 'var(--text2)' }}>Recapitulatif</h3>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div className="section-title">Trajet</div>
              <div className="route">
                <span style={{ fontWeight: 700 }}>{form.origin_city} ({form.origin_country})</span>
                <span className="route-arrow">→</span>
                <span style={{ fontWeight: 700 }}>{form.dest_city} ({form.dest_country})</span>
              </div>
            </div>
            <div className="divider" />
            <div>
              <div className="section-title">Marchandise</div>
              <div>{form.cargo_type}</div>
              <div style={{ marginTop: 6, display: 'flex', gap: 12, color: 'var(--text2)', fontSize: '0.85rem' }}>
                {form.estimated_weight_kg && <span>{form.estimated_weight_kg} kg</span>}
                {form.estimated_volume_m3 && <span>{form.estimated_volume_m3} m3</span>}
              </div>
            </div>
            <div className="divider" />
            <div>
              <div className="section-title">Date</div>
              <div>{form.pickup_date && new Date(form.pickup_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
          </div>
          {error && <p style={{ color: 'var(--red)', textAlign: 'center', fontSize: '0.87rem' }}>{error}</p>}
        </>}
        <div style={{ marginTop: 'auto', paddingTop: 16 }}>
          {step < 4 ? (
            <button className="btn btn-primary btn-full" onClick={() => setStep(s => s + 1)}
              disabled={(step===1 && (!form.origin_city || !form.dest_city)) || (step===2 && !form.cargo_type) || (step===3 && !form.pickup_date)}>
              Continuer <ArrowRight size={18} />
            </button>
          ) : (
            <button className="btn btn-primary btn-full" onClick={submit} disabled={loading}>
              {loading ? 'Publication...' : 'Publier l\'annonce'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
