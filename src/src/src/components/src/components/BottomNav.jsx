import { Link, useLocation } from 'react-router-dom'
import { Home, Search, PlusCircle, User } from 'lucide-react'

export default function BottomNav() {
  const { pathname } = useLocation()
  const items = [
    { to: '/', icon: Home, label: 'Accueil' },
    { to: '/annonces', icon: Search, label: 'Annonces' },
    { to: '/nouvelle-annonce', icon: PlusCircle, label: 'Publier' },
    { to: '/profil', icon: User, label: 'Profil' },
  ]
  return (
    <nav className="bottom-nav">
      {items.map(({ to, icon: Icon, label }) => (
        <Link key={to} to={to} className={`nav-item ${pathname === to ? 'active' : ''}`}>
          <Icon /><span>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
