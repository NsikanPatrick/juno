import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'; // Conversational AI
import App from './Generative/App.jsx'; // Generative AI - Analyses texts, images, links
// import App from './ImageGeneration/App.jsx'; // Image generation AI. This has a few issues at the moment

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
