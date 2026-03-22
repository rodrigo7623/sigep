import { useAuth } from '../context/AuthContext'

const ROL_LABEL = {
  ADMINISTRADOR: 'Administrador',
  GUARDIA: 'Guardia',
  AUDITOR: 'Auditor',
  USUARIO_UNIVERSITARIO: 'Usuario Universitario',
}

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div>
      <div className="page-header">
        <h2>Panel principal</h2>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>
          Bienvenido, <strong>{user?.nombre} {user?.apellido}</strong>
        </p>
        <p style={{ marginTop: 6, fontSize: 14, color: 'var(--text-muted)' }}>
          Rol: <strong>{ROL_LABEL[user?.rol] || user?.rol}</strong>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {user?.rol === 'ADMINISTRADOR' && (
          <>
            <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Módulo activo</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)', marginTop: 6 }}>Usuarios</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Registro y gestión</p>
            </div>
            <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Módulo activo</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)', marginTop: 6 }}>Vehículos</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Registro y baja</p>
            </div>
          </>
        )}
        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sprint</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--success)', marginTop: 6 }}>Sprint 1</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Base del sistema</p>
        </div>
      </div>
    </div>
  )
}
