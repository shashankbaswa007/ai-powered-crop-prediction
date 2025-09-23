import '../styles/globals.css'
import { AppProvider } from '../context/AppContext'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  // Initialize theme on app load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light'
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }
  }, [])

  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  )
}

export default MyApp