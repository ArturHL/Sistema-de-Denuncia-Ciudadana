import { useState } from 'react';
import './FormularioDenuncia.css';
import { tiposDenuncia, prioridades } from '../data/mockData';

const FormularioDenuncia = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    tipo: '',
    titulo: '',
    descripcion: '',
    fechaIncidente: '',
    horaIncidente: '',
    ubicacion: '',
    colonia: '',
    ciudad: '',
    anonimo: true,
    nombreDenunciante: '',
    telefonoDenunciante: '',
    emailDenunciante: '',
    archivos: [],
    autoridadesInvolucradas: '',
    testigos: '',
    prioridad: 'Media'
  });

  const [errores, setErrores] = useState({});
  const [archivosSeleccionados, setArchivosSeleccionados] = useState([]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'radio') {
      setFormData({
        ...formData,
        [name]: value === 'true'
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Limpiar error del campo
    if (errores[name]) {
      setErrores({
        ...errores,
        [name]: ''
      });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const nombresArchivos = files.map(f => f.name);
    setArchivosSeleccionados(nombresArchivos);
    setFormData({
      ...formData,
      archivos: nombresArchivos
    });
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.tipo) {
      nuevosErrores.tipo = 'El tipo de denuncia es obligatorio';
    }

    if (!formData.titulo.trim()) {
      nuevosErrores.titulo = 'El título es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria';
    }

    if (!formData.fechaIncidente) {
      nuevosErrores.fechaIncidente = 'La fecha del incidente es obligatoria';
    }

    if (!formData.ubicacion.trim()) {
      nuevosErrores.ubicacion = 'La ubicación es obligatoria';
    }

    if (!formData.ciudad.trim()) {
      nuevosErrores.ciudad = 'La ciudad/municipio es obligatoria';
    }

    if (!formData.anonimo) {
      if (!formData.nombreDenunciante.trim()) {
        nuevosErrores.nombreDenunciante = 'El nombre es obligatorio si no es anónimo';
      }
      if (!formData.telefonoDenunciante.trim()) {
        nuevosErrores.telefonoDenunciante = 'El teléfono es obligatorio si no es anónimo';
      }
      if (!formData.emailDenunciante.trim()) {
        nuevosErrores.emailDenunciante = 'El email es obligatorio si no es anónimo';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailDenunciante)) {
        nuevosErrores.emailDenunciante = 'Email inválido';
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validarFormulario()) {
      onSubmit(formData);
      // Limpiar formulario
      setFormData({
        tipo: '',
        titulo: '',
        descripcion: '',
        fechaIncidente: '',
        horaIncidente: '',
        ubicacion: '',
        colonia: '',
        ciudad: '',
        anonimo: true,
        nombreDenunciante: '',
        telefonoDenunciante: '',
        emailDenunciante: '',
        archivos: [],
        autoridadesInvolucradas: '',
        testigos: '',
        prioridad: 'Media'
      });
      setArchivosSeleccionados([]);
      setErrores({});
    }
  };

  const tieneErrores = Object.keys(errores).length > 0;

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <h2>Nueva Denuncia Ciudadana</h2>
        <p className="formulario-descripcion">
          Complete el siguiente formulario con la mayor precisión posible. Todos los campos marcados con
          <span className="obligatorio"> *</span> son obligatorios.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="formulario">
        {/* Tipo de Denuncia */}
        <div className="form-group">
          <label htmlFor="tipo">
            Tipo de Denuncia <span className="obligatorio">*</span>
          </label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className={errores.tipo ? 'error' : ''}
          >
            <option value="">Seleccione un tipo</option>
            {tiposDenuncia.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
          {errores.tipo && <span className="mensaje-error">{errores.tipo}</span>}
        </div>

        {/* Título */}
        <div className="form-group">
          <label htmlFor="titulo">
            Título de la Denuncia <span className="obligatorio">*</span>
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Resumen breve de la denuncia"
            className={errores.titulo ? 'error' : ''}
          />
          {errores.titulo && <span className="mensaje-error">{errores.titulo}</span>}
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label htmlFor="descripcion">
            Descripción Detallada <span className="obligatorio">*</span>
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe los hechos de manera clara y detallada"
            rows="6"
            className={errores.descripcion ? 'error' : ''}
          ></textarea>
          {errores.descripcion && <span className="mensaje-error">{errores.descripcion}</span>}
        </div>

        {/* Fecha y Hora */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fechaIncidente">
              Fecha del Incidente <span className="obligatorio">*</span>
            </label>
            <input
              type="date"
              id="fechaIncidente"
              name="fechaIncidente"
              value={formData.fechaIncidente}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={errores.fechaIncidente ? 'error' : ''}
            />
            {errores.fechaIncidente && <span className="mensaje-error">{errores.fechaIncidente}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="horaIncidente">Hora Aproximada</label>
            <input
              type="time"
              id="horaIncidente"
              name="horaIncidente"
              value={formData.horaIncidente}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Ubicación */}
        <div className="form-group">
          <label htmlFor="ubicacion">
            Ubicación/Dirección <span className="obligatorio">*</span>
          </label>
          <input
            type="text"
            id="ubicacion"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            placeholder="Calle y número"
            className={errores.ubicacion ? 'error' : ''}
          />
          {errores.ubicacion && <span className="mensaje-error">{errores.ubicacion}</span>}
        </div>

        {/* Colonia y Ciudad */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="colonia">Colonia/Barrio</label>
            <input
              type="text"
              id="colonia"
              name="colonia"
              value={formData.colonia}
              onChange={handleChange}
              placeholder="Colonia o barrio"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ciudad">
              Ciudad/Municipio <span className="obligatorio">*</span>
            </label>
            <input
              type="text"
              id="ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              placeholder="Ciudad o municipio"
              className={errores.ciudad ? 'error' : ''}
            />
            {errores.ciudad && <span className="mensaje-error">{errores.ciudad}</span>}
          </div>
        </div>

        {/* Anonimato */}
        <div className="form-group">
          <label>¿Deseas mantener tu identidad anónima? <span className="obligatorio">*</span></label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="anonimo"
                value="true"
                checked={formData.anonimo === true}
                onChange={handleChange}
              />
              Sí, deseo permanecer anónimo
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="anonimo"
                value="false"
                checked={formData.anonimo === false}
                onChange={handleChange}
              />
              No, puedo proporcionar mis datos
            </label>
          </div>
        </div>

        {/* Datos del Denunciante (Condicional) */}
        {!formData.anonimo && (
          <div className="seccion-condicional">
            <h3 className="seccion-titulo">Datos del Denunciante</h3>

            <div className="form-group">
              <label htmlFor="nombreDenunciante">
                Nombre Completo <span className="obligatorio">*</span>
              </label>
              <input
                type="text"
                id="nombreDenunciante"
                name="nombreDenunciante"
                value={formData.nombreDenunciante}
                onChange={handleChange}
                placeholder="Nombre completo"
                className={errores.nombreDenunciante ? 'error' : ''}
              />
              {errores.nombreDenunciante && <span className="mensaje-error">{errores.nombreDenunciante}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telefonoDenunciante">
                  Teléfono de Contacto <span className="obligatorio">*</span>
                </label>
                <input
                  type="tel"
                  id="telefonoDenunciante"
                  name="telefonoDenunciante"
                  value={formData.telefonoDenunciante}
                  onChange={handleChange}
                  placeholder="10 dígitos"
                  className={errores.telefonoDenunciante ? 'error' : ''}
                />
                {errores.telefonoDenunciante && <span className="mensaje-error">{errores.telefonoDenunciante}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="emailDenunciante">
                  Correo Electrónico <span className="obligatorio">*</span>
                </label>
                <input
                  type="email"
                  id="emailDenunciante"
                  name="emailDenunciante"
                  value={formData.emailDenunciante}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className={errores.emailDenunciante ? 'error' : ''}
                />
                {errores.emailDenunciante && <span className="mensaje-error">{errores.emailDenunciante}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Evidencia */}
        <div className="form-group">
          <label htmlFor="archivos">Evidencia/Archivos</label>
          <input
            type="file"
            id="archivos"
            name="archivos"
            onChange={handleFileChange}
            multiple
            accept="image/*,.pdf,.doc,.docx,video/*"
          />
          {archivosSeleccionados.length > 0 && (
            <div className="archivos-seleccionados">
              <p className="archivos-titulo">📎 Archivos seleccionados:</p>
              <ul>
                {archivosSeleccionados.map((nombre, index) => (
                  <li key={index}>{nombre}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Autoridades y Testigos */}
        <div className="form-group">
          <label htmlFor="autoridadesInvolucradas">Autoridades Involucradas (Opcional)</label>
          <textarea
            id="autoridadesInvolucradas"
            name="autoridadesInvolucradas"
            value={formData.autoridadesInvolucradas}
            onChange={handleChange}
            placeholder="Nombres y cargos de autoridades relacionadas"
            rows="3"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="testigos">Testigos (Opcional)</label>
          <textarea
            id="testigos"
            name="testigos"
            value={formData.testigos}
            onChange={handleChange}
            placeholder="Nombre y datos de contacto si los hay"
            rows="3"
          ></textarea>
        </div>

        {/* Prioridad */}
        <div className="form-group">
          <label htmlFor="prioridad">
            Prioridad <span className="obligatorio">*</span>
          </label>
          <select
            id="prioridad"
            name="prioridad"
            value={formData.prioridad}
            onChange={handleChange}
          >
            {prioridades.map(prioridad => (
              <option key={prioridad} value={prioridad}>{prioridad}</option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn-cancelar"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-enviar"
            disabled={tieneErrores && Object.values(errores).some(e => e)}
          >
            ✓ Enviar Denuncia
          </button>
        </div>

        {/* Mensaje informativo */}
        <div className="info-confidencialidad">
          <p>
            🔒 <strong>Confidencialidad:</strong> Tu información está protegida.
            Las denuncias anónimas no requieren datos personales y se procesarán
            con total discreción.
          </p>
        </div>
      </form>
    </div>
  );
};

export default FormularioDenuncia;
