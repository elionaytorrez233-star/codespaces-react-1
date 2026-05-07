import React, { useState } from 'react';

function Calendario({ eventos, updateEventos, isAdmin }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({ titulo: '', fecha: '', descripcion: '' });

  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const diasSemana = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

  const primerDia = new Date(currentYear, currentMonth, 1).getDay();
  const diasEnMes = new Date(currentYear, currentMonth + 1, 0).getDate();
  const hoy = new Date();
  hoy.setHours(0,0,0,0);
  const hoyStr = hoy.toISOString().slice(0,10);
  const eventosVisibles = isAdmin ? eventos : eventos.filter(ev => {
    const d = new Date(ev.fecha + 'T00:00:00');
    return d >= hoy;
  });
  const evsMes = eventosVisibles.filter(ev => {
    const d = new Date(ev.fecha + 'T00:00:00');
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const fechasConEventos = new Set(evsMes.map(ev => ev.fecha));

  const handleDayClick = (fecha) => {
    setFormData({ titulo: '', fecha, descripcion: '' });
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.fecha) return alert('Completa título y fecha');
    if (editingEvent) {
      const newEventos = eventos.map(ev => ev.id === editingEvent.id ? { ...ev, ...formData } : ev);
      updateEventos(newEventos);
    } else {
      const newEvent = { id: Date.now().toString(), ...formData };
      updateEventos([...eventos, newEvent]);
    }
    setModalOpen(false);
  };

  const eliminarEvento = (id) => {
    updateEventos(eventos.filter(ev => ev.id !== id));
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <>
      <div className="card">
        <div className="calendar-header">
          <h2> Calendario de Eventos</h2>
          <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
            <button className="btn btn-outline btn-sm" onClick={prevMonth}>◀</button>
            <strong style={{minWidth:'140px',textAlign:'center'}}>{meses[currentMonth]} {currentYear}</strong>
            <button className="btn btn-outline btn-sm" onClick={nextMonth}>▶</button>
            {isAdmin ? (
              <button className="btn btn-primary btn-sm" onClick={() => handleDayClick('')}>+ Evento</button>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Solo administradores pueden agregar eventos</div>
            )}
          </div>
        </div>
        <div className="calendar-grid">
          {diasSemana.map(d => <div key={d} className="day-name">{d}</div>)}
          {Array.from({length: primerDia}, (_, i) => <div key={`empty-${i}`} className="day empty"></div>)}
          {Array.from({length: diasEnMes}, (_, dia) => {
            const fecha = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(dia+1).padStart(2,'0')}`;
            return (
              <div
                key={fecha}
                className={`day ${fecha === hoyStr ? 'today' : ''} ${fechasConEventos.has(fecha) ? 'has-event' : ''}`}
                onClick={isAdmin ? () => handleDayClick(fecha) : undefined}
                style={{ cursor: isAdmin ? 'pointer' : 'default' }}
              >
                {dia + 1}
              </div>
            );
          })}
        </div>
        <ul className="event-list">
          {evsMes.length === 0 ? (
            <p style={{textAlign:'center',color:'var(--text-light)'}}>No hay eventos este mes.</p>
          ) : (
            evsMes.map(ev => (
              <li key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>{ev.titulo}</strong> – {new Date(ev.fecha+'T00:00:00').toLocaleDateString('es')}</span>
                {isAdmin && <button className="btn btn-danger btn-sm" onClick={() => eliminarEvento(ev.id)}>🗑</button>}
              </li>
            ))
          )}
        </ul>
      </div>

      {modalOpen && isAdmin && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingEvent ? 'Editar Evento' : 'Nuevo Evento'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Título *</label>
                <input type="text" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Fecha *</label>
                <input type="date" value={formData.fecha} onChange={(e) => setFormData({...formData, fecha: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea rows="3" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})}></textarea>
              </div>
              <div style={{display:'flex',justifyContent:'flex-end',gap:'8px'}}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary btn-sm">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Calendario;