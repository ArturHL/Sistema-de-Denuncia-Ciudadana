import { createBrowserRouter, Navigate, useNavigate } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import './App.css';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Login';
import FormularioDenuncia from './components/FormularioDenuncia';
import Dashboard from './components/Dashboard';
import Modal from './components/Modal';

// Componente para la ruta de Login
function LoginPage() {
  const { handleLogin } = useApp();
  const navigate = useNavigate();

  const onLogin = () => {
    handleLogin();
    navigate('/dashboard');
  };

  return <Login onLogin={onLogin} />;
}

// Componente para la ruta de Nueva Denuncia
function NuevaDenunciaPage() {
  const { agregarDenuncia, modalAbierto, folioGenerado, cerrarModal } = useApp();
  const navigate = useNavigate();

  return (
    <>
      <header className="header">
        <div className="header-content">
          <h1 className="header-titulo">
            🏛️ Sistema Ciudadano de Denuncias
          </h1>
          <p className="header-subtitulo">Plataforma de Transparencia</p>
        </div>
      </header>

      <main className="main-content">
        <FormularioDenuncia
          onSubmit={agregarDenuncia}
          onCancel={() => navigate('/login')}
        />
      </main>

      {modalAbierto && (
        <Modal onClose={cerrarModal} folio={folioGenerado} />
      )}

      <footer className="footer">
        <p>
          🔒 Tu información está protegida. Las denuncias anónimas mantienen
          total confidencialidad.
        </p>
        <p>
          📞 Para emergencias, comunícate al 911 | Para seguimiento de tu
          denuncia, utiliza tu número de folio.
        </p>
      </footer>
    </>
  );
}

// Componente para la ruta del Dashboard (protegida)
function DashboardPage() {
  const { isAuthenticated, denuncias, handleLogout } = useApp();
  const navigate = useNavigate();

  // Protección de ruta
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <header className="header">
        <div className="header-content">
          <h1 className="header-titulo">
            🏛️ Sistema Ciudadano de Denuncias
          </h1>
          <p className="header-subtitulo">Plataforma de Transparencia - Panel de Administración</p>
        </div>
        <nav className="nav">
          <button
            className="nav-btn active"
            onClick={() => navigate('/dashboard')}
          >
            📊 Panel de Denuncias
          </button>
          <button
            className="nav-btn"
            onClick={() => navigate('/nueva-denuncia')}
          >
            ✍️ Nueva Denuncia
          </button>
          <button
            className="nav-btn nav-btn-logout"
            onClick={() => {
              handleLogout();
              navigate('/login');
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </nav>
      </header>

      <main className="main-content">
        <Dashboard
          denuncias={denuncias}
          onNuevaDenuncia={() => navigate('/nueva-denuncia')}
        />
      </main>

      <footer className="footer">
        <p>
          🔒 Panel de administración - Acceso restringido a personal autorizado
        </p>
        <p>
          Sistema de gestión de denuncias ciudadanas
        </p>
      </footer>
    </>
  );
}

// Configuración del router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/nueva-denuncia',
    element: <NuevaDenunciaPage />
  },
  {
    path: '/dashboard',
    element: <DashboardPage />
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
]);

function App() {
  return (
    <div className="app">
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </div>
  );
}

export default App;
