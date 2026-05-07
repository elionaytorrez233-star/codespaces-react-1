import React from 'react';

function Inicio({ rotaciones, admisiones, eventos }) {
  const totalProg = rotaciones.length;
  const totalAdm = admisiones.length;
  const evFuturos = eventos.filter(ev => new Date(ev.fecha + 'T00:00:00') >= new Date().setHours(0,0,0,0)).length;

  return (
    <>
      <div className="hero">
        <h1>Bienvenidos a UNERG CRH 27</h1>
        <p>COORDINADOR: DR. Argimiro Mendoza </p>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="icon"></div>
          <div className="number">{totalProg}</div>
          <div>Rotaciones</div>
        </div>
        <div className="stat-card">
          <div className="icon"></div>
          <div className="number">{totalAdm}</div>
          <div>Inscritos</div>
        </div>
        <div className="stat-card">
          <div className="icon"></div>
          <div className="number">{evFuturos}</div>
          <div>Próximos eventos</div>
        </div>
      </div>
    </>
  );
}

export default Inicio;