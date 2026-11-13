import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600.css'
import '@fontsource/lora/400.css'
import '@fontsource/dancing-script/400.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import Experience from './components/Experience.jsx'
import './components/SaveAlbum.jsx'
import './styles/global.css'
import './styles/book.css'
import './styles/interactions.css'

createRoot(document.getElementById('root')).render(<React.StrictMode><Experience /></React.StrictMode>)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}))
}
import './styles/refinements.css'
import './styles/storybook.css'

import './styles/welcome.css'
import './styles/polish.css'
import './styles/phase-two.css'
