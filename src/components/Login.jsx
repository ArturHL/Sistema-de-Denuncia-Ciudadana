import { useState } from 'react';
import { useNavigate } from 'react-router';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación simple (usuario: admin, password: admin123)
    if (formData.usuario === 'admin' && formData.password === 'admin123') {
      onLogin();
      navigate('/dashboard');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🏛️</div>
          <h1>Sistema Ciudadano de Denuncias</h1>
          <p className="login-subtitulo">Plataforma de Transparencia</p>
        </div>

        <div className="login-info">
          <p>
            <strong>🔒 Área de Administración</strong>
          </p>
          <p>
            Acceso exclusivo para personal autorizado del sistema de denuncias.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group-login">
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              placeholder="Ingresa tu usuario"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group-login">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="btn-login">
            Iniciar Sesión
          </button>
        </form>

        <div className="login-demo-info">
          <p className="demo-badge">DEMO</p>
          <p><strong>Credenciales de prueba:</strong></p>
          <p>Usuario: <code>admin</code></p>
          <p>Contraseña: <code>admin123</code></p>
        </div>

        <div className="login-footer">
          <p>
            ¿Eres ciudadano y deseas reportar una denuncia?
          </p>
          <button
            type="button"
            className="btn-nueva-denuncia-login"
            onClick={() => navigate('/nueva-denuncia')}
          >
            ✍️ Ir al Formulario de Denuncia
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
