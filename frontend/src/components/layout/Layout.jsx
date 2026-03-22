import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Layout.css'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isAdmin  = user?.rol === 'ADMINISTRADOR'
  const canVehiculos = ['ADMINISTRADOR','USUARIO_UNIVERSITARIO'].includes(user?.rol)

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-text">SIGEP</span>
          <span className="logo-sub">Estacionamiento</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            Panel principal
          </NavLink>
          {isAdmin && (
            <NavLink to="/usuarios" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              Usuarios
            </NavLink>
          )}
          {canVehiculos && (
            <NavLink to="/vehiculos" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              Vehículos
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-name">{user?.nombre} {user?.apellido}</span>
            <span className="user-role">{user?.rol?.replace('_', ' ')}</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
