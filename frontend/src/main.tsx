import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import LoadingSpinner from './components/common/LoadingSpinner.tsx'
import Logo from './components/svgs/Logo.tsx'

const queryClient = new QueryClient({
	defaultOptions:{
		queries:{
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60 * 5
		}
	}
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
	<Suspense fallback={<div className='flex justify-center items-center w-full min-h-screen bg-base-100'><Logo className='fill-primary w-10 h-10'/></div>}>
	<BrowserRouter>
	<QueryClientProvider client={queryClient}>
		<App />
	</QueryClientProvider>
	</BrowserRouter>
	</Suspense>
  </StrictMode>,
)
