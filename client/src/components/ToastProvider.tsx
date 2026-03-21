import { Toaster } from 'sonner'

const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#1a1917',
          border: '1px solid #2a2825',
          color: '#f5f0e8',
        },
      }}
      richColors
    />
  )
}

export default ToastProvider