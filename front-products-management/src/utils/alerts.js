import Swal from 'sweetalert2';

// Configuración base minimalista
const defaultConfig = {
  customClass: {
    popup: 'custom-swal-popup',
    title: 'custom-swal-title',
    content: 'custom-swal-content',
    confirmButton: 'custom-swal-confirm',
    cancelButton: 'custom-swal-cancel',
    actions: 'custom-swal-actions'
  },
  buttonsStyling: false,
  allowOutsideClick: false,
  allowEscapeKey: false,
  showConfirmButton: true,
  showCancelButton: false,
  confirmButtonText: 'OK',
  cancelButtonText: 'Cancelar',
  reverseButtons: true,
  focusConfirm: false,
  focusCancel: false
};

// Alerta de éxito
export const showSuccess = (title, text = '', options = {}) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'success',
    title,
    text,
    confirmButtonText: 'Entendido',
    ...options
  });
};

// Alerta de error
export const showError = (title, text = '', options = {}) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Entendido',
    ...options
  });
};

// Alerta de advertencia
export const showWarning = (title, text = '', options = {}) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'Entendido',
    ...options
  });
};

// Alerta de información
export const showInfo = (title, text = '', options = {}) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'info',
    title,
    text,
    confirmButtonText: 'Entendido',
    ...options
  });
};

// Confirmación
export const showConfirm = (title, text = '', options = {}) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
    ...options
  });
};

// Confirmación de eliminación
export const showDeleteConfirm = (title = '¿Eliminar?', text = 'Esta acción no se puede deshacer', options = {}) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    ...options
  });
};

// Alerta de carga
export const showLoading = (title = 'Cargando...') => {
  return Swal.fire({
    ...defaultConfig,
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
    showConfirmButton: false,
    showCancelButton: false
  });
};

// Cerrar alerta
export const closeAlert = () => {
  Swal.close();
};

export default {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showConfirm,
  showDeleteConfirm,
  showLoading,
  closeAlert
};
