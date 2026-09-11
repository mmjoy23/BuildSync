import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/reset.css';
import './styles/tokens.css';
import './styles/global.css';
import './styles/components.css';
import './styles/ownerDashboard.css';
import './styles/ownerPortal.css';
import './styles/tenantDashboard.css';
import './styles/adminDashboard.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
