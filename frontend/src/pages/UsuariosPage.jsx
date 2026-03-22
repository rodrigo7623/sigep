import { useState, useEffect } from 'react'
import { usuarioService } from '../services/usuarioService'

const ROLES = ['ADMINISTRADOR', 'GUARDIA', 'AUDITOR', 'USUARIO_UNIVERSITARIO']
const TIPOS = ['DOCENTE', 'ESTUDIANTE_CARRERA', 'ESTUDIANTE_CURSO', 'EXTERNO']
const BADGE = { ADMINISTRADOR:'badge-admin', GUARDIA:'badge-guardia', AUDITOR:'badge-auditor', USUARIO_UNIVERSITARIO:'badge-usuario' }

const emptyForm = { nombre:'', apellido:'', documento:'', email:'', password:'', matricula:'', telefono:'', tipoUsuario:'DOCENTE', rol:'USUARIO_UNIVERSITARIO' }

export default function UsuariosPage() {
  const [usuarios, setUsuarios]   = useState([])
  const [busqueda, setBusqueda]   = useState('')
  const [modal, setModal]         = useState(false)
  const [editando, setEditando]   = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    const res = await usuarioService.listar()
    setUsuarios(res.data)
  }

  const buscar = async (q) => {
    setBusqueda(q)
    if (q.trim().length < 2) return cargar()
    const res = await usuarioService.buscar(q)
    setUsuarios(res.data)
  }

  const abrirNuevo = () => {
    setEditando(null)
    setForm(emptyForm)
    setError('')
    setModal(true)
  }

  const abrirEditar = (u) => {
    setEditando(u.id)
    setForm({ nombre:u.nombre, apellido:u.apellido, documento:u.documento,
               email:u.email, password:'', matricula:u.matricula||'',
               telefono:u.telefono||'', tipoUsuario:u.tipoUsuario, rol:u.rol })
    setError('')
    setModal(true)
  }

  const guardar = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (editando) {
        await usuarioService.actualizar(editando, form)
      } else {
        await usuarioService.crear(form)
      }
      setModal(false)
      cargar()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const dar_baja = async (id) => {
    if (!confirm('¿Dar de baja este usuario?')) return
    await usuarioService.baja(id)
    cargar()
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <div className="page-header">
        <h2>Gestión de usuarios</h2>
        <button className="btn btn-primary" onClick={abrirNuevo}>+ Nuevo usuario</button>
      </div>

      <div className="card">
        <input
          className="form-group input" style={{ width:'100%', padding:'9px 12px', border:'1px solid var(--border)', borderRadius:'var(--radius)', marginBottom:16 }}
          placeholder="Buscar por nombre, documento o email..."
          value={busqueda} onChange={e => buscar(e.target.value)}
        />

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th><th>Documento</th><th>Email</th>
                <th>Tipo</th><th>Rol</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td>{u.nombre} {u.apellido}</td>
                  <td>{u.documento}</td>
                  <td>{u.email}</td>
                  <td>{u.tipoUsuario?.replace('_',' ')}</td>
                  <td><span className={`badge ${BADGE[u.rol]}`}>{u.rol?.replace('_',' ')}</span></td>
                  <td style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => abrirEditar(u)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => dar_baja(u.id)}>Baja</button>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign:'center', color:'var(--text-muted)' }}>Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <h3>{editando ? 'Editar usuario' : 'Nuevo usuario'}</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={guardar}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 14px' }}>
                <div className="form-group"><label>Nombre</label>
                  <input required value={form.nombre} onChange={e => set('nombre', e.target.value)} /></div>
                <div className="form-group"><label>Apellido</label>
                  <input required value={form.apellido} onChange={e => set('apellido', e.target.value)} /></div>
                <div className="form-group"><label>Documento</label>
                  <input required value={form.documento} onChange={e => set('documento', e.target.value)} /></div>
                <div className="form-group"><label>Email</label>
                  <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                {!editando && (
                  <div className="form-group" style={{ gridColumn:'1/-1' }}><label>Contraseña</label>
                    <input required type="password" minLength={6} value={form.password} onChange={e => set('password', e.target.value)} /></div>
                )}
                <div className="form-group"><label>Matrícula</label>
                  <input value={form.matricula} onChange={e => set('matricula', e.target.value)} /></div>
                <div className="form-group"><label>Teléfono</label>
                  <input value={form.telefono} onChange={e => set('telefono', e.target.value)} /></div>
                <div className="form-group"><label>Tipo de usuario</label>
                  <select value={form.tipoUsuario} onChange={e => set('tipoUsuario', e.target.value)}>
                    {TIPOS.map(t => <option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}
                  </select></div>
                <div className="form-group"><label>Rol del sistema</label>
                  <select value={form.rol} onChange={e => set('rol', e.target.value)}>
                    {ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g,' ')}</option>)}
                  </select></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
