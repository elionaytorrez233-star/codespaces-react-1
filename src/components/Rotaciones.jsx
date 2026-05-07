import React, { useState } from 'react';

function Rotaciones({ rotaciones, updateRotaciones, isAdmin }) {
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!formData.nombre.trim()) return;
    const newRotacion = { id: Date.now().toString(), nombre: formData.nombre.trim(), descripcion: formData.descripcion.trim() };
    updateRotaciones([...rotaciones, newRotacion]);
    setFormData({ nombre: '', descripcion: '' });
  };

  const eliminarRotacion = (id) => {
    if (!isAdmin) return;
    updateRotaciones(rotaciones.filter(p => p.id !== id));
  };

  return (
    <>
      <div className="card">
        <h2> Rotaciones Académicas</h2>
        {isAdmin ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre de la rotación *</label>
              <input type="text" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} placeholder="Ej: Rotación en Ciencias" required />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} rows="3" placeholder="Detalles de la rotación..."></textarea>
            </div>
            <button type="submit" className="btn btn-primary">➕ Agregar Rotación</button>
          </form>
        ) : (
          <p style={{ color: 'var(--text-muted)', marginBottom: '0' }}>Solo los administradores pueden agregar nuevas rotaciones. Puedes ver las rotaciones registradas.</p>
        )}
      </div>
      <div className="card">
        <h3> Rotaciones Registradas</h3>
        <div>
          {rotaciones.length === 0 ? (
            <p style={{textAlign:'center',color:'var(--text-light)'}}>No hay rotaciones registradas.</p>
          ) : (
            rotaciones.map(p => (
              <div key={p.id} style={{background:'rgba(252, 163, 17, 0.12)', border:'1px solid rgba(252, 163, 17, 0.3)', borderRadius:'10px', padding:'14px', marginBottom:'10px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div><strong style={{color:'var(--text)'}}>{p.nombre}</strong><br/><small style={{color:'var(--text-muted)'}}>{p.descripcion || 'Sin descripción'}</small></div>
                {isAdmin && (
                  <button className="btn btn-danger btn-sm" onClick={() => eliminarRotacion(p.id)}>🗑</button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Rotaciones;