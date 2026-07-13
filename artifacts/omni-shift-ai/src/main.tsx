import { createRoot } from 'react-dom/client';
import { setBaseUrl } from '@workspace/api-client-react';
import App from './App';
import './index.css';

// Set the API base URL so all relative API calls go to the Railway server.
// Uses the environment variable if set, otherwise falls back to the live URL.
setBaseUrl(
  import.meta.env.VITE_API_URL || 'https://omni-shift-ai-api-production.up.railway.app'
);

createRoot(document.getElementById('root')!).render(<App />);
