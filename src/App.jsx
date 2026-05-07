import React, { useState, useEffect } from 'react';
import './App.css';
import Inicio from './components/Inicio';
import Calendario from './components/Calendario';
import Rotaciones from './components/Rotaciones';
import Admision from './components/Admision';
import Bitacora from './components/Bitacora';

function App() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [navOpen, setNavOpen] = useState(false);

  const [eventos, setEventos] = useState([]);
  const [rotaciones, setRotaciones] = useState([]);
  const [admisiones, setAdmisiones] = useState([]);
  const [bitacora, setBitacora] = useState([]);

  const [adminUser, setAdminUser] = useState(null);
  const [loginInfo, setLoginInfo] = useState({ username: 'crh27', password: 'crh27800' });
  const [loginError, setLoginError] = useState('');  const [adminCredentials, setAdminCredentials] = useState({ username: 'admin', password: 'admin123' });
  const [changePasswordInfo, setChangePasswordInfo] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changePasswordError, setChangePasswordError] = useState('');
  useEffect(() => {
    const loadData = (key) => JSON.parse(localStorage.getItem(key) || '[]');
    setEventos(loadData('acaricua_eventos'));
    setRotaciones(loadData('acaricua_rotaciones'));
    setAdmisiones(loadData('acaricua_admisiones'));
    setBitacora(loadData('acaricua_bitacora'));

    const storedAdmin = localStorage.getItem('acaricua_admin_user');
    if (storedAdmin === 'admin') {
      setAdminUser(storedAdmin);
    }

    const storedCredentials = JSON.parse(localStorage.getItem('acaricua_admin_credentials') || '{"username": "admin", "password": "admin123"}');
    setAdminCredentials(storedCredentials);
  }, []);

  const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

  const updateEventos = (newEventos) => {
    setEventos(newEventos);
    saveData('acaricua_eventos', newEventos);
  };

  const updateRotaciones = (newRotaciones) => {
    setRotaciones(newRotaciones);
    saveData('acaricua_rotaciones', newRotaciones);
  };

  const updateAdmisiones = (newAdmisiones) => {
    setAdmisiones(newAdmisiones);
    saveData('acaricua_admisiones', newAdmisiones);
  };

  const updateBitacora = (newBitacora) => {
    setBitacora(newBitacora);
    saveData('acaricua_bitacora', newBitacora);
  };

  const showSection = (section) => {
    setActiveSection(section);
    setNavOpen(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { username, password } = loginInfo;
    if (username === adminCredentials.username && password === adminCredentials.password) {
      setAdminUser(username);
      localStorage.setItem('acaricua_admin_user', username);
      setLoginError('');
      setLoginInfo({ username: '', password: '' });
      setActiveSection('inicio');
      return;
    }
    setLoginError('Usuario o contraseña incorrectos.');
  };

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('acaricua_admin_user');
    setActiveSection('inicio');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = changePasswordInfo;
    if (currentPassword !== adminCredentials.password) {
      setChangePasswordError('Contraseña actual incorrecta.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePasswordError('Las nuevas contraseñas no coinciden.');
      return;
    }
    if (newPassword.length < 6) {
      setChangePasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    const newCredentials = { ...adminCredentials, password: newPassword };
    setAdminCredentials(newCredentials);
    localStorage.setItem('acaricua_admin_credentials', JSON.stringify(newCredentials));
    setChangePasswordError('');
    setChangePasswordInfo({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Contraseña cambiada exitosamente.');
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <img src="/images__1_-removebg-preview.png" alt="Logo UNERG" />
          <div>
            <strong>UNERG</strong>
            <span>CRH 27</span>
          </div>
        </div>
        <button className="hamburger" onClick={() => setNavOpen(!navOpen)}>☰</button>
        <ul className={`nav-links ${navOpen ? 'open' : ''}`}>
          <li><a href="#" data-section="inicio" className={activeSection === 'inicio' ? 'active' : ''} onClick={(e) => { e.preventDefault(); showSection('inicio'); }}>🏠 Inicio</a></li>
          <li><a href="#" data-section="calendario" className={activeSection === 'calendario' ? 'active' : ''} onClick={(e) => { e.preventDefault(); showSection('calendario'); }}>📅 Calendario</a></li>
          <li><a href="#" data-section="rotaciones" className={activeSection === 'rotaciones' ? 'active' : ''} onClick={(e) => { e.preventDefault(); showSection('rotaciones'); }}>📚 Rotaciones</a></li>
          <li><a href="#" data-section="admision" className={activeSection === 'admision' ? 'active' : ''} onClick={(e) => { e.preventDefault(); showSection('admision'); }}>📝 Admisión</a></li>
          <li><a href="#" data-section="nosotros" className={activeSection === 'nosotros' ? 'active' : ''} onClick={(e) => { e.preventDefault(); showSection('nosotros'); }}>📖 Sobre Nosotros</a></li>
          <li><a href="#" data-section="login" className={activeSection === 'login' ? 'active' : ''} onClick={(e) => { e.preventDefault(); showSection('login'); }}>🔐 Admin</a></li>
        </ul>
      </nav>

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {adminUser ? (
            <>
              <div style={{ color: 'var(--accent)', fontWeight: 700 }}>Administrador conectado</div>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <button className="btn btn-outline btn-sm" onClick={() => showSection('login')}>Acceso administrador</button>
          )}
        </div>
        <section className={`section ${activeSection === 'inicio' ? 'active' : ''}`}>
          <Inicio rotaciones={rotaciones} admisiones={admisiones} eventos={eventos} />
        </section>

        <section className={`section ${activeSection === 'calendario' ? 'active' : ''}`}>
          <Calendario eventos={eventos} updateEventos={updateEventos} isAdmin={!!adminUser} />
        </section>

        <section className={`section ${activeSection === 'rotaciones' ? 'active' : ''}`}>
          <Rotaciones rotaciones={rotaciones} updateRotaciones={updateRotaciones} isAdmin={!!adminUser} />
        </section>

        <section className={`section ${activeSection === 'admision' ? 'active' : ''}`}>
          <Admision rotaciones={rotaciones} admisiones={admisiones} updateAdmisiones={updateAdmisiones} isAdmin={!!adminUser} />
        </section>

        <section className={`section ${activeSection === 'login' ? 'active' : ''}`}>
          <div className="card">
            <h2>Ingreso de Administrador</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '18px' }}>Inicia sesión para ver las estadísticas privadas de estudiantes por año y egresados.</p>
            {adminUser ? (
              <div>
                <p>Ya estás conectado como administrador.</p>
                <button className="btn btn-primary" onClick={handleLogout}>Cerrar sesión</button>
                <hr style={{ margin: '20px 0', borderColor: 'rgba(255,255,255,0.1)' }} />
                <h3>Cambiar Contraseña</h3>
                <form onSubmit={handleChangePassword}>
                  <div className="form-group">
                    <label>Contraseña actual</label>
                    <input type="password" value={changePasswordInfo.currentPassword} onChange={(e) => setChangePasswordInfo({ ...changePasswordInfo, currentPassword: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Nueva contraseña</label>
                    <input type="password" value={changePasswordInfo.newPassword} onChange={(e) => setChangePasswordInfo({ ...changePasswordInfo, newPassword: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Confirmar nueva contraseña</label>
                    <input type="password" value={changePasswordInfo.confirmPassword} onChange={(e) => setChangePasswordInfo({ ...changePasswordInfo, confirmPassword: e.target.value })} required />
                  </div>
                  {changePasswordError && <div style={{ color: '#ffb3b3', marginBottom: '14px' }}>{changePasswordError}</div>}
                  <button type="submit" className="btn btn-primary">Cambiar Contraseña</button>
                </form>
              </div>
            ) : (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Usuario</label>
                  <input type="text" value={loginInfo.username} onChange={(e) => setLoginInfo({ ...loginInfo, username: e.target.value })} placeholder="admin" required />
                </div>
                <div className="form-group">
                  <label>Contraseña</label>
                  <input type="password" value={loginInfo.password} onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })} placeholder="********" required />
                </div>
                {loginError && <div style={{ color: '#ffb3b3', marginBottom: '14px' }}>{loginError}</div>}
                <button type="submit" className="btn btn-primary">Ingresar</button>
              </form>
            )}
          </div>
        </section>

        <section className={`section ${activeSection === 'nosotros' ? 'active' : ''}`}>
          <Bitacora bitacora={bitacora} updateBitacora={updateBitacora} isAdmin={!!adminUser} />
        </section>
      </div>
    </div>
  );
}

export default App;
