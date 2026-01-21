import './Modal.css';

const Modal = ({ onClose, folio }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-success">✓</div>
          <h2>¡Denuncia Enviada Exitosamente!</h2>
        </div>

        <div className="modal-body">
          <p className="modal-mensaje">
            Tu denuncia ha sido registrada en el sistema y será revisada por las
            autoridades competentes.
          </p>

          <div className="modal-folio">
            <p className="folio-label">Tu número de folio es:</p>
            <p className="folio-numero">{folio}</p>
          </div>

          <div className="modal-info">
            <p>
              ⚠️ <strong>Importante:</strong> Guarda este número de folio para
              dar seguimiento a tu denuncia.
            </p>
            <p>
              📋 Puedes consultar el estado de tu denuncia en el Panel de
              Denuncias utilizando los filtros de búsqueda.
            </p>
            <p>
              🔒 Tu información está protegida y será tratada con
              confidencialidad.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-modal-cerrar" onClick={onClose}>
            Ir al Panel de Denuncias
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
