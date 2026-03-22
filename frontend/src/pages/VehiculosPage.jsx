import { useState, useEffect } from 'react'
import { vehiculoService } from '../services/vehiculoService'
import { usuarioService } from '../services/usuarioService'
import { useAuth } from '../context/AuthContext'

const emptyForm = { patente:'', marca:'', modelo:'', color:'', usuarioId:'' }

export default function VehiculosPage() {
  const { user } = useAuth()
  const [vehiculos, setVehiculos] = useState([])
  const [usuarios, setUsuarios]   = useState([])
  const [modal, setModal]         = useState(false)
  const [editando, setEditando]   = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  const isAdmin = user?.rol === 'ADMINISTRADOR'

  useEffect(() => {
    cargar()
    if (isAdmin) usuarioService.listar().then(r => setUsuarios(r.data))
  }, [])

  const cargar = async () => {
    const res = isAdmin
      ? await vehiculoService.listar()
      : await vehiculoService.listarPorUsuario(user.id)
    setVehiculos(res.data)
  }

  const abrirNuevo = () => {
    setEditando(null)
    setForm({ ...emptyForm, usuarioId: isAdmin ? '' : user.id })
    setError('')
    setModal(true)
  }

  const abrirEditar = (v) => {
    setEditando(v.id)
    setForm({ patente:v.patente, marca:v.marca, modelo:v.modelo, color:v.color, usuarioId:v.usuarioId })
    setError('')
    setModal(true)
  }

  const guardar = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (editando) {
        await vehiculoService.actualizar(editando, { marca:form.marca, modelo:form.modelo, color:form.color })
      } else {
        await vehiculoService.registrar({ ...form, usuarioId: Number(form.usuarioId) })
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
    if (!confirm('¿Dar de baja este vehículo?')) return
    await vehiculoService.baja(id)
    cargar()
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <div className="page-header">
        <h2>Vehículos</h2>
        <button className="btn btn-primary" onClick={abrirNuevo}>+ Registrar vehículo</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patente</th><th>Marca</th><th>Modelo</th><th>Color</th>
                {isAdmin && <th>Titular</th>}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map(v => (
                <tr key={v.id}>
                  <td><strong>{v.patente}</strong></td>
                  <td>{v.marca}</td>
                  <td>{v.modelo}</td>
                  <td>{v.color}</td>
                  {isAdmin && <td>{v.usuarioNombre}</td>}
                  <td style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => abrirEditar(v)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => dar_baja(v.id)}>Baja</button>
                  </td>
                </tr>
              ))}
              {vehiculos.length === 0 && (
                <tr><td colSpan={isAdmin ? 6 : 5} style={{ textAlign:'center', color:'var(--text-muted)' }}>Sin vehículos registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <h3>{editando ? 'Editar vehículo' : 'Registrar vehículo'}</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={guardar}>
              {!editando && (
                <div className="form-group"><label>Patente</label>
                  <input required value={form.patente} onChange={e => set('patente', e.target.value.toUpperCase())}
                    placeholder="ABC123" style={{ textTransform:'uppercase' }} /></div>
              )}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 14px' }}>
                <div className="form-group"><label>Marca</label>
                  <input required value={form.marca} onChange={e => set('marca', e.target.value)} /></div>
                <div className="form-group"><label>Modelo</label>
                  <input required value={form.modelo} onChange={e => set('modelo', e.target.value)} /></div>
                <div className="form-group" style={{ gridColumn:'1/-1' }}><label>Color</label>
                  <input required value={form.color} onChange={e => set('color', e.target.value)} /></div>
                {isAdmin && !editando && (
                  <div className="form-group" style={{ gridColumn:'1/-1' }}><label>Usuario titular</label>
                    <select required value={form.usuarioId} onChange={e => set('usuarioId', e.target.value)}>
                      <option value="">Seleccionar usuario...</option>
                      {usuarios.map(u => (
                        <option key={u.id} value={u.id}>{u.nombre} {u.apellido} — {u.documento}</option>
                      ))}
                    </select></div>
                )}
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
