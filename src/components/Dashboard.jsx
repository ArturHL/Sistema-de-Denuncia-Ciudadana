import { useState, useMemo } from 'react';
import './Dashboard.css';
import { tiposDenuncia, prioridades, estados } from '../data/mockData';

const Dashboard = ({ denuncias, onNuevaDenuncia }) => {
  const [filtros, setFiltros] = useState({
    tipo: '',
    prioridad: '',
    estado: '',
    ciudad: '',
    fechaInicio: '',
    fechaFin: '',
    busqueda: '',
    soloAnonimas: false
  });

  const [denunciaExpandida, setDenunciaExpandida] = useState(null);

  const handleFiltroChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFiltros({
      ...filtros,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const limpiarFiltros = () => {
    setFiltros({
      tipo: '',
      prioridad: '',
      estado: '',
      ciudad: '',
      fechaInicio: '',
      fechaFin: '',
      busqueda: '',
      soloAnonimas: false
    });
  };

  const denunciasFiltradas = useMemo(() => {
    return denuncias.filter(denuncia => {
      // Filtro por tipo
      if (filtros.tipo && denuncia.tipo !== filtros.tipo) return false;

      // Filtro por prioridad
      if (filtros.prioridad && denuncia.prioridad !== filtros.prioridad) return false;

      // Filtro por estado
      if (filtros.estado && denuncia.estado !== filtros.estado) return false;

      // Filtro por ciudad
      if (filtros.ciudad && !denuncia.ciudad.toLowerCase().includes(filtros.ciudad.toLowerCase())) return false;

      // Filtro por rango de fechas
      if (filtros.fechaInicio && denuncia.fechaIncidente < filtros.fechaInicio) return false;
      if (filtros.fechaFin && denuncia.fechaIncidente > filtros.fechaFin) return false;

      // Filtro por búsqueda (título o descripción)
      if (filtros.busqueda) {
        const busquedaLower = filtros.busqueda.toLowerCase();
        const enTitulo = denuncia.titulo.toLowerCase().includes(busquedaLower);
        const enDescripcion = denuncia.descripcion.toLowerCase().includes(busquedaLower);
        if (!enTitulo && !enDescripcion) return false;
      }

      // Filtro solo anónimas
      if (filtros.soloAnonimas && !denuncia.anonimo) return false;

      return true;
    });
  }, [denuncias, filtros]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    const total = denuncias.length;
    const pendientes = denuncias.filter(d => d.estado === 'Pendiente').length;
    const resueltas = denuncias.filter(d => d.estado === 'Resuelta').length;

    // Tipo más común
    const conteoPorTipo = {};
    denuncias.forEach(d => {
      conteoPorTipo[d.tipo] = (conteoPorTipo[d.tipo] || 0) + 1;
    });
    const tipoMasComun = Object.keys(conteoPorTipo).reduce((a, b) =>
      conteoPorTipo[a] > conteoPorTipo[b] ? a : b, ''
    );

    return {
      total,
      pendientes,
      resueltas,
      tipoMasComun
    };
  }, [denuncias]);

  const toggleDetalles = (id) => {
    setDenunciaExpandida(denunciaExpandida === id ? null : id);
  };

  const getBadgeClass = (tipo, valor) => {
    if (tipo === 'prioridad') {
      const clases = {
        'Baja': 'badge-prioridad-baja',
        'Media': 'badge-prioridad-media',
        'Alta': 'badge-prioridad-alta',
        'Urgente': 'badge-prioridad-urgente'
      };
      return `badge ${clases[valor] || ''}`;
    }

    if (tipo === 'estado') {
      const clases = {
        'Pendiente': 'badge-estado-pendiente',
        'En revisión': 'badge-estado-revision',
        'En investigación': 'badge-estado-investigacion',
        'Resuelta': 'badge-estado-resuelta'
      };
      return `badge ${clases[valor] || ''}`;
    }

    return 'badge';
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-container">
      {/* Estadísticas */}
      <div className="estadisticas">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <p className="stat-label">Total de Denuncias</p>
            <p className="stat-value">{estadisticas.total}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <p className="stat-label">Pendientes</p>
            <p className="stat-value">{estadisticas.pendientes}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <p className="stat-label">Resueltas</p>
            <p className="stat-value">{estadisticas.resueltas}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <p className="stat-label">Tipo Más Común</p>
            <p className="stat-value stat-value-small">{estadisticas.tipoMasComun}</p>
          </div>
        </div>
      </div>

      {/* Botón Nueva Denuncia */}
      <div className="dashboard-header">
        <h2>Panel de Denuncias Ciudadanas</h2>
        <button className="btn-nueva-denuncia" onClick={onNuevaDenuncia}>
          ✍️ Nueva Denuncia
        </button>
      </div>

      {/* Filtros */}
      <div className="filtros-container">
        <h3 className="filtros-titulo">🔍 Filtros de Búsqueda</h3>

        <div className="filtros-grid">
          <div className="filtro-item">
            <label htmlFor="filtro-busqueda">Búsqueda</label>
            <input
              type="text"
              id="filtro-busqueda"
              name="busqueda"
              value={filtros.busqueda}
              onChange={handleFiltroChange}
              placeholder="Buscar en título o descripción..."
            />
          </div>

          <div className="filtro-item">
            <label htmlFor="filtro-tipo">Tipo</label>
            <select
              id="filtro-tipo"
              name="tipo"
              value={filtros.tipo}
              onChange={handleFiltroChange}
            >
              <option value="">Todos los tipos</option>
              {tiposDenuncia.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div className="filtro-item">
            <label htmlFor="filtro-prioridad">Prioridad</label>
            <select
              id="filtro-prioridad"
              name="prioridad"
              value={filtros.prioridad}
              onChange={handleFiltroChange}
            >
              <option value="">Todas las prioridades</option>
              {prioridades.map(prioridad => (
                <option key={prioridad} value={prioridad}>{prioridad}</option>
              ))}
            </select>
          </div>

          <div className="filtro-item">
            <label htmlFor="filtro-estado">Estado</label>
            <select
              id="filtro-estado"
              name="estado"
              value={filtros.estado}
              onChange={handleFiltroChange}
            >
              <option value="">Todos los estados</option>
              {estados.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>

          <div className="filtro-item">
            <label htmlFor="filtro-ciudad">Ciudad/Municipio</label>
            <input
              type="text"
              id="filtro-ciudad"
              name="ciudad"
              value={filtros.ciudad}
              onChange={handleFiltroChange}
              placeholder="Filtrar por ciudad..."
            />
          </div>

          <div className="filtro-item">
            <label htmlFor="filtro-fecha-inicio">Fecha Desde</label>
            <input
              type="date"
              id="filtro-fecha-inicio"
              name="fechaInicio"
              value={filtros.fechaInicio}
              onChange={handleFiltroChange}
            />
          </div>

          <div className="filtro-item">
            <label htmlFor="filtro-fecha-fin">Fecha Hasta</label>
            <input
              type="date"
              id="filtro-fecha-fin"
              name="fechaFin"
              value={filtros.fechaFin}
              onChange={handleFiltroChange}
            />
          </div>

          <div className="filtro-item filtro-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="soloAnonimas"
                checked={filtros.soloAnonimas}
                onChange={handleFiltroChange}
              />
              Solo denuncias anónimas
            </label>
          </div>
        </div>

        <div className="filtros-acciones">
          <button className="btn-limpiar-filtros" onClick={limpiarFiltros}>
            ✕ Limpiar Filtros
          </button>
          <span className="resultados-count">
            {denunciasFiltradas.length} resultado(s) encontrado(s)
          </span>
        </div>
      </div>

      {/* Lista de Denuncias */}
      <div className="denuncias-lista">
        {denunciasFiltradas.length === 0 ? (
          <div className="sin-resultados">
            <p>No se encontraron denuncias con los filtros seleccionados.</p>
          </div>
        ) : (
          denunciasFiltradas.map(denuncia => (
            <div key={denuncia.id} className="denuncia-card">
              <div className="denuncia-header">
                <div className="denuncia-info-principal">
                  <h3 className="denuncia-titulo">{denuncia.titulo}</h3>
                  <p className="denuncia-folio">Folio: {denuncia.folio}</p>
                </div>
                <div className="denuncia-badges">
                  <span className={getBadgeClass('prioridad', denuncia.prioridad)}>
                    {denuncia.prioridad}
                  </span>
                  <span className={getBadgeClass('estado', denuncia.estado)}>
                    {denuncia.estado}
                  </span>
                </div>
              </div>

              <div className="denuncia-body">
                <div className="denuncia-meta">
                  <span className="meta-item">
                    🏷️ <strong>Tipo:</strong> {denuncia.tipo}
                  </span>
                  <span className="meta-item">
                    📅 <strong>Fecha:</strong> {formatearFecha(denuncia.fechaIncidente)}
                  </span>
                  <span className="meta-item">
                    📍 <strong>Ubicación:</strong> {denuncia.ubicacion}, {denuncia.ciudad}
                  </span>
                  {denuncia.anonimo && (
                    <span className="meta-item anonimo-badge">
                      🔒 Anónima
                    </span>
                  )}
                </div>

                {denunciaExpandida === denuncia.id && (
                  <div className="denuncia-detalles">
                    <div className="detalle-seccion">
                      <h4>Descripción</h4>
                      <p>{denuncia.descripcion}</p>
                    </div>

                    {denuncia.horaIncidente && (
                      <div className="detalle-item">
                        <strong>Hora del incidente:</strong> {denuncia.horaIncidente}
                      </div>
                    )}

                    {denuncia.colonia && (
                      <div className="detalle-item">
                        <strong>Colonia:</strong> {denuncia.colonia}
                      </div>
                    )}

                    {!denuncia.anonimo && (
                      <div className="detalle-seccion">
                        <h4>Datos del Denunciante</h4>
                        <p><strong>Nombre:</strong> {denuncia.nombreDenunciante}</p>
                        <p><strong>Teléfono:</strong> {denuncia.telefonoDenunciante}</p>
                        <p><strong>Email:</strong> {denuncia.emailDenunciante}</p>
                      </div>
                    )}

                    {denuncia.archivos && denuncia.archivos.length > 0 && (
                      <div className="detalle-seccion">
                        <h4>Archivos Adjuntos</h4>
                        <ul>
                          {denuncia.archivos.map((archivo, idx) => (
                            <li key={idx}>📎 {archivo}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {denuncia.autoridadesInvolucradas && (
                      <div className="detalle-seccion">
                        <h4>Autoridades Involucradas</h4>
                        <p>{denuncia.autoridadesInvolucradas}</p>
                      </div>
                    )}

                    {denuncia.testigos && (
                      <div className="detalle-seccion">
                        <h4>Testigos</h4>
                        <p>{denuncia.testigos}</p>
                      </div>
                    )}

                    <div className="detalle-item">
                      <strong>Fecha de registro:</strong> {formatearFecha(denuncia.fechaRegistro)}
                    </div>
                  </div>
                )}
              </div>

              <div className="denuncia-footer">
                <button
                  className="btn-ver-detalles"
                  onClick={() => toggleDetalles(denuncia.id)}
                >
                  {denunciaExpandida === denuncia.id ? '▲ Ocultar detalles' : '▼ Ver detalles'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
