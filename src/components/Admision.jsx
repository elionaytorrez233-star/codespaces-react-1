import React, { useState, useEffect } from 'react';

function Admision({ rotaciones, admisiones, updateAdmisiones, isAdmin }) {
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', nivel: '', programaId: '', mensaje: '' });

  useEffect(() => {
    // Update dropdown when rotaciones change
  }, [rotaciones]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !formData.telefono || !formData.nivel) return alert('Completa los campos obligatorios.');
    const newAdmision = {
      id: Date.now().toString(),
      ...formData,
      fecha: new Date().toISOString()
    };
    updateAdmisiones([...admisiones, newAdmision]);
    setFormData({ nombre: '', email: '', telefono: '', nivel: '', programaId: '', mensaje: '' });
  };

  const eliminarAdmision = (id) => {
    updateAdmisiones(admisiones.filter(a => a.id !== id));
  };

  // Calcular totales por nivel
  const totalesPorNivel = {
    '4to año': admisiones.filter(a => a.nivel === '4to año').length,
    '5to año': admisiones.filter(a => a.nivel === '5to año').length,
    '6to año': admisiones.filter(a => a.nivel === '6to año').length,
    'Egresados': admisiones.filter(a => a.nivel === 'Egresados').length,
  };

  return (
    <>
      <div className="card">
        <h2> Formulario de Admisión</h2>
        <p style={{color:'var(--text-light)', marginBottom:'16px'}}>Completa tus datos para inscribirte. Selecciona tu nivel académico.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre completo </label>
              <input type="text" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Correo electrónico </label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Teléfono </label>
              <input type="tel" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Nivel académico *</label>
              <select value={formData.nivel} onChange={(e) => setFormData({...formData, nivel: e.target.value})} required>
                <option value="">-- Selecciona --</option>
                <option value="4to año">4to año</option>
                <option value="5to año">5to año</option>
                <option value="6to año">6to año</option>
                <option value="Egresados">Egresados</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Rotación de interés (opcional)</label>
            <select value={formData.programaId} onChange={(e) => setFormData({...formData, programaId: e.target.value})}>
              <option value="">Ninguno en específico</option>
              {rotaciones.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Mensaje o comentarios</label>
            <textarea value={formData.mensaje} onChange={(e) => setFormData({...formData, mensaje: e.target.value})} rows="2"></textarea>
          </div>
          <button type="submit" className="btn btn-primary">✅ Enviar Inscripción</button>
        </form>
      </div>
      <div className="card">
        <h3>Inscripciones por Nivel Académico</h3>
        {isAdmin ? (
          <div className="stats-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:'16px', marginBottom:'24px'}}>
            <div style={{background:'rgba(252, 163, 17, 0.12)', border:'1px solid rgba(252, 163, 17, 0.3)', borderRadius:'12px', padding:'16px', textAlign:'center'}}>
              <div style={{fontSize:'1.8rem', fontWeight:'900', color:'var(--accent)'}}>
                {totalesPorNivel['4to año']}
              </div>
              <div style={{fontSize:'0.9rem', color:'var(--text-muted)', marginTop:'6px'}}>4to año</div>
            </div>
            <div style={{background:'rgba(252, 163, 17, 0.12)', border:'1px solid rgba(252, 163, 17, 0.3)', borderRadius:'12px', padding:'16px', textAlign:'center'}}>
              <div style={{fontSize:'1.8rem', fontWeight:'900', color:'var(--accent)'}}>
                {totalesPorNivel['5to año']}
              </div>
              <div style={{fontSize:'0.9rem', color:'var(--text-muted)', marginTop:'6px'}}>5to año</div>
            </div>
            <div style={{background:'rgba(252, 163, 17, 0.12)', border:'1px solid rgba(252, 163, 17, 0.3)', borderRadius:'12px', padding:'16px', textAlign:'center'}}>
              <div style={{fontSize:'1.8rem', fontWeight:'900', color:'var(--accent)'}}>
                {totalesPorNivel['6to año']}
              </div>
              <div style={{fontSize:'0.9rem', color:'var(--text-muted)', marginTop:'6px'}}>6to año</div>
            </div>
            <div style={{background:'rgba(252, 163, 17, 0.12)', border:'1px solid rgba(252, 163, 17, 0.3)', borderRadius:'12px', padding:'16px', textAlign:'center'}}>
              <div style={{fontSize:'1.8rem', fontWeight:'900', color:'var(--accent)'}}>
                {totalesPorNivel['Egresados']}
              </div>
              <div style={{fontSize:'0.9rem', color:'var(--text-muted)', marginTop:'6px'}}>Egresados</div>
            </div>
          </div>
        ) : (
          <div style={{padding:'20px', borderRadius:'18px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'var(--text-muted)'}}>
            <strong>Acceso restringido:</strong> Las estadísticas por año y egresados son privadas y se muestran solo al administrador.
          </div>
        )}
      </div>
      <div className="card">
        <h3>👥 Personas Inscritas (<span>{admisiones.length}</span>)</h3>
        {isAdmin ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Nombre</th><th>Email</th><th>Nivel</th><th>Programa</th><th></th></tr>
              </thead>
              <tbody>
                {admisiones.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign:'center',color:'var(--text-light)'}}>No hay inscritos aún.</td></tr>
                ) : (
                  admisiones.map(a => {
                    const prog = rotaciones.find(p => p.id === a.programaId);
                    return (
                      <tr key={a.id}>
                        <td>{a.nombre}</td>
                        <td>{a.email}</td>
                        <td><span className="badge badge-info">{a.nivel}</span></td>
                        <td>{prog ? prog.nombre : '-'}</td>
                        <td><button className="btn btn-danger btn-sm" onClick={() => eliminarAdmision(a.id)}>🗑</button></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{padding:'20px', borderRadius:'18px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'var(--text-muted)'}}>
            La lista de inscritos y sus datos solo se muestran al administrador.
          </div>
        )}
      </div>
    </>
  );
}

export default Admision;