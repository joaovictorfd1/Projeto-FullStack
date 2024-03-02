import { toast } from 'react-toastify';
export const Alert = (type: string, message: string) => {
  const validTypes = ['success', 'error', 'warning', 'info'];
  const toastType = validTypes.includes(type) ? type : 'default';
  return toast[toastType](message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  })
}