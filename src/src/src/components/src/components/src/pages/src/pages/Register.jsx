import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Mail, Lock, User, Phone, ArrowRight, Truck, Package } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error: authError } = await supabase.auth.signUp({ email: form.email, password: form.password })
    if (authError) { setError(authError.message); setLoading(false); return }
    await supabase.from('profiles').upsert({ id: data.user.id, full_name: form.full_name, phone: form.phone, role })
    navigate('/')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg)' }}>
      <div className="form-page" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="form-logo">🚛 TransMaroc</div>
          <p className="form-subtitle">Créez votre compte gratuit</p>
        </div>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ textAlign: 'center', color: 'var(--text2)', marginBottom: 8 }}>Je suis…</p>
            {[
              { value: 'client', icon: Package, title: 'Client expéditeur', desc: 'Je veux envoyer ou recevoir des marchandises' },
              { value: 'carrier', icon: Truck, title: 'Transporteur', desc: "Je transporte des marchandises entre le Maroc et l'Europe" },
            ].map(({ value, icon: Icon, title, desc }) => (
              <div key={value} className="card card-hover" onClick={() => { setRole(value); setStep(2) }}
                style={{ display: 'flex', gap: 16, alignItems: 'center', borderColor: role === value ? 'var(--accent)' : 'var(--border)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon color="var(--accent2)" size={24} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{title}</div>
                  <div style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{desc}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, textAlign: 'center', color: 'var(--text2)', fontSize: '0.9rem' }}>
              Déjà un compte ?{' '}
              <Link to="/login" style={{ color: 'var(--accent2)', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
            </div>
          </div>
        )}
        {step === 2 && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button type="button" className="btn btn-ghost" onClick={() => setStep(1)} style={{ alignSelf: 'flex-start', padding: '4px 0', color: 'var(--text2)', fontSize: '0.85rem' }}>← Retour</button>
            <div className="input-group">
              <label className="input-label">Nom complet</label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', width: 18, height: 18 }} />
                <input className="input" style={{ paddingLeft: 42 }} type="text" placeholder="Votre nom" value={form.full_name} onChange={e => set('full_name', e.target.value)} required />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Téléphone</label>
              <div style={{ position: 'relative' }}>
                <Phone style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', width: 18, height: 18 }} />
                <input className="input" style={{ paddingLeft: 42 }} type="tel" placeholder="+33 6 xx xx xx xx" value={form.phone} onChange={e => set('phone', e.target.value)} required />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', width: 18, height: 18 }} />
                <input className="input" style={{ paddingLeft: 42 }} type="email" placeholder="votre@email.com" value={form.email} onChange={e => set('email', e.target.value)} required />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', width: 18, height: 18 }} />
                <input className="input" style={{ paddingLeft: 42 }} type="password" placeholder="Min. 8 caractères" value={form.password} onChange={e => set('password', e.target.value)} minLength={8} required />
              </div>
            </div>
            {error && <p style={{ color: 'var(--red)', fontSize: '0.87rem', textAlign: 'center' }}>{error}</p>}
            <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
