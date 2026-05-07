import React, { useState } from 'react';

function Bitacora({ bitacora, updateBitacora, isAdmin }) {
  const [formData, setFormData] = useState({ titulo: '', contenido: '', archivos: [] });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const promises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result });
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then(archivos => {
      setFormData({ ...formData, archivos });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.contenido.trim()) return alert('Título y contenido son obligatorios.');
    const newEntrada = {
      id: Date.now().toString(),
      titulo: formData.titulo.trim(),
      contenido: formData.contenido.trim(),
      archivos: formData.archivos,
      fecha: new Date().toISOString()
    };
    updateBitacora([...bitacora, newEntrada]);
    setFormData({ titulo: '', contenido: '', archivos: [] });
  };

  const eliminarEntrada = (id) => {
    updateBitacora(bitacora.filter(b => b.id !== id));
  };

  const sortedBitacora = [...bitacora].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <>
      <div className="card">
        <h2>  Publicaciones</h2>
        {isAdmin ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título de la entrada *</label>
              <input type="text" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Contenido *</label>
              <textarea value={formData.contenido} onChange={(e) => setFormData({...formData, contenido: e.target.value})} rows="5" required></textarea>
            </div>
            <div className="form-group">
              <label>Adjuntar archivos (imágenes o documentos)</label>
              <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={handleFileChange} />
              {formData.archivos.length > 0 && (
                <div style={{marginTop:'8px'}}>
                  <small>Archivos seleccionados: {formData.archivos.map(f => f.name).join(', ')}</small>
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary">📝 Publicar Entrada</button>
          </form>
        ) : (
          <div style={{padding:'20px', borderRadius:'18px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'var(--text-muted)'}}>
            <strong>Acceso restringido:</strong> Solo el administrador puede publicar nuevas entradas.
          </div>
        )}
      </div>
      <div className="card">
        <h3> Últimas publicaciones</h3>
        <div>
          {sortedBitacora.length === 0 ? (
            <p style={{textAlign:'center',color:'var(--text-light)'}}>No hay publicaciones aún.</p>
          ) : (
            sortedBitacora.map(b => (
              <div key={b.id} style={{background:'rgba(252, 163, 17, 0.12)', border:'1px solid rgba(252, 163, 17, 0.3)', borderRadius:'12px', padding:'18px', marginBottom:'14px'}}>
                <h4 style={{marginBottom:'4px', color:'var(--text)'}}>{b.titulo}</h4>
                <small style={{color:'var(--accent)'}}>{new Date(b.fecha).toLocaleDateString('es', { year:'numeric', month:'long', day:'numeric' })}</small>
                <p style={{whiteSpace:'pre-wrap', marginTop:'8px', color:'var(--text)'}}>{b.contenido}</p>
                {b.archivos && b.archivos.length > 0 && (
                  <div style={{marginTop:'12px'}}>
                    <strong>Adjuntos:</strong>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'4px'}}>
                      {b.archivos.map((archivo, index) => (
                        archivo.type.startsWith('image/') ? (
                          <img key={index} src={archivo.data} alt={archivo.name} style={{maxWidth:'200px', maxHeight:'200px', borderRadius:'8px'}} />
                        ) : (
                          <a key={index} href={archivo.data} download={archivo.name} style={{color:'var(--accent)', textDecoration:'none'}}>
                            📎 {archivo.name}
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                )}
                {isAdmin && <button className="btn btn-danger btn-sm" onClick={() => eliminarEntrada(b.id)} style={{marginTop:'8px'}}>Eliminar</button>}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Bitacora;