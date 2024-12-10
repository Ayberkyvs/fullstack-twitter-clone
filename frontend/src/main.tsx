import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './hooks/ToastProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
	<ToastProvider>
		<BrowserRouter>
		{/* <QueryClientProvider client={queryClient}> */}
			<App />
		{/* </QueryClientProvider> */}
		</BrowserRouter>
	</ToastProvider>
  </StrictMode>,
)
